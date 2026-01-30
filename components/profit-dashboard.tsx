import { KPICard } from "./kpi-card"
import { GoldenKPICard } from "./golden-kpi-card"
import { DashboardFilters } from "./dashboard-filters"
import { ProfitCompositionChart } from "./profit-composition-chart"
import { ProfitMarginCard, ROASHealthCard, SubOptInCard } from "./key-metrics-cards"
import { AIDailyInsight } from "./ai-daily-insight"
import { ExpandableKPICard } from "./expandable-kpi-card"
import { ExpandableCostCard } from "./expandable-cost-card"
import { TrueProfitCard } from "./true-profit-card"
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
} from "lucide-react"

const revenueKPIs = [
  {
    title: "Cold Traffic Sales",
    value: "$87,392",
    subtext: "CPA: $32 (target: $40)",
    trend: "up" as const,
    trendValue: "+8.3%",
    sparkline: [30, 45, 35, 50, 55, 65, 70, 80, 75, 90],
    accentColor: "primary" as const,
  },
  {
    title: "MRR Sales",
    value: "$37,455",
    subtext: "+12% vs last month",
    trend: "up" as const,
    trendValue: "+12.0%",
    sparkline: [40, 45, 50, 52, 55, 58, 62, 65, 68, 72],
    accentColor: "warning" as const,
  },
  {
    title: "Total Sales",
    value: "$124,847",
    subtext: "Combined revenue",
    trend: "up" as const,
    trendValue: "+9.4%",
    sparkline: [35, 42, 40, 52, 58, 62, 68, 75, 72, 85],
    accentColor: "teal" as const,
  },
]

const expandableCostData = {
  adSpend: {
    title: "Ad Spend",
    totalValue: "$18,432",
    subtitle: "ROAS: 6.8x",
    items: [
      { name: "Facebook", value: "$12,540", percentage: 68 },
      { name: "Google", value: "$4,055", percentage: 22 },
      { name: "TikTok", value: "$1,837", percentage: 10 },
    ],
  },
  cogs: {
    title: "COGS",
    totalValue: "$31,211",
    subtitle: "31.8% of revenue",
    items: [
      { name: "Product Cost", value: "$24,969", percentage: 80 },
      { name: "Shipping", value: "$6,242", percentage: 20 },
    ],
  },
  otherCosts: {
    title: "Other Costs",
    totalValue: "$7,497",
    subtitle: "Team + Software + Fees",
    items: [
      { name: "Processing Fees", value: "$3,620", percentage: 48 },
      { name: "Refunds", value: "$2,497", percentage: 33 },
      { name: "Team", value: "$1,200", daily: true },
      { name: "Software", value: "$180", daily: true },
    ],
  },
}

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

const revenue = 124847
const adSpend = 18432
const cogs = 31211
const otherCosts = 7497
const totalCosts = adSpend + cogs + otherCosts
const trueProfit = revenue - totalCosts
const trueMargin = (trueProfit / revenue) * 100

export function ProfitDashboard() {
  return (
    <div className="space-y-8">
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
        <DashboardFilters />
      </div>

      {/* ROW 1: Revenue Breakdown - 3 equal cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-warning/20 flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {revenueKPIs.map((kpi) => (
            <KPICard key={kpi.title} {...kpi} />
          ))}
        </div>
      </section>

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
            title={expandableCostData.adSpend.title}
            totalValue={expandableCostData.adSpend.totalValue}
            subtitle={expandableCostData.adSpend.subtitle}
            items={expandableCostData.adSpend.items}
            icon={<Target className="w-4 h-4" />}
            accentColor="primary"
          />
          <ExpandableCostCard
            title={expandableCostData.cogs.title}
            totalValue={expandableCostData.cogs.totalValue}
            subtitle={expandableCostData.cogs.subtitle}
            items={expandableCostData.cogs.items}
            icon={<ShoppingCart className="w-4 h-4" />}
            accentColor="warning"
          />
          <ExpandableCostCard
            title={expandableCostData.otherCosts.title}
            totalValue={expandableCostData.otherCosts.totalValue}
            subtitle={expandableCostData.otherCosts.subtitle}
            items={expandableCostData.otherCosts.items}
            icon={<Layers className="w-4 h-4" />}
            accentColor="coral"
          />
        </div>
      </section>

      <section>
        <TrueProfitCard revenue={revenue} totalCosts={totalCosts} profit={trueProfit} margin={trueMargin} />
      </section>

      {/* ROW 4: Channel Breakdown - expandable KPIs */}
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
            title={expandableKPIData.roas.title}
            mainValue={expandableKPIData.roas.mainValue}
            target={expandableKPIData.roas.target}
            status={expandableKPIData.roas.status}
            subMetrics={expandableKPIData.roas.subMetrics}
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <ExpandableKPICard
            title={expandableKPIData.aov.title}
            mainValue={expandableKPIData.aov.mainValue}
            target={expandableKPIData.aov.target}
            status={expandableKPIData.aov.status}
            subMetrics={expandableKPIData.aov.subMetrics}
            icon={<DollarSign className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* ROW 5: Key Metrics - 3 cards */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
            <Gauge className="w-4 h-4 text-success" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Key Metrics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ProfitMarginCard margin={trueMargin} />
          <ROASHealthCard realROAS={2.4} />
          <SubOptInCard rate={18.5} totalOrders={1820} subscribed={337} />
        </div>
      </section>

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
    </div>
  )
}
