"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, AlertTriangle } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

// Cohort data showing subscriber retention by month
interface CohortData {
  month: string
  startingSubs: number
  retained: number
  retentionRate: number
  churned: number
  churnRate: number
  mrrRetained: number
}

// Monthly retention data - shows how many subs remain at each month mark
const cohortRetentionData: CohortData[] = [
  { month: "M1", startingSubs: 1000, retained: 1000, retentionRate: 100, churned: 0, churnRate: 0, mrrRetained: 36000 },
  {
    month: "M2",
    startingSubs: 1000,
    retained: 720,
    retentionRate: 72,
    churned: 280,
    churnRate: 28,
    mrrRetained: 25920,
  },
  {
    month: "M3",
    startingSubs: 1000,
    retained: 580,
    retentionRate: 58,
    churned: 140,
    churnRate: 19.4,
    mrrRetained: 20880,
  },
  {
    month: "M4",
    startingSubs: 1000,
    retained: 510,
    retentionRate: 51,
    churned: 70,
    churnRate: 12.1,
    mrrRetained: 18360,
  },
  {
    month: "M5",
    startingSubs: 1000,
    retained: 460,
    retentionRate: 46,
    churned: 50,
    churnRate: 9.8,
    mrrRetained: 16560,
  },
  {
    month: "M6",
    startingSubs: 1000,
    retained: 420,
    retentionRate: 42,
    churned: 40,
    churnRate: 8.7,
    mrrRetained: 15120,
  },
  {
    month: "M7",
    startingSubs: 1000,
    retained: 390,
    retentionRate: 39,
    churned: 30,
    churnRate: 7.1,
    mrrRetained: 14040,
  },
  {
    month: "M8",
    startingSubs: 1000,
    retained: 365,
    retentionRate: 36.5,
    churned: 25,
    churnRate: 6.4,
    mrrRetained: 13140,
  },
  {
    month: "M9",
    startingSubs: 1000,
    retained: 345,
    retentionRate: 34.5,
    churned: 20,
    churnRate: 5.5,
    mrrRetained: 12420,
  },
  {
    month: "M10",
    startingSubs: 1000,
    retained: 328,
    retentionRate: 32.8,
    churned: 17,
    churnRate: 4.9,
    mrrRetained: 11808,
  },
  {
    month: "M11",
    startingSubs: 1000,
    retained: 315,
    retentionRate: 31.5,
    churned: 13,
    churnRate: 4.0,
    mrrRetained: 11340,
  },
  {
    month: "M12",
    startingSubs: 1000,
    retained: 305,
    retentionRate: 30.5,
    churned: 10,
    churnRate: 3.2,
    mrrRetained: 10980,
  },
]

// Chart data for visualization
const chartData = cohortRetentionData.map((d) => ({
  month: d.month,
  retained: d.retained,
  churned: 1000 - d.retained,
  retentionRate: d.retentionRate,
}))

// Calculate key insights
const biggestDropMonth = cohortRetentionData.reduce((prev, curr) => (curr.churnRate > prev.churnRate ? curr : prev))
const avgMonthlyChurn = (cohortRetentionData.slice(1).reduce((sum, d) => sum + d.churnRate, 0) / 11).toFixed(1)
const year1Retention = cohortRetentionData[11].retentionRate

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = cohortRetentionData.find((d) => d.month === label)
    if (!data) return null

    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Remaining:</span>
            <span className="text-foreground font-medium">{data.retained} subs</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Retention:</span>
            <span className="text-success font-medium">{data.retentionRate}%</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Lost this month:</span>
            <span className="text-coral font-medium">-{data.churned}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Monthly churn:</span>
            <span className="text-coral font-medium">{data.churnRate}%</span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function CohortRetentionAnalysis() {
  return (
    <Card className="card-premium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral/20 to-warning/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-coral" />
            </div>
            <div>
              <CardTitle className="text-lg">Subscriber Retention by Month</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Per 1,000 subscribers - when do we lose them?</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-success">{year1Retention}%</p>
              <p className="text-xs text-muted-foreground">12-month retention</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert for biggest drop */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-coral/5 border border-coral/10">
          <AlertTriangle className="w-4 h-4 text-coral flex-shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-semibold text-coral">Biggest drop: {biggestDropMonth.month}</span>
            <span className="text-muted-foreground">
              {" "}
              - Lost {biggestDropMonth.churned} subscribers ({biggestDropMonth.churnRate}% churn).{" "}
            </span>
            <span className="text-foreground">Focus retention efforts on Month 1-2 transition.</span>
          </p>
        </div>

        {/* Retention Curve Chart */}
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="retainedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                domain={[0, 1000]}
                ticks={[0, 250, 500, 750, 1000]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={500} stroke="#fbbf24" strokeDasharray="5 5" strokeOpacity={0.5} />
              <Area
                type="monotone"
                dataKey="retained"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#retainedGradient)"
                name="Retained"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Breakdown Table */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Monthly Breakdown</p>

          {/* Header */}
          <div className="grid grid-cols-6 gap-2 text-xs text-muted-foreground pb-2 border-b border-border px-2">
            <span>Month</span>
            <span className="text-center">Remaining</span>
            <span className="text-center">Retention %</span>
            <span className="text-center">Lost</span>
            <span className="text-center">Churn %</span>
            <span className="text-center">MRR Retained</span>
          </div>

          {/* Scrollable rows */}
          <div className="max-h-[240px] overflow-y-auto space-y-1">
            {cohortRetentionData.map((row, idx) => {
              const isHighChurn = row.churnRate > 15
              const isMediumChurn = row.churnRate > 8 && row.churnRate <= 15

              return (
                <div
                  key={row.month}
                  className={`grid grid-cols-6 gap-2 py-2 px-2 rounded-lg text-sm items-center ${
                    isHighChurn
                      ? "bg-coral/5 border-l-2 border-l-coral"
                      : isMediumChurn
                        ? "bg-warning/5 border-l-2 border-l-warning"
                        : "hover:bg-muted/30"
                  }`}
                >
                  <span className="font-medium text-foreground">{row.month}</span>
                  <span className="text-center text-foreground">{row.retained}</span>
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        row.retentionRate >= 50
                          ? "bg-success/10 text-success border-success/20"
                          : row.retentionRate >= 35
                            ? "bg-warning/10 text-warning border-warning/20"
                            : "bg-coral/10 text-coral border-coral/20"
                      }`}
                    >
                      {row.retentionRate}%
                    </Badge>
                  </div>
                  <span
                    className={`text-center font-medium ${row.churned > 0 ? "text-coral" : "text-muted-foreground"}`}
                  >
                    {row.churned > 0 ? `-${row.churned}` : "-"}
                  </span>
                  <div className="flex justify-center">
                    {row.churnRate > 0 ? (
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          isHighChurn
                            ? "bg-coral/10 text-coral border-coral/20"
                            : isMediumChurn
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-muted/50 text-muted-foreground border-border"
                        }`}
                      >
                        {row.churnRate}%
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                  <span className="text-center text-muted-foreground">${row.mrrRetained.toLocaleString()}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 pt-4 border-t border-border">
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-coral">28%</p>
            <p className="text-xs text-muted-foreground">M1-M2 Drop</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-warning">{avgMonthlyChurn}%</p>
            <p className="text-xs text-muted-foreground">Avg Monthly Churn</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-success">{year1Retention}%</p>
            <p className="text-xs text-muted-foreground">Year 1 Retention</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/30">
            <p className="text-lg font-bold text-foreground">3.3</p>
            <p className="text-xs text-muted-foreground">Avg Orders/Sub</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
