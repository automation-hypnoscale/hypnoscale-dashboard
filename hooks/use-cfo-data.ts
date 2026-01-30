import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export function useCFODashboardData(customStart?: Date, customEnd?: Date) {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    coldTrafficRevenue: 0, // <--- NEW: Real Cold Traffic
    mrrRevenue: 0,         // <--- NEW: Real MRR
    adSpend: 0,
    netProfit: 0,
    orderCount: 0,
    aov: 0,
    margin: 0,
  })

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        // 1. Determine Date Range
        const endDate = customEnd || new Date()
        const startDate = customStart ? new Date(customStart) : new Date()
        
        // Default to last 30 days if no date selected
        if (!customStart) {
           startDate.setDate(endDate.getDate() - 30)
        }

        // 2. Fetch Transactions (Revenue) & Facebook Ads (Spend)
        const [transactionsResponse, adsResponse] = await Promise.all([
          supabase
            .from("transactions")
            .select("total_amount, revenue_type") // <--- Fetching the type column now
            .gte("date", startDate.toISOString())
            .lte("date", endDate.toISOString()),
          
          supabase
            .from("facebook_ads")
            .select("spend")
            .gte("date", startDate.toISOString())
            .lte("date", endDate.toISOString())
        ])

        if (transactionsResponse.error) throw transactionsResponse.error
        if (adsResponse.error) throw adsResponse.error

        const transactions = transactionsResponse.data || []
        const ads = adsResponse.data || []

        // 3. Calculate Totals
        const totalRevenue = transactions.reduce((sum, t) => sum + (t.total_amount || 0), 0)
        const adSpend = ads.reduce((sum, a) => sum + (a.spend || 0), 0)

        // 4. Split Revenue by Type (Real Data)
        // We match the exact strings from your database screenshot
        const coldTrafficRevenue = transactions
          .filter(t => t.revenue_type === 'Cold Traffic Revenue')
          .reduce((sum, t) => sum + (t.total_amount || 0), 0)

        const mrrRevenue = transactions
          .filter(t => t.revenue_type === 'MRR Revenue')
          .reduce((sum, t) => sum + (t.total_amount || 0), 0)

        // 5. Profit Math
        const netProfit = totalRevenue - adSpend
        const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
        const orderCount = transactions.length
        const aov = orderCount > 0 ? totalRevenue / orderCount : 0

        setMetrics({
          totalRevenue,
          coldTrafficRevenue,
          mrrRevenue,
          adSpend,
          netProfit,
          orderCount,
          aov,
          margin
        })

      } catch (err) {
        console.error("Failed to fetch CFO data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [customStart, customEnd]) 

  return { metrics, isLoading }
}