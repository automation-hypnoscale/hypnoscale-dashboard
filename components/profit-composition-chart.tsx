"use client"

import { useMemo, useState, useEffect } from "react"
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Layers } from "lucide-react"

const generateChartData = () => {
  const data = []

  const baseColdTraffic = 2913
  const baseMrr = 1200
  const baseAdSpend = 614
  const cogsRate = 0.25
  const weeklyMrrGrowth = 0.015

  for (let i = 1; i <= 30; i++) {
    const weekNumber = Math.floor((i - 1) / 7)
    const mrrGrowthFactor = 1 + weeklyMrrGrowth * weekNumber
    const dailyMrrVariation = 0.98 + Math.random() * 0.04
    const mrr = Math.round(baseMrr * mrrGrowthFactor * dailyMrrVariation)

    const isWeekend = [6, 7, 13, 14, 20, 21, 27, 28].includes(i)
    const dailyFluctuation = -300 + Math.random() * 600
    const weekendBoost = isWeekend ? 400 : 0
    const trendBoost = i * 8
    const coldTraffic = Math.round(baseColdTraffic + dailyFluctuation + weekendBoost + trendBoost)

    const totalRevenue = coldTraffic + mrr

    const adSpendVariation = isWeekend ? 80 : 0
    const adSpend = Math.round(baseAdSpend + (-50 + Math.random() * 100) + adSpendVariation)
    const cogs = Math.round(totalRevenue * cogsRate)
    const totalCosts = adSpend + cogs

    const profit = totalRevenue - totalCosts

    data.push({
      day: i,
      coldTraffic,
      mrr,
      totalRevenue,
      totalCosts,
      profit,
      adSpend,
      cogs,
    })
  }
  return data
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color: string
  }>
  label?: number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  const totalRevenue = payload.find((p) => p.dataKey === "totalRevenue")?.value || 0
  const totalCosts = payload.find((p) => p.dataKey === "totalCosts")?.value || 0
  const coldTraffic = payload.find((p) => p.dataKey === "coldTraffic")?.value || 0
  const mrr = payload.find((p) => p.dataKey === "mrr")?.value || 0
  const profit = totalRevenue - totalCosts
  const margin = ((profit / totalRevenue) * 100).toFixed(1)

  return (
    <div className="bg-white border-2 border-gray-900 rounded-xl p-4 shadow-2xl min-w-[220px]">
      <p className="text-xs text-gray-600 mb-3 font-semibold uppercase tracking-wide">Day {label}</p>

      <div className="mb-3 p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-600 uppercase">Daily Profit</span>
          <span className="text-lg font-black text-emerald-600">${profit.toLocaleString()}</span>
        </div>
        <p className="text-[10px] text-emerald-600/70 mt-1">{margin}% margin</p>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-400/30 border border-emerald-400" />
            <span className="text-gray-600">Total Revenue</span>
          </div>
          <span className="font-semibold text-gray-900">${totalRevenue.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between pl-5 opacity-70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-gray-600">Cold Traffic</span>
          </div>
          <span className="font-medium">${coldTraffic.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between pl-5 opacity-70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-gray-600">MRR</span>
          </div>
          <span className="font-medium">${mrr.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-rose-400/30 border border-rose-400" />
            <span className="text-gray-600">Total Costs</span>
          </div>
          <span className="font-semibold text-gray-900">${totalCosts.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

export function ProfitCompositionChart() {
  // 1. Add "mounted" state to prevent server/client mismatch
  const [mounted, setMounted] = useState(false)

  // 2. Set mounted to true only after component loads in browser
  useEffect(() => {
    setMounted(true)
  }, [])

  const chartData = useMemo(() => generateChartData(), [])

  const totals = useMemo(() => {
    const totalProfit = chartData.reduce((sum, d) => sum + d.profit, 0)
    const totalRevenue = chartData.reduce((sum, d) => sum + d.totalRevenue, 0)
    const avgDailyProfit = Math.round(totalProfit / 30)
    const avgMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)
    return { totalProfit, avgDailyProfit, avgMargin }
  }, [chartData])

  // 3. Show a loading skeleton if not mounted yet
  if (!mounted) {
    return <div className="h-[500px] w-full bg-gray-100/50 animate-pulse rounded-2xl" />
  }

  return (
    <section className="bg-white border-2 border-gray-900 rounded-2xl p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
            <Layers className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Profit Composition</h2>
            <p className="text-sm text-gray-600">30-day revenue vs costs breakdown</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-600">30-Day Profit</p>
            <p className="text-xl font-bold text-gray-900">${totals.totalProfit.toLocaleString()}</p>
          </div>
          <div className="h-10 w-px bg-gray-300" />
          <div className="text-right">
            <p className="text-gray-600">Margin</p>
            <p className="text-xl font-bold text-emerald-500">{totals.avgMargin}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500/40 border border-emerald-500" />
          <span>Profit Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 rounded bg-rose-500" />
          <span>Total Costs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 rounded bg-cyan-400" />
          <span>Cold Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 rounded bg-amber-400" />
          <span>MRR</span>
        </div>
      </div>

      <div className="h-[340px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity={0.05} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickFormatter={(value) => `${value}`}
              interval={4}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              width={45}
              domain={[0, 5000]}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="totalRevenue"
              stroke="rgb(16, 185, 129)"
              strokeWidth={2}
              fill="url(#profitGradient)"
            />

            <Line
              type="monotone"
              dataKey="totalCosts"
              stroke="rgb(239, 68, 68)"
              strokeWidth={2.5}
              dot={false}
              strokeDasharray="6 3"
            />

            <Line
              type="monotone"
              dataKey="coldTraffic"
              stroke="rgb(34, 211, 238)"
              strokeWidth={1.5}
              dot={false}
              strokeOpacity={0.8}
            />

            <Line
              type="monotone"
              dataKey="mrr"
              stroke="rgb(251, 191, 36)"
              strokeWidth={1.5}
              dot={false}
              strokeOpacity={0.8}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span>
          <span className="text-gray-900 font-medium">Profit</span> = Green shaded area above the red dashed cost line
        </span>
        <span className="mx-2 text-gray-300">|</span>
        <span>
          <span className="text-cyan-500 font-medium">Cold Traffic</span> stays above costs = front-end profitable
        </span>
      </div>
    </section>
  )
}