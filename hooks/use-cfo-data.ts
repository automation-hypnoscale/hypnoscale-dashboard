import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type DailyMetric = {
  date: string
  revenue: number
  adSpend: number
  profit: number
  margin: number
}

export function useCFODashboardData(customStart?: Date, customEnd?: Date) {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    coldTrafficRevenue: 0,
    mrrRevenue: 0,
    adSpend: 0,
    netProfit: 0,
    orderCount: 0,
    aov: 0,
    margin: 0,
  })
  const [dailyHistory, setDailyHistory] = useState<DailyMetric[]>([])

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const end = customEnd ? new Date(customEnd) : new Date()
        end.setHours(23, 59, 59, 999) 

        const start = customStart ? new Date(customStart) : new Date()
        if (!customStart) {
          start.setDate(end.getDate() - 30)
        }
        start.setHours(0, 0, 0, 0) 

        // --- 🚀 FIX: RECURSIVE FETCH (Bypasses 1,000 row limit) ---
        let allTransactions: any[] = []
        let from = 0
        let to = 999
        let finished = false

        while (!finished) {
          const { data, error } = await supabase
            .from("transactions")
            .select("total_amount, revenue_type, date, transaction_id")
            .gte("date", start.toISOString())
            .lte("date", end.toISOString())
            .order("date", { ascending: true })
            .range(from, to)

          if (error) throw error
          if (data && data.length > 0) {
            allTransactions = [...allTransactions, ...data]
            from += 1000
            to += 1000
          } else {
            finished = true
          }
          // Safety break to prevent infinite loops
          if (from > 10000) finished = true 
        }

        const [adsResponse] = await Promise.all([
          supabase
            .from("facebook_ads")
            .select("spend, date")
            .gte("date", start.toISOString())
            .lte("date", end.toISOString())
        ])

        const transactions = allTransactions
        const ads = adsResponse.data || []
        
        console.log(`✅ Success: Fetched ALL ${transactions.length} records.`);

        // --- CALCULATIONS (Using Supplier Math) ---
        const calculateOrderCOGS = (revenue: number) => {
          if (revenue <= 0) return 0
          // Supplier Math: Handling ($0.48) + Avg Freight ($3.43 + Weight Fee)
          const productCost = revenue * 0.15 
          const handling = 0.48
          const shipping = 3.43 + (0.15 * 20.40) 
          return productCost + handling + shipping
        }

        const dailyMap = new Map<string, DailyMetric>()
        
        let iter = new Date(start);
        while (iter <= end) {
            const key = iter.toISOString().split('T')[0];
            dailyMap.set(key, { date: key, revenue: 0, adSpend: 0, profit: 0, margin: 0 });
            iter.setDate(iter.getDate() + 1);
        }

        transactions.forEach(t => {
            const key = new Date(t.date).toISOString().split('T')[0];
            if (dailyMap.has(key)) {
                dailyMap.get(key)!.revenue += (t.total_amount || 0);
            }
        });

        ads.forEach(a => {
            const key = new Date(a.date).toISOString().split('T')[0];
            if (dailyMap.has(key)) {
                dailyMap.get(key)!.adSpend += (a.spend || 0);
            }
        });

        const historyArray = Array.from(dailyMap.values()).map(day => {
            const realCOGS = calculateOrderCOGS(day.revenue)
            const net = day.revenue - day.adSpend - realCOGS
            return {
                ...day,
                profit: net,
                margin: day.revenue > 0 ? (net / day.revenue) * 100 : 0
            }
        })

        setDailyHistory(historyArray);

        const totalRev = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0);
        const adSpend = ads.reduce((sum, a) => sum + (a.spend || 0), 0);
        const totalCOGS = historyArray.reduce((sum, d) => sum + calculateOrderCOGS(d.revenue), 0);

        setMetrics({
          totalRevenue: totalRev,
          coldTrafficRevenue: transactions.filter(t => t.revenue_type === 'Cold Traffic Revenue').reduce((sum, t) => sum + (t.total_amount || 0), 0),
          mrrRevenue: transactions.filter(t => t.revenue_type === 'MRR Revenue').reduce((sum, t) => sum + (t.total_amount || 0), 0),
          adSpend,
          netProfit: totalRev - adSpend - totalCOGS,
          orderCount: transactions.length,
          aov: transactions.length > 0 ? totalRev / transactions.length : 0,
          margin: totalRev > 0 ? ((totalRev - adSpend - totalCOGS) / totalRev) * 100 : 0
        });

      } catch (err) {
        console.error("Hook Error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [customStart, customEnd]) 

  return { metrics, dailyHistory, isLoading }
}