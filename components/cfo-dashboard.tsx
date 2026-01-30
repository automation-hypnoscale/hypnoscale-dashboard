"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  TrendingDown,
  Clock,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
  Target,
  Building2,
  Receipt,
  Globe,
  Package,
  Loader2,
} from "lucide-react"
import { useNavigation } from "@/contexts/navigation-context"
import { AIDailyInsight } from "./ai-daily-insight"
import { useCFODashboardData } from "@/hooks/use-cfo-data"

// --- STATIC DATA (Placeholders) ---
const stockAlerts = [
  { product: "Warming Oils", daysToStockout: 30, reorderBy: "Dec 1", status: "healthy" },
  { product: "Cooling Roller", daysToStockout: 9, reorderBy: "OVERDUE", status: "critical" },
  { product: "Comfort Balm", daysToStockout: 35, reorderBy: "Dec 10", status: "healthy" },
  { product: "Neuro Supplement", daysToStockout: 8, reorderBy: "OVERDUE", status: "critical" },
  { product: "Vein Supplement", daysToStockout: 26, reorderBy: "Dec 1", status: "healthy" },
]

const globalProfitability = [
  { market: "USA", revenue: 68420, cm: 32.4, status: "healthy" },
  { market: "UK", revenue: 24180, cm: 28.1, status: "healthy" },
  { market: "Australia", revenue: 18640, cm: 22.3, status: "moderate" },
  { market: "Hong Kong", revenue: 8420, cm: 8.7, status: "warning" },
  { market: "Canada", revenue: 5187, cm: 15.2, status: "moderate" },
]

const processorHealth = {
  disputeRate: 0.42,
  refundRate: 2.8,
  cashOnHold: 4200,
  disputeThreshold: 0.8,
}

const accountsPayable = [
  { vendor: "Supplier A (Inventory)", amount: 18000, dueDate: "Dec 15", daysUntil: 20, priority: "high" },
  { vendor: "Team Bonuses", amount: 12000, dueDate: "Jan 1", daysUntil: 37, priority: "medium" },
  { vendor: "Software Subscriptions", amount: 2400, dueDate: "Dec 5", daysUntil: 10, priority: "low" },
  { vendor: "Warehouse Rent", amount: 4500, dueDate: "Dec 1", daysUntil: 6, priority: "high" },
]

const financialIssues = [
  {
    issue: "Low AOV ($52 vs $70 target)",
    dailyCost: 890,
    impact30Day: 26700,
    action: "View Strategy",
    targetSheet: "Performance" as const,
    icon: Target,
    severity: "warning",
  },
]

export function CFODashboard() {
  const { setActiveSheet } = useNavigation()

  // 1. STATE: Manage Date Range (Default: Last 30 Days)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date(),
  })

  // 2. DATA: Fetch Real Data based on selected dates
  const { metrics, isLoading } = useCFODashboardData(dateRange.start, dateRange.end)

  // Handlers for Date Inputs
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    if (!isNaN(newDate.getTime())) {
      setDateRange((prev) => ({ ...prev, start: newDate }))
    }
  }

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value)
    if (!isNaN(newDate.getTime())) {
      setDateRange((prev) => ({ ...prev, end: newDate }))
    }
  }

  const formatDateForInput = (date: Date) => date.toISOString().split("T")[0]

  // 3. LOGIC: Hybrid Calculations
  const baseCash = 142500 // Simulated starting balance
  const currentCash = baseCash + metrics.totalRevenue // Real revenue adds to cash pile

  const monthlyBurn = 23400 // Fixed burn rate placeholder
  const runway = (currentCash / monthlyBurn).toFixed(1)
  const isRunwaySafe = Number.parseFloat(runway) > 3

  const totalPayable = accountsPayable.reduce((sum, item) => sum + item.amount, 0)
  const criticalStock = stockAlerts.filter((s) => s.status === "critical").length

  const cashByAccount = [
    { name: "Stripe", balance: currentCash * 0.41, color: "#6366f1", icon: Building2, percentage: 41 },
    { name: "PayPal", balance: currentCash * 0.2, color: "#0070ba", icon: Globe, percentage: 20 },
    { name: "Bank (Chase)", balance: currentCash * 0.3, color: "#22d3ee", icon: Wallet, percentage: 30 },
    { name: "Petty Cash", balance: currentCash * 0.09, color: "#94a3b8", icon: Receipt, percentage: 9 },
  ]

  const getCMStatusColor = (cm: number) => {
    if (cm > 25) return { bg: "bg-success/10", text: "text-success", border: "border-success/20" }
    if (cm >= 10) return { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" }
    return { bg: "bg-coral/10", text: "text-coral", border: "border-coral/20" }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">CFO Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Cash flow, runway, market profitability & financial strategy
            </p>
          </div>
        </div>

        {/* Date Filter Controls */}
        <div className="flex items-center gap-2 bg-card border border-border p-2 rounded-lg shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium px-1">From</span>
            <input
              type="date"
              value={formatDateForInput(dateRange.start)}
              onChange={handleStartChange}
              className="text-sm bg-transparent border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="w-px h-4 bg-border"></div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium px-1">To</span>
            <input
              type="date"
              value={formatDateForInput(dateRange.end)}
              onChange={handleEndChange}
              className="text-sm bg-transparent border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>

      {/* ROW 1: Cash Position Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="w-4 h-4 text-primary" />
              Current Cash
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">${(currentCash / 1000).toFixed(1)}k</p>
            <p className="text-sm text-muted-foreground mt-1">
              Includes ${(metrics.totalRevenue / 1000).toFixed(1)}k revenue from selected period
            </p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingDown className="w-4 h-4 text-coral" />
              Monthly Burn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-coral">-${(monthlyBurn / 1000).toFixed(1)}k</p>
            <p className="text-sm text-muted-foreground mt-1">Net cash outflow</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-warning" />
              Cash Runway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-3xl font-bold ${isRunwaySafe ? "text-success" : "text-coral"}`}>{runway} months</p>
            <p className="text-sm text-muted-foreground mt-1">
              {isRunwaySafe ? "Safe runway" : "Critical - extend runway"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ROW 2: Stock Widget Only */}
      <Card className="card-premium">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="w-4 h-4 text-warning" />
              Stock Alerts
            </CardTitle>
            {criticalStock > 0 && (
              <Badge className="bg-coral/20 text-coral border-coral/30">{criticalStock} Critical</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5">
            {stockAlerts.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between py-1.5 px-2 rounded text-sm ${
                  item.status === "critical" ? "bg-coral/10" : ""
                }`}
              >
                <span
                  className={`truncate ${item.status === "critical" ? "text-coral font-medium" : "text-foreground"}`}
                >
                  {item.product}
                </span>
                <div className="flex items-center gap-3 text-xs">
                  <span className={item.status === "critical" ? "text-coral" : "text-muted-foreground"}>
                    {item.daysToStockout}d
                  </span>
                  <span
                    className={`font-medium ${item.status === "critical" ? "text-coral" : "text-muted-foreground"}`}
                  >
                    {item.reorderBy}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3 text-xs" onClick={() => setActiveSheet("Stock")}>
            View Full Inventory
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </CardContent>
      </Card>

      {/* ROW 3: Processor Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card
          className={`card-premium ${processorHealth.disputeRate > processorHealth.disputeThreshold ? "border-coral/50" : ""}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Dispute Rate</p>
                <p
                  className={`text-2xl font-bold mt-1 ${processorHealth.disputeRate > processorHealth.disputeThreshold ? "text-coral" : "text-success"}`}
                >
                  {processorHealth.disputeRate}%
                </p>
              </div>
              {processorHealth.disputeRate > processorHealth.disputeThreshold ? (
                <Badge className="bg-coral/20 text-coral border-coral/30">Alert</Badge>
              ) : (
                <Badge className="bg-success/20 text-success border-success/30">Healthy</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Threshold: {processorHealth.disputeThreshold}%</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Refund Rate</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{processorHealth.refundRate}%</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Normal
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Industry avg: 3-5%</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Cash on Hold</p>
                <p className="text-2xl font-bold mt-1 text-warning">${processorHealth.cashOnHold.toLocaleString()}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                Reserve
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Released in 7-14 days</p>
          </CardContent>
        </Card>
      </div>

      {/* ROW 4: Cash by Account + Global Profitability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-premium">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Building2 className="w-4 h-4 text-primary" />
                Cash by Account
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                Total: <span className="text-foreground font-medium">${(currentCash / 1000).toFixed(1)}k</span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cashByAccount.map((account, idx) => {
                const Icon = account.icon
                return (
                  <div key={idx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: account.color }} />
                        <span className="text-sm text-foreground">{account.name}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        ${(account.balance / 1000).toFixed(1)}k
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${account.percentage}%`, backgroundColor: account.color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            {cashByAccount[0].percentage > 40 && (
              <p className="text-xs text-warning mt-4 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                High concentration in Stripe ({Math.round(cashByAccount[0].percentage)}%) - consider diversifying
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="w-4 h-4 text-primary" />
                Global Profitability by Market
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground uppercase">Market</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase">Revenue</th>
                    <th className="text-right py-2 text-xs font-medium text-muted-foreground uppercase">CM%</th>
                    <th className="text-center py-2 text-xs font-medium text-muted-foreground uppercase">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {globalProfitability.map((market, idx) => {
                    const colors = getCMStatusColor(market.cm)
                    return (
                      <tr key={idx} className="border-b border-border/50">
                        <td className="py-3 text-sm font-medium text-foreground">{market.market}</td>
                        <td className="py-3 text-sm text-right text-foreground">
                          ${(market.revenue / 1000).toFixed(1)}k
                        </td>
                        <td
                          className="py-3 text-sm text-right font-medium"
                          style={{ color: market.cm > 25 ? "#22c55e" : market.cm >= 10 ? "#eab308" : "#ef4444" }}
                        >
                          {market.cm}%
                        </td>
                        <td className="py-3 text-center">
                          <Badge className={`${colors.bg} ${colors.text} ${colors.border} text-xs`}>
                            {market.cm > 25 ? "Healthy" : market.cm >= 10 ? "Moderate" : "At Risk"}
                          </Badge>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-success" />
                <span>&gt;25% CM</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-warning" />
                <span>10-25% CM</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded bg-coral" />
                <span>&lt;10% CM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 5: Accounts Payable Only */}
      <Card className="card-premium">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="w-4 h-4 text-coral" />
              Accounts Payable
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              Total: <span className="text-coral font-medium">${(totalPayable / 1000).toFixed(1)}k</span>
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accountsPayable
              .sort((a, b) => a.daysUntil - b.daysUntil)
              .map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.priority === "high" && item.daysUntil <= 7
                      ? "bg-coral/5 border-coral/20"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.vendor}</p>
                    <p className="text-xs text-muted-foreground">Due: {item.dueDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">${item.amount.toLocaleString()}</p>
                    <p
                      className={`text-xs ${
                        item.daysUntil <= 7
                          ? "text-coral"
                          : item.daysUntil <= 14
                            ? "text-warning"
                            : "text-muted-foreground"
                      }`}
                    >
                      {item.daysUntil} days
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* ROW 6: Cost of Inaction */}
      <Card className="card-premium border-warning/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-4 h-4 text-warning" />
              Cost of Inaction
            </CardTitle>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Monthly Impact</p>
              <p className="text-lg font-bold text-coral">
                ${financialIssues.reduce((sum, i) => sum + i.impact30Day, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {financialIssues.map((issue, idx) => {
              const Icon = issue.icon
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    issue.severity === "critical" ? "bg-coral/5 border-coral/20" : "bg-warning/5 border-warning/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        issue.severity === "critical" ? "bg-coral/10" : "bg-warning/10"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${issue.severity === "critical" ? "text-coral" : "text-warning"}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{issue.issue}</p>
                      <p className="text-sm text-muted-foreground">
                        Lost: ${issue.dailyCost}/day = ${issue.impact30Day.toLocaleString()}/month
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="shrink-0 bg-transparent"
                    onClick={() => setActiveSheet(issue.targetSheet)}
                  >
                    {issue.action}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AIDailyInsight type="cfo" />
    </div>
  )
}