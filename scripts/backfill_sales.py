import os
import requests
import json
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# --- 📅 CONFIGURATION ---
# Check if running in GitHub Actions (Automation Mode)
if os.environ.get("GITHUB_ACTIONS") == "true":
    print("🤖 AUTOMATION MODE: Syncing last 3 days...")
    START_DATE = date.today() - timedelta(days=3)
    END_DATE = date.today()
else:
    # MANUAL RE-RUN: Set this to your full history start date
    START_DATE = date(2025, 12, 27) 
    END_DATE = date(2026, 2, 28)

# --- 🔐 CREDENTIALS ---
load_dotenv(".env.local")
CHECKOUT_CHAMP_ID = os.environ.get("CHECKOUT_CHAMP_ID") 
CHECKOUT_CHAMP_PASS = os.environ.get("CHECKOUT_CHAMP_PASS") 

# If those are empty, stop immediately so we don't crash later
if not CHECKOUT_CHAMP_ID or not CHECKOUT_CHAMP_PASS:
    # Only print this warning if running locally to avoid log spam in cloud
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
    
    print(f"   🔎 Querying {formatted_date}...", end=" ")
    
    params = {
        "loginId": CHECKOUT_CHAMP_ID,
        "password": CHECKOUT_CHAMP_PASS,
        "startDate": formatted_date,
        "endDate": formatted_date,
        "resultsPerPage": 200
        # ❌ REMOVED: "orderStatus": "COMPLETE" to allow Refunds/Cancels
    }

    try:
        response = requests.get(endpoint, params=params)
        json_resp = response.json()
        
        # 🐛 FIX: Safe Unpacking Logic
        raw_orders = json_resp.get('data')
        
        if not raw_orders:
            msg = json_resp.get('message')
            if isinstance(msg, dict):
                # If message is a folder, look inside for data
                raw_orders = msg.get('data', [])
            elif isinstance(msg, str):
                # If message is text (e.g. "No records found"), stop here
                if "totalResults" not in str(json_resp): 
                    # Only print if it's an actual error, not just '0 results'
                    print(f"   ⚠️ API ERROR: {msg}") 
                raw_orders = []

        if not raw_orders:
            print("0 orders.")
            return []

        clean_orders = []
        skipped_count = 0
        
        for raw in raw_orders:
            # --- 🛡️ FILTER: SKIP JUNK & TESTS ---
            
            # 1. Skip Declined/Failed
            status = raw.get('orderStatus', '').upper()
            if status in ['DECLINED', 'FAILED', 'ERROR', 'PENDING']:
                skipped_count += 1
                continue
            
            # 2. Skip TEST transactions (Crucial Step)
            is_test = raw.get('test') # Usually boolean True/False or 1/0
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
                "status": "sale", # This stays generic, 'event_type' handles the specific status
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
        
        print(f"✅ Found {len(clean_orders)} valid orders! (Skipped {skipped_count} ignored)")
        return clean_orders

    except Exception as e:
        print(f"\n   ❌ Error on {formatted_date}: {e}")
        return []

def run_backfill():
    print(f"\n🚀 STARTING INTELLIGENT BACKFILL ({START_DATE} to {END_DATE})")
    # Debug print to confirm ID is being read (only shows first 4 chars)
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
                    print(f"⚠️ Error saving transaction {order['transaction_id']}: {e}")

                # 2. CLEAN UP OLD ITEMS (Crucial step to prevent duplicates)
                try:
                    supabase.table("transaction_items").delete().eq("transaction_id", order["transaction_id"]).execute()
                except:
                    pass # Ignore if none existed

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
    
    print(f"\n✨ COMPLETE! Processed {total_imported} orders with full details.")

if __name__ == "__main__":
    run_backfill()