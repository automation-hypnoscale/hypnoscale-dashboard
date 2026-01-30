"use client"

import { useMemo } from "react"
import { 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from "recharts"
import { Layers, TrendingUp } from "lucide-react"
import { DailyMetric } from "@/hooks/use-cfo-data"

interface ProfitCompositionChartProps {
  data?: DailyMetric[]
}

export function ProfitCompositionChart({ data = [] }: ProfitCompositionChartProps) {
  
  // 1. Transform Data for Charting
  // We calculate "Total Costs" dynamically so we can draw the red line
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    
    return data.map(day => ({
      ...day,
      // Costs = Revenue - Net Profit
      totalCosts: day.revenue - day.profit, 
      // Format date for X-Axis (e.g., "Jan 15")
      displayDate: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }))
  }, [data])

  // 2. Calculate Totals for the Header
  const totals = useMemo(() => {
    if (chartData.length === 0) return { totalProfit: 0, avgMargin: "0.0" }
    
    const totalProfit = chartData.reduce((sum, d) => sum + d.profit, 0)
    const totalRevenue = chartData.reduce((sum, d) => sum + d.revenue, 0)
    const avgMargin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0"
    
    return { totalProfit, avgMargin }
  }, [chartData])

  // 3. Loading State (If no data yet)
  if (!chartData || chartData.length === 0) {
    return (
      <div className="h-[400px] w-full bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-2">
         <Layers className="w-8 h-8 opacity-20" />
         <p className="text-sm font-medium">Waiting for data...</p>
      </div>
    )
  }

  return (
    <section className="bg-white border-2 border-gray-900 rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Profit Composition</h2>
            <p className="text-sm text-gray-500 font-medium">Real-time revenue vs costs breakdown</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex items-center gap-6 bg-gray-50 px-6 py-3 rounded-xl border border-gray-100">
          <div className="text-right">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Net Profit</p>
            <p className="text-2xl font-black text-gray-900">${totals.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          <div className="h-10 w-px bg-gray-200" />
          <div className="text-right">
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Margin</p>
            <p className={`text-2xl font-black ${Number(totals.avgMargin) > 20 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {totals.avgMargin}%
            </p>
          </div>
        </div>
      </div>

      {/* The Chart */}
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            
            <XAxis 
              dataKey="displayDate" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              minTickGap={30}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#9CA3AF", fontSize: 11 }}
              tickFormatter={(value) => `$${value/1000}k`}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Revenue Area (Green) */}
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#10B981"
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{ r: 6, fill: "#10B981", strokeWidth: 0 }}
            />

            {/* Costs Line (Red Dashed) */}
            <Line
              type="monotone"
              dataKey="totalCosts"
              stroke="#EF4444"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
              activeDot={{ r: 4, fill: "#EF4444" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend / Footer */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-xs font-medium text-gray-500">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span>Total Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-1 rounded-full bg-red-500" />
          <span>Total Costs (Ads + COGS)</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700">
             Gap = Net Profit
          </span>
        </div>
      </div>
    </section>
  )
}

// Custom Tooltip Component
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const revenue = data.revenue
  const costs = data.totalCosts
  const profit = data.profit
  const margin = data.margin.toFixed(1)
  const adSpend = data.adSpend

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-xl min-w-[200px]">
      <p className="text-xs text-gray-400 font-semibold uppercase mb-3">{label}</p>
      
      <div className="space-y-3">
        {/* Profit Section */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-50">
           <span className="text-sm font-bold text-gray-700">Net Profit</span>
           <div className="text-right">
             <span className="block text-sm font-bold text-emerald-600">+${profit.toLocaleString()}</span>
             <span className="block text-[10px] text-gray-400">{margin}% Margin</span>
           </div>
        </div>

        {/* Details */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Revenue</span>
            <span className="font-medium text-gray-900">${revenue.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
             <span className="text-gray-500">Ad Spend</span>
             <span className="font-medium text-red-500">-${adSpend.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs">
             <span className="text-gray-500">Est. Costs</span>
             <span className="font-medium text-red-400">-${(costs - adSpend).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}