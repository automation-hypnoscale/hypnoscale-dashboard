import os
import requests
import json
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# --- 📅 CONFIGURATION ---
# 1. Check for Sync Mode (Full vs. Refunds Only)
# 'FULL' = Download everything. 'REFUNDS' = Only check for bad statuses (fast).
SYNC_MODE = os.environ.get("SYNC_MODE", "FULL") 

# 2. Date Logic
if os.environ.get("SYNC_DAYS"):
    # If workflow sets days explicitly (e.g. 3 or 30)
    days = int(os.environ.get("SYNC_DAYS"))
    print(f"🤖 AUTOMATION MODE: Syncing last {days} days ({SYNC_MODE} sweep)...")
    START_DATE = date.today() - timedelta(days=days)
    END_DATE = date.today()
elif os.environ.get("GITHUB_ACTIONS") == "true":
    # Default fallback for GitHub Actions if variable missing
    print("🤖 AUTOMATION MODE: Defaulting to last 3 days...")
    START_DATE = date.today() - timedelta(days=3)
    END_DATE = date.today()
else:
    # MANUAL RE-RUN (Local Computer)
    print("🛠️ MANUAL MODE: Backfilling from Dec 27...")
    START_DATE = date(2025, 12, 27) 
    END_DATE = date(2026, 2, 28)

# --- 🔐 CREDENTIALS ---
load_dotenv(".env.local")
CHECKOUT_CHAMP_ID = os.environ.get("CHECKOUT_CHAMP_ID") 
CHECKOUT_CHAMP_PASS = os.environ.get("CHECKOUT_CHAMP_PASS") 

if not CHECKOUT_CHAMP_ID or not CHECKOUT_CHAMP_PASS:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        print("⚠️ WARNING: Credentials not found. Please check .env.local")

# SUPABASE
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def determine_event_type(raw):
    order_type = raw.get('orderType', '').upper()
    order_status = raw.get('orderStatus', '').upper()

    if order_status == 'REFUNDED':
        return 'refunded', 'Refund'
    if order_status == 'CANCELLED':
        return 'cancelled', 'Cancelled'
    if order_status == 'CHARGEBACK':
        return 'chargeback', 'Chargeback'
    
    if order_type == 'NEW_SALE' or order_type == 'SALE':
        return 'sale_new', 'Cold Traffic Revenue'
    elif order_type == 'RECURRING':
        return 'sale_recurring', 'MRR Revenue'
    elif order_type == 'UPSELL':
        return 'sale_upsell', 'Cold Traffic Revenue'
    
    return 'unknown', 'Other'

def fetch_orders_for_date(target_date):
    formatted_date = target_date.strftime("%m/%d/%Y")
    endpoint = "https://api.konnektive.com/order/query/"
    
    # ⚡ OPTIMIZATION: Define which statuses to check based on mode
    if SYNC_MODE == "REFUNDS":
        # In audit mode, we ONLY ask for these. API returns tiny payload. Fast.
        statuses_to_check = ["REFUNDED", "CANCELLED", "CHARGEBACK", "PARTIAL"]
    else:
        # In full mode, we ask for everything (None = no filter)
        statuses_to_check = [None] 

    all_cleaned_orders = []

    for status_filter in statuses_to_check:
        
        params = {
            "loginId": CHECKOUT_CHAMP_ID,
            "password": CHECKOUT_CHAMP_PASS,
            "startDate": formatted_date,
            "endDate": formatted_date,
            "resultsPerPage": 200
        }
        
        # Apply filter if we are checking a specific status
        if status_filter:
            print(f"   🔎 Checking {formatted_date} for [{status_filter}]...", end=" ")
            params["orderStatus"] = status_filter
        else:
            print(f"   🔎 Querying {formatted_date} (Full Sync)...", end=" ")

        try:
            response = requests.get(endpoint, params=params)
            json_resp = response.json()
            
            raw_orders = json_resp.get('data')
            
            if not raw_orders:
                msg = json_resp.get('message')
                if isinstance(msg, dict):
                    raw_orders = msg.get('data', [])
                elif isinstance(msg, str):
                    if "totalResults" not in str(json_resp): 
                        # Only print actual errors, skip standard "No records" messages
                        pass 
                    raw_orders = []

            if not raw_orders:
                # Silence "0 orders" spam if we are just sweeping for refunds
                if not status_filter: 
                    print("0 orders.")
                else: 
                    print("0.")
                continue # Move to next status check

            # --- PROCESS THE BATCH ---
            clean_orders = []
            skipped_count = 0
            
            for raw in raw_orders:
                # 1. Skip Declined/Failed
                status = raw.get('orderStatus', '').upper()
                if status in ['DECLINED', 'FAILED', 'ERROR', 'PENDING']:
                    skipped_count += 1
                    continue
                
                # 2. Skip TEST transactions
                is_test = raw.get('test')
                if is_test is True or str(is_test).lower() in ['true', '1']:
                    skipped_count += 1
                    continue

                # --- LOGIC MAPPING ---
                event_type, revenue_type = determine_event_type(raw)
                
                # Handle Refund Values (Make them negative)
                total_amount = float(raw.get('totalAmount', 0) or 0)
                if event_type in ['refunded', 'cancelled', 'chargeback']:
                    total_amount = -abs(total_amount)

                # --- ITEM PARSING ---
                raw_items = raw.get('items', [])
                items_list = []
                if isinstance(raw_items, dict):
                    items_list = list(raw_items.values())
                elif isinstance(raw_items, list):
                    items_list = raw_items

                clean_items = []
                for item in items_list:
                    if not item.get('name'): continue
                    
                    clean_items.append({
                        "product_name": item.get('name'),
                        "qty": int(item.get('qty', 1)),
                        "external_product_id": item.get('productId'),
                        "campaign_product_id": item.get('campaignProductId') or item.get('variantDetailId'),
                        "sku": item.get('sku') or item.get('productSku'),
                        "price": float(item.get('price', 0))
                    })

                # --- TRANSACTION BUILDING ---
                clean_orders.append({
                    "transaction_id": raw.get('orderId'),
                    "order_id": raw.get('orderId'),
                    "date": raw.get('dateCreated'),
                    "total_amount": total_amount,
                    "status": "sale",
                    "event_type": event_type,
                    "revenue_type": revenue_type,
                    "payment_status": raw.get('orderStatus'),
                    "campaign_id": raw.get('campaignId'),
                    "campaign_name": raw.get('campaignName'),
                    "traffic_source": raw.get('UTMSource') or raw.get('sourceValue1'),
                    "affiliate_id": raw.get('affId'),
                    "currency": raw.get('currencyCode', 'USD'),
                    "customer_email": raw.get('emailAddress'),
                    "customer_state": raw.get('state') or raw.get('shipState'),
                    "customer_country": raw.get('country') or raw.get('shipCountry'),
                    "raw_data": raw,  
                    "items": clean_items
                })
            
            # Print specific success message per status check
            if status_filter:
                print(f"✅ Found {len(clean_orders)} [{status_filter}].")
            else:
                print(f"✅ Found {len(clean_orders)} valid orders!")

            # Add this batch to the master list
            all_cleaned_orders.extend(clean_orders)

        except Exception as e:
            print(f"\n   ❌ Error on {formatted_date}: {e}")
            continue

    return all_cleaned_orders

def run_backfill():
    print(f"\n🚀 STARTING INTELLIGENT BACKFILL ({START_DATE} to {END_DATE})")
    print(f"   🔑 Using Login ID: {str(CHECKOUT_CHAMP_ID)[:4]}****") 
    
    current_date = START_DATE
    total_imported = 0

    while current_date <= END_DATE:
        orders = fetch_orders_for_date(current_date)
        
        if orders:
            total_imported += len(orders)
            for order in orders:
                # 1. Upsert Transaction (Overwrites if exists = Handles Status Changes)
                trans_data = {k:v for k,v in order.items() if k != "items"}
                
                try:
                    supabase.table("transactions").upsert(trans_data).execute()
                except Exception as e:
                    # Ignore known RLS errors if using anon key, but print others
                    if '42501' not in str(e):
                        print(f"⚠️ Error saving transaction {order['transaction_id']}: {e}")

                # 2. CLEAN UP OLD ITEMS
                try:
                    supabase.table("transaction_items").delete().eq("transaction_id", order["transaction_id"]).execute()
                except:
                    pass 

                # 3. Insert Fresh Items
                for item in order["items"]:
                    # Product Map (Only insert if new)
                    pid = str(item["external_product_id"])
                    try:
                        exists = supabase.table("product_map").select("product_id").eq("product_id", pid).execute()
                        if not exists.data:
                             supabase.table("product_map").insert({
                                "product_id": pid,
                                "offer_name": item["product_name"],
                                "units_per_variant": 1,
                                "status": "needs_review"
                            }).execute()
                    except:
                        pass 

                    # Save Item Details
                    supabase.table("transaction_items").insert({
                        "transaction_id": order["transaction_id"],
                        "product_name": item["product_name"],
                        "qty": item["qty"],
                        "external_product_id": pid,
                        "campaign_product_id": str(item["campaign_product_id"]),
                        "sku": item["sku"]
                    }).execute()

        current_date += timedelta(days=1)
    
    print(f"\n✨ COMPLETE! Processed {total_imported} records.")

if __name__ == "__main__":
    run_backfill()