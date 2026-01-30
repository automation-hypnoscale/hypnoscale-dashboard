import os
import random
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. SETUP: Load keys and connect to Supabase
load_dotenv(".env.local")
url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ Error: Missing API keys in .env.local")
    exit()

supabase: Client = create_client(url, key)
print("🚀 Starting Hypnoscale Sync...")

# ---------------------------------------------------------
# MOCK DATA GENERATORS (Simulating your APIs)
# ---------------------------------------------------------
def fetch_facebook_spend():
    """Generates fake ad spend for yesterday."""
    return {
        "date": (date.today() - timedelta(days=1)).isoformat(),
        "ad_spend_fb": round(random.uniform(50.0, 200.0), 2),
        "ad_spend_google": round(random.uniform(20.0, 80.0), 2)
    }

def fetch_checkoutchamp_orders():
    """Generates fake orders, including a mix of old and NEW products."""
    orders = []
    # Simulating 3 specific orders to test your system
    order_configs = [
        # 1. Standard Order: 1x Roller (Should deduct from $1.59 batch)
        {"id": "ORD-101", "product": "Nurovita® Cooling Roller - 1x Roller", "qty": 1, "pid": 2489}, 
        # 2. Mystery Order: A brand new bundle you haven't mapped yet!
        {"id": "ORD-102", "product": "Summer Mega Bundle (6x)", "qty": 1, "pid": 9999}, 
        # 3. Standard Order: 2x Warming Oil (Should deduct from $1.79 batch)
        {"id": "ORD-103", "product": "Natural Warming Oil - 2x Bottles", "qty": 1, "pid": 3011} 
    ]
    
    for cfg in order_configs:
        orders.append({
            "transaction_id": cfg["id"],
            "order_id": cfg["id"],
            "date": (date.today() - timedelta(days=1)).isoformat(),
            "total_amount": round(random.uniform(40, 150), 2),
            "status": "sale",
            "items": [{
                "product_name": cfg["product"],
                "qty": cfg["qty"],
                "external_product_id": cfg["pid"]
            }]
        })
    return orders

# ---------------------------------------------------------
# CORE LOGIC: FIFO & Auto-Discovery
# ---------------------------------------------------------

def process_inventory_deduction(product_id, qty_sold, transaction_id, product_name):
    """Finds the oldest batch for the base product and deducts stock."""
    
    # A. Get Base Product info from Product Map
    response = supabase.table("product_map").select("*").eq("product_id", product_id).execute()
    
    # Auto-Discovery Check happens in the main loop, so here we just check if mapped.
    if not response.data:
        print(f"   ⚠️ Inventory Skip: Product ID {product_id} is not mapped to a base product yet.")
        return

    mapping = response.data[0]
    base_product = mapping.get("base_product")
    units_per_variant = mapping.get("units_per_variant", 1)
    
    # If it's a new product (status='needs_review'), it might not have a base_product yet.
    if not base_product:
        print(f"   ⚠️ Inventory Skip: No base product defined for '{mapping['offer_name']}'.")
        return

    total_units_to_deduct = qty_sold * units_per_variant
    print(f"   📉 Processing: {qty_sold} sold x {units_per_variant} units = {total_units_to_deduct} {base_product}(s)")

    # B. Find Active Batches (FIFO - Ordered by ID)
    batches = supabase.table("inventory_batches")\
        .select("*")\
        .eq("base_product", base_product)\
        .eq("status", "active")\
        .order("batch_id")\
        .execute().data

    remaining_needed = total_units_to_deduct

    for batch in batches:
        if remaining_needed <= 0:
            break
            
        available = batch["remaining_qty"]
        take = min(available, remaining_needed)
        
        # C. Update the Batch in Database
        new_qty = available - take
        status = "active" if new_qty > 0 else "depleted"
        
        supabase.table("inventory_batches")\
            .update({"remaining_qty": new_qty, "status": status})\
            .eq("batch_id", batch["batch_id"])\
            .execute()

        # D. Log the Cost (Crucial for Profit Calculation)
        supabase.table("transaction_cost_ledger").insert({
            "transaction_id": transaction_id,
            "product_name": product_name,
            "batch_id": batch["batch_id"],
            "qty_deducted": take,
            "cost_per_unit_at_time": batch["unit_cost"]
        }).execute()
        
        remaining_needed -= take
        print(f"      ✅ Deducted {take} from Batch #{batch['batch_id']} (Cost: ${batch['unit_cost']})")

    if remaining_needed > 0:
        print(f"      ❌ OUT OF STOCK! Could not fulfill {remaining_needed} units of {base_product}.")

def sync():
    # 1. Sync Marketing Spend
    spend_data = fetch_facebook_spend()
    supabase.table("daily_marketing_spend").upsert(spend_data).execute()
    print(f"📊 Ad Spend Synced: ${spend_data['ad_spend_fb']} (FB)")

    # 2. Sync Orders
    orders = fetch_checkoutchamp_orders()
    for order in orders:
        # --- Auto-Discovery Loop ---
        for item in order["items"]:
            pid = item["external_product_id"]
            
            # Check if we know this product
            exists = supabase.table("product_map").select("product_id").eq("product_id", pid).execute()
            
            if not exists.data:
                # UNKNOWN PRODUCT! Add it to DB so you can edit it in Dashboard later.
                print(f"🚨 NEW PRODUCT DISCOVERED: {item['product_name']} (ID: {pid})")
                supabase.table("product_map").insert({
                    "product_id": pid,
                    "offer_name": item["product_name"],
                    "units_per_variant": 1,
                    "unit_cost": 0,
                    "status": "needs_review", # This flags it red in your dashboard
                    "base_product": None
                }).execute()

        # Insert Transaction Header
        trans_data = {k:v for k,v in order.items() if k != "items"}
        supabase.table("transactions").upsert(trans_data).execute()
        
        # Insert Items & Calculate COGS
        for item in order["items"]:
            supabase.table("transaction_items").insert({
                "transaction_id": order["transaction_id"],
                "product_name": item["product_name"],
                "qty": item["qty"],
                "external_product_id": item["external_product_id"]
            }).execute()
            
            # Run the FIFO cost calculator
            process_inventory_deduction(
                item["external_product_id"], 
                item["qty"], 
                order["transaction_id"],
                item["product_name"]
            )
            
    print(f"✅ Sync Complete: Processed {len(orders)} Orders.")

if __name__ == "__main__":
    sync()