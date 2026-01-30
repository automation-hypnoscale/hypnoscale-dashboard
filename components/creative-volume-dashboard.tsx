"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Zap, Clock, Activity, AlertTriangle, TrendingUp, Eye, X, Award, Wifi, Shield } from "lucide-react"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar } from "recharts"

// Top metrics data
const creativeMetrics = {
  testedThisMonth: 47,
  winningRate: 14.9, // spent $100+ with 1.3+ ROAS
  killRate: 68.1, // killed before $100 spend
  avgDaysToWinner: 4.2,
  activeCreatives: 12,
}

// 30-day timeline data
const timelineData = (() => {
  const data = []
  let cumulativeLaunched = 0
  let cumulativeWinners = 0

  for (let i = 30; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    const launchedToday = Math.floor(Math.random() * 4) + (i % 7 === 1 ? 3 : 1)
    const winnersToday = Math.random() > 0.7 ? 1 : 0

    cumulativeLaunched += launchedToday
    cumulativeWinners += winnersToday

    data.push({
      day: 30 - i,
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      launched: launchedToday,
      winners: winnersToday,
      cumulativeLaunched,
      cumulativeWinners,
    })
  }
  return data
})()

// Competitor intelligence
const competitorAlerts = [
  {
    competitor: "Brand X",
    newAds: 42,
    scalingAngle: "Pain relief testimonials",
    spendEstimate: "$50k+/day",
    threat: "high",
    daysSinceDetected: 3,
  },
  {
    competitor: "Brand Y",
    newAds: 18,
    scalingAngle: "Before/after visuals",
    spendEstimate: "$20k+/day",
    threat: "medium",
    daysSinceDetected: 7,
  },
]

// Internal breakthroughs
const internalBreakthroughs = [
  {
    creative: "UGC-047 (Kitchen testimonial)",
    improvement: 47,
    metric: "CVR",
    roas: 2.8,
    daysActive: 12,
    status: "scaling",
  },
  {
    creative: "Static-089 (Pain point)",
    improvement: 23,
    metric: "CTR",
    roas: 1.9,
    daysActive: 5,
    status: "testing",
  },
]

// Top angle performance
const anglePerformance = [
  { angle: "Pain Relief Testimonials", creatives: 8, avgROAS: 2.4, winRate: 25, spend: 42000, status: "winner" },
  { angle: "Before/After Results", creatives: 6, avgROAS: 1.8, winRate: 17, spend: 28000, status: "stable" },
  { angle: "Lifestyle Integration", creatives: 5, avgROAS: 1.4, winRate: 10, spend: 18000, status: "testing" },
  { angle: "Scientific Backing", creatives: 4, avgROAS: 0.9, winRate: 5, spend: 12000, status: "declining" },
  { angle: "Urgency/Scarcity", creatives: 3, avgROAS: 1.1, winRate: 8, spend: 8000, status: "testing" },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card-elevated border border-border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function CreativeVolumeDashboard() {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <X className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Creative Command Center</h1>
            <p className="text-sm text-muted-foreground">Real-time creative intelligence and performance tracking</p>
          </div>
        </div>
      </div>

      {/* ROW 1: Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Tested This Month</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{creativeMetrics.testedThisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">creatives launched</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-2 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Win Rate</span>
            </div>
            <div className="text-2xl font-bold text-emerald-400">{creativeMetrics.winningRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">$100+ spend, 1.3+ ROAS</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-2 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-4 w-4 text-red-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Kill Rate</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{creativeMetrics.killRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">killed before $100</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Avg Days to Winner</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{creativeMetrics.avgDaysToWinner}</div>
            <p className="text-xs text-muted-foreground mt-1">days testing</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border border-l-2 border-l-cyan-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Active Creatives</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{creativeMetrics.activeCreatives}</div>
            <p className="text-xs text-muted-foreground mt-1">currently running</p>
          </CardContent>
        </Card>
      </div>

      {/* ROW 2: Timeline Chart + Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline Chart */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-purple-400" />
                Creative Launch Timeline
              </CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-purple-500/60" />
                  <span className="text-muted-foreground">Launched</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                  <span className="text-muted-foreground">Winners</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="launched" name="Launched" fill="#a855f7" opacity={0.6} radius={[2, 2, 0, 0]} />
                  <Bar dataKey="winners" name="Winners" fill="#10b981" radius={[2, 2, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Competitor Alert */}
        <Card className="bg-card border-border border-l-2 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-amber-400" />
              Competitor Intel
              <Badge variant="outline" className="ml-auto text-xs bg-amber-500/10 text-amber-400 border-amber-500/30">
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {competitorAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  alert.threat === "high" ? "bg-red-500/5 border-red-500/20" : "bg-amber-500/5 border-amber-500/20"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-foreground">{alert.competitor}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      alert.threat === "high"
                        ? "bg-red-500/10 text-red-400 border-red-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {alert.threat.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Badge variant="secondary" className="text-xs bg-muted/50">
                    {alert.newAds} new ads
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-muted/50">
                    {alert.spendEstimate}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Scaling: <span className="text-foreground">{alert.scalingAngle}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">Detected {alert.daysSinceDetected} days ago</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ROW 3: Internal Breakthroughs + Top Angles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Internal Breakthroughs */}
        <Card className="bg-card border-border border-l-2 border-l-emerald-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              Internal Breakthroughs
              <Badge
                variant="outline"
                className="ml-auto text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
              >
                ACTIONABLE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {internalBreakthroughs.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-foreground">{item.creative}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      item.status === "scaling"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                    }`}
                  >
                    {item.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-300">
                    +{item.improvement}% {item.metric}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-muted/50">
                    ROAS {item.roas}
                  </Badge>
                  <Badge variant="secondary" className="text-xs bg-muted/50">
                    {item.daysActive} Days Active
                  </Badge>
                </div>
                <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Outperforming control by {item.improvement}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Angle Performance */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" />
              Top Angle Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-5 gap-2 text-xs text-muted-foreground uppercase tracking-wide pb-2 border-b border-border">
                <span className="col-span-2">Angle</span>
                <span className="text-center">ROAS</span>
                <span className="text-center">Win%</span>
                <span className="text-right">Spend</span>
              </div>

              {anglePerformance.map((angle, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-5 gap-2 items-center py-2 rounded px-2 ${
                    angle.status === "winner" ? "bg-emerald-500/5" : angle.status === "declining" ? "bg-red-500/5" : ""
                  }`}
                >
                  <div className="col-span-2 flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        angle.status === "winner"
                          ? "bg-emerald-500"
                          : angle.status === "stable"
                            ? "bg-cyan-500"
                            : angle.status === "declining"
                              ? "bg-red-500"
                              : "bg-amber-500"
                      }`}
                    />
                    <span className="text-sm text-foreground truncate">{angle.angle}</span>
                  </div>
                  <div className="text-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        angle.avgROAS >= 2.0
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : angle.avgROAS >= 1.3
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                      }`}
                    >
                      {angle.avgROAS}x
                    </Badge>
                  </div>
                  <div className="text-center text-sm text-muted-foreground">{angle.winRate}%</div>
                  <div className="text-right text-sm text-muted-foreground">${(angle.spend / 1000).toFixed(0)}k</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ROW 4: Quick Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Eye className="h-4 w-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Impressions (30d)</p>
              <p className="text-lg font-semibold text-foreground">4.2M</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10">
              <Target className="h-4 w-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg CTR (Winners)</p>
              <p className="text-lg font-semibold text-foreground">2.8%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Best Performer ROAS</p>
              <p className="text-lg font-semibold text-emerald-400">3.4x</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fatiguing Soon</p>
              <p className="text-lg font-semibold text-amber-400">3 creatives</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
