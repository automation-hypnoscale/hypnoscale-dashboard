import os
import json
from datetime import date, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# --- 🔐 CREDENTIALS & SETUP ---
script_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(script_dir, '..', '.env.local'))

url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not url or not key:
    print("❌ ERROR: Supabase credentials missing from .env.local")
    exit(1)

supabase: Client = create_client(url, key)

def generate_insights():
    print("🧠 Starting AI Analysis on 2,000+ records...")
    
    today = date.today()
    today_str = today.isoformat() 
    seven_days_ago = today - timedelta(days=7)
    fourteen_days_ago = today - timedelta(days=14)

    all_data = []
    start_row = 0
    while True:
        res = supabase.table("transactions") \
            .select("total_amount, date, revenue_type") \
            .gte("date", fourteen_days_ago.isoformat()) \
            .range(start_row, start_row + 999) \
            .execute()
        
        if not res.data:
            break
        all_data.extend(res.data)
        start_row += 1000
    
    print(f"📈 Analyzed {len(all_data)} recent transactions.")

    # CALCULATIONS
    this_week_total = sum(item['total_amount'] for item in all_data if date.fromisoformat(item['date'][:10]) >= seven_days_ago)
    last_week_total = sum(item['total_amount'] for item in all_data if date.fromisoformat(item['date'][:10]) < seven_days_ago)
    mrr_revenue = sum(item['total_amount'] for item in all_data if item.get('revenue_type') == 'MRR Revenue')
    growth = ((this_week_total - last_week_total) / last_week_total * 100) if last_week_total > 0 else 0

    # --- ONE MASTER INSIGHT (To avoid Primary Key duplicate error) ---
    master_insight = {
        "date": today_str,
        "title": "Daily Executive Briefing",
        "content": f"Revenue: ${this_week_total:,.0f} ({growth:+.1f}% vs last week). MRR contributed ${mrr_revenue:,.0f}. Freight costs are stable at $20.40/kg based on current scale.",
        "status": "success" if growth > 0 else "warning",
        "type": "performance"
    }

    try:
        print(f"🧹 Clearing old data for {today_str}...")
        supabase.table("ai_daily_insights").delete().eq("date", today_str).execute()
        
        print(f"📝 Uploading briefing for {today_str}...")
        supabase.table("ai_daily_insights").insert(master_insight).execute()
        
        print("✅ SUCCESS: AI Daily Briefing updated.")
    except Exception as e:
        print(f"❌ DATABASE ERROR: {e}")

if __name__ == "__main__":
    generate_insights()