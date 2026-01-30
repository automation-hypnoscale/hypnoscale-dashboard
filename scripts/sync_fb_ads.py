import os
import requests
import json
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# --- 📅 CONFIGURATION ---
load_dotenv(".env.local")

# Determine Date Range
if os.environ.get("GITHUB_ACTIONS") == "true":
    print("🤖 AUTOMATION MODE: Syncing last 3 days...")
    START_DATE = date.today() - timedelta(days=3)
    END_DATE = date.today()
else:
    # MANUAL BACKFILL: From Dec 27, 2025 to Today
    print("🛠️ MANUAL MODE: Backfilling from Dec 27...")
    START_DATE = date(2025, 12, 27) 
    END_DATE = date.today()

# --- 🔐 CREDENTIALS ---
FB_ACCESS_TOKEN = os.environ.get("FACEBOOK_ACCESS_TOKEN")
# Expecting a comma-separated string: "act_111,act_222,act_333"
FB_AD_ACCOUNT_IDS_RAW = os.environ.get("FACEBOOK_AD_ACCOUNT_ID")

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not FB_ACCESS_TOKEN or not FB_AD_ACCOUNT_IDS_RAW:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        print("⚠️ WARNING: Facebook Credentials not found. Check .env.local")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def sync_single_account(acc_id):
    # Ensure ID starts with act_
    clean_acc_id = acc_id.strip()
    if not clean_acc_id.startswith("act_"):
        clean_acc_id = f"act_{clean_acc_id}"

    print(f"\n🚀 Syncing Account: {clean_acc_id} ({START_DATE} to {END_DATE})...")

    base_url = f"https://graph.facebook.com/v19.0/{clean_acc_id}/insights"
    str_start = START_DATE.strftime("%Y-%m-%d")
    str_end = END_DATE.strftime("%Y-%m-%d")

    params = {
        "access_token": FB_ACCESS_TOKEN,
        "level": "campaign",
        "time_increment": 1, 
        "time_range": json.dumps({"since": str_start, "until": str_end}),
        "fields": "campaign_name,campaign_id,spend,impressions,clicks,cpc,ctr,account_name,date_start",
        "limit": 100 
    }

    total_saved = 0
    current_url = base_url
    
    while current_url:
        try:
            if current_url == base_url:
                response = requests.get(current_url, params=params)
            else:
                response = requests.get(current_url)
                
            data = response.json()

            if "error" in data:
                print(f"   ❌ FB API Error for {clean_acc_id}: {data['error']['message']}")
                break

            insights = data.get("data", [])
            
            if not insights and total_saved == 0:
                print(f"   ℹ️ 0 records found for this period.")
                break

            for row in insights:
                record = {
                    "date": row["date_start"],
                    "ad_account_id": clean_acc_id,
                    "ad_account_name": row.get("account_name", "Unknown"),
                    "campaign_id": row["campaign_id"],
                    "campaign_name": row["campaign_name"],
                    "spend": float(row.get("spend", 0)),
                    "impressions": int(row.get("impressions", 0)),
                    "clicks": int(row.get("clicks", 0)),
                    "cpc": float(row.get("cpc", 0) or 0),
                    "ctr": float(row.get("ctr", 0) or 0)
                }

                try:
                    supabase.table("facebook_ads").upsert(record, on_conflict="date, campaign_id").execute()
                    total_saved += 1
                except Exception as e:
                    print(f"   ⚠️ Error saving row: {e}")

            current_url = data.get("paging", {}).get("next")
            if current_url:
                print("   ➡️ Fetching next page...")

        except Exception as e:
            print(f"   ❌ Critical Error: {e}")
            break

    print(f"   ✨ Account Complete! Synced {total_saved} records.")

def fetch_all_accounts():
    if not FB_ACCESS_TOKEN or not FB_AD_ACCOUNT_IDS_RAW:
        return

    # Split the string by comma to get a list of IDs
    account_list = [x for x in FB_AD_ACCOUNT_IDS_RAW.split(",") if x.strip()]
    
    print(f"📋 Found {len(account_list)} Ad Accounts to sync.")

    for account_id in account_list:
        sync_single_account(account_id)
    
    print("\n🏁 ALL ACCOUNTS SYNCED SUCCESSFULLY!")

if __name__ == "__main__":
    fetch_all_accounts()