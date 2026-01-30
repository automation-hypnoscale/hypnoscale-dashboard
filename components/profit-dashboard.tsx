"use client"

import { useState } from "react"
import { useCFODashboardData } from "@/hooks/use-cfo-data" // <--- Hook connected
import {
  Shield,
  TrendingUp,
  DollarSign,
  CreditCard,
  Gauge,
  Target,
  BarChart3,
  ShoppingCart,
  Layers,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Keep your existing UI components
import { KPICard } from "./kpi-card"
import { GoldenKPICard } from "./golden-kpi-card"
import { ProfitCompositionChart } from "./profit-composition-chart"
import { ProfitMarginCard, ROASHealthCard, SubOptInCard } from "./key-metrics-cards"
import { AIDailyInsight } from "./ai-daily-insight"
import { ExpandableKPICard } from "./expandable-kpi-card"
import { ExpandableCostCard } from "./expandable-cost-card"
import { TrueProfitCard } from "./true-profit-card"

// --- STATIC DATA (Placeholders for metrics we haven't synced yet) ---
const goldenKPIs = [
  {
    name: "AOV",
    status: "flagged" as const,
    target: "$70+",
    current: "$52.40",
    action: "Increase pricing, bundles, or AOV offers.",
  },
  {
    name: "Gross Margin",
    status: "flagged" as const,
    target: "80%+",
    current: "68.2%",
    action: "Renegotiate COGS, adjust pricing, or reduce discounts.",
  },
  {
    name: "CAC (Blended)",
    status: "on-track" as const,
    target: "≤ $50",
    current: "$24.80",
    action: "Acquisition cost efficient.",
  },
  {
    name: "Rebill Success",
    status: "on-track" as const,
    target: "70%+",
    current: "72.4%",
    action: "1,361/1,882 rebills successful. Payment processing stable.",
    subMetrics: {
      successful: "1,361",
      total: "1,882",
      rate: "72.4%",
    },
  },
]

const expandableKPIData = {
  cpa: {
    title: "CPA (All Channels)",
    mainValue: "$32",
    target: "$40",
    status: "on-track" as const,
    subMetrics: [
      { name: "Facebook", value: "$28", percentage: 68, trend: "down" as const },
      { name: "Google", value: "$42", percentage: 22, trend: "up" as const },
      { name: "TikTok", value: "$38", percentage: 10, trend: "neutral" as const },
    ],
  },
  roas: {
    title: "ROAS (All Channels)",
    mainValue: "6.8x",
    target: "5.0x",
    status: "on-track" as const,
    subMetrics: [
      { name: "Facebook", value: "7.2x", percentage: 68, trend: "up" as const },
      { name: "Google", value: "5.1x", percentage: 22, trend: "neutral" as const },
      { name: "TikTok", value: "6.5x", percentage: 10, trend: "up" as const },
    ],
  },
  aov: {
    title: "AOV (All Products)",
    mainValue: "$52.40",
    target: "$70",
    status: "warning" as const,
    subMetrics: [
      { name: "Neuro Supplement", value: "$58", percentage: 45, trend: "up" as const },
      { name: "Vein Supplement", value: "$52", percentage: 30, trend: "neutral" as const },
      { name: "Comfort Balm", value: "$44", percentage: 25, trend: "down" as const },
    ],
  },
}

export function ProfitDashboard() {
  // 1. STATE: Date Management
  const [tempDateRange, setTempDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  })
  
  // The state that actually triggers the API call
  const [queryDateRange, setQueryDateRange] = useState(tempDateRange)

  // 2. DATA: Fetch Real Data
  const { metrics, isLoading } = useCFODashboardData(queryDateRange.start, queryDateRange.end)

  // 3. LOGIC: Calculate Costs (Hybrid: Real Ad Spend + Simulated COGS)
  const revenue = metrics.totalRevenue
  const realAdSpend = metrics.adSpend
  
  // Simulated Costs (until we backfill COGS/OpEx)
  const estimatedCOGS = revenue * 0.25 // Assuming 25% COGS
  const estimatedOpEx = revenue * 0.06 // Assuming 6% OpEx

  const totalCosts = realAdSpend + estimatedCOGS + estimatedOpEx
  const trueProfit = revenue - totalCosts
  const trueMargin = revenue > 0 ? (trueProfit / revenue) * 100 : 0
  const realROAS = realAdSpend > 0 ? revenue / realAdSpend : 0

  // 4. HANDLERS
  const handleApplyFilters = () => {
    setQueryDateRange(tempDateRange)
  }

  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profit Dashboard</h1>
              <p className="text-gray-600 text-sm">Revenue, costs breakdown, true profit and daily performance</p>
            </div>
          </div>
        </div>

        {/* DATE PICKER UI */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
          <input 
            type="date" 
            className="text-sm border-none bg-transparent px-2 py-1 text-gray-600 focus:outline-none"
            value={formatDateForInput(tempDateRange.start)}
            onChange={(e) => setTempDateRange({...tempDateRange, start: new Date(e.target.value)})}
          />
          <span className="text-gray-300">|</span>
          <input 
            type="date" 
            className="text-sm border-none bg-transparent px-2 py-1 text-gray-600 focus:outline-none"
            value={formatDateForInput(tempDateRange.end)}
            onChange={(e) => setTempDateRange({...tempDateRange, end: new Date(e.target.value)})}
          />
          <Button size="sm" onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin w-12 h-12 text-primary" />
        </div>
      ) : (
        <>
          {/* ROW 1: Revenue Breakdown (REAL DATA) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-warning/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               {/* 1. Cold Traffic (Approximated as 70% of total for now) */}
              {/* 1. Cold Traffic Sales */}
<KPICard 
  title="Cold Traffic Sales"
  value={`$${metrics.coldTrafficRevenue.toLocaleString()}`} // <--- UPDATED
  subtext="CPA: TBD" // We will calculate CPA later
  trend="up"
  trendValue="Real Data" 
  sparkline={[30, 45, 35, 50, 55, 65, 70, 80, 75, 90]}
  accentColor="primary"
/>

{/* 2. MRR Sales */}
<KPICard 
  title="MRR Sales"
  value={`$${metrics.mrrRevenue.toLocaleString()}`} // <--- UPDATED
  subtext="Recurring Revenue"
  trend="up"
  trendValue="Real Data"
  sparkline={[40, 45, 50, 52, 55, 58, 62, 65, 68, 72]}
  accentColor="warning"
/>
              {/* 3. Total Sales (REAL) */}
              <KPICard 
                title="Total Sales"
                value={`$${revenue.toLocaleString()}`}
                subtext="Combined revenue"
                trend="up"
                trendValue="+9.4%"
                sparkline={[35, 42, 40, 52, 58, 62, 68, 75, 72, 85]}
                accentColor="teal"
              />
            </div>
          </section>

          {/* ROW 2: Costs Breakdown (REAL AD SPEND) */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral/20 to-warning/20 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-coral" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Costs Breakdown</h2>
              <span className="text-xs text-gray-500 ml-2">Click to expand</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ExpandableCostCard
                title="Ad Spend"
                totalValue={`$${realAdSpend.toLocaleString()}`}
                subtitle={`ROAS: ${realROAS.toFixed(2)}x`}
                items={[
                  { name: "Facebook", value: `$${realAdSpend.toLocaleString()}`, percentage: 100 },
                ]}
                icon={<Target className="w-4 h-4" />}
                accentColor="primary"
              />
              <ExpandableCostCard
                title="COGS (Est)"
                totalValue={`$${estimatedCOGS.toLocaleString(undefined, {maximumFractionDigits:0})}`}
                subtitle="~25% of revenue"
                items={[
                  { name: "Product Cost", value: `$${(estimatedCOGS * 0.8).toFixed(0)}`, percentage: 80 },
                  { name: "Shipping", value: `$${(estimatedCOGS * 0.2).toFixed(0)}`, percentage: 20 },
                ]}
                icon={<ShoppingCart className="w-4 h-4" />}
                accentColor="warning"
              />
              <ExpandableCostCard
                title="Other Costs (Est)"
                totalValue={`$${estimatedOpEx.toLocaleString(undefined, {maximumFractionDigits:0})}`}
                subtitle="Team + Software + Fees"
                items={[
                  { name: "Processing Fees", value: `$${(revenue * 0.029).toFixed(0)}`, percentage: 48 },
                  { name: "Software", value: "$180", daily: true },
                ]}
                icon={<Layers className="w-4 h-4" />}
                accentColor="coral"
              />
            </div>
          </section>

          {/* ROW 3: True Profit (CALCULATED) */}
          <section>
            <TrueProfitCard revenue={revenue} totalCosts={totalCosts} profit={trueProfit} margin={trueMargin} />
          </section>

          {/* ROW 4: Channel Breakdown */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-teal/20 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Channel Breakdown</h2>
              <span className="text-xs text-gray-500 ml-2">Click to expand</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ExpandableKPICard
                title={expandableKPIData.cpa.title}
                mainValue={expandableKPIData.cpa.mainValue}
                target={expandableKPIData.cpa.target}
                status={expandableKPIData.cpa.status}
                subMetrics={expandableKPIData.cpa.subMetrics}
                icon={<Target className="w-4 h-4" />}
              />
              <ExpandableKPICard
                title="ROAS (Real)"
                mainValue={`${realROAS.toFixed(2)}x`}
                target={expandableKPIData.roas.target}
                status={realROAS > 4 ? "on-track" : "warning"}
                subMetrics={[
                  { name: "Facebook", value: `${realROAS.toFixed(2)}x`, percentage: 100, trend: "up" },
                ]}
                icon={<TrendingUp className="w-4 h-4" />}
              />
              <ExpandableKPICard
                title={expandableKPIData.aov.title}
                mainValue={`$${metrics.aov.toFixed(2)}`}
                target={expandableKPIData.aov.target}
                status={expandableKPIData.aov.status}
                subMetrics={expandableKPIData.aov.subMetrics}
                icon={<DollarSign className="w-4 h-4" />}
              />
            </div>
          </section>

          {/* ROW 5: Key Metrics */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
                <Gauge className="w-4 h-4 text-success" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <ProfitMarginCard margin={trueMargin} />
              <ROASHealthCard realROAS={realROAS} />
              <SubOptInCard rate={18.5} totalOrders={metrics.orderCount} subscribed={Math.round(metrics.orderCount * 0.18)} />
            </div>
          </section>

          {/* Golden KPIs */}
          <section className="bg-white border-2 border-gray-900 p-8 rounded-3xl space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">Golden KPIs</p>
                <h2 className="text-2xl font-bold text-gray-900">Protect the Scale Rules</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
              {goldenKPIs.map((kpi) => (
                <GoldenKPICard key={kpi.name} {...kpi} />
              ))}
            </div>
          </section>

          <ProfitCompositionChart />

          <AIDailyInsight type="performance" />
        </>
      )}
    </div>
  )
}