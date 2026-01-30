"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChurnPerProductOperational } from "./churn-per-product"
import { CohortRetentionAnalysis } from "./cohort-retention-analysis"
import { CancellationTracker } from "./cancellation-tracker"
import { AIDailyInsight } from "./ai-daily-insight"
import { TrendingUp, Users, DollarSign, Target, BarChart3, RefreshCw } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for charts
const mrrGrowthData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  mrr: 35000 + Math.random() * 5000 + i * 80,
}))

const subsData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  new: Math.floor(3 + Math.random() * 5),
  cancelled: Math.floor(1 + Math.random() * 3),
}))

export function MRRDashboard() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-warning/20 to-warning/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">MRR Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Subscription health, churn analysis, and recurring revenue tracking
            </p>
          </div>
        </div>
      </div>

      {/* Row 1: Top Metrics - 5 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
            <Users className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,882</div>
            <p className="text-xs text-success mt-1">+127 this month</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total MRR</CardTitle>
            <DollarSign className="w-4 h-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$37,455</div>
            <p className="text-xs text-success mt-1">+12% vs last month</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rebill Success</CardTitle>
            <RefreshCw className="w-4 h-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">72.4%</div>
            <p className="text-xs text-success mt-1">Target: ≥70%</p>
            <div className="text-xs text-muted-foreground mt-2">1,362 / 1,882 successful</div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
            <Target className="w-4 h-4 text-coral" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">4.2%</div>
            <p className="text-xs text-success mt-1">Target: ≤5%</p>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sub Opt-in Rate</CardTitle>
            <BarChart3 className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">8.4%</div>
            <p className="text-xs text-coral mt-1">Target: ≥12%</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: New vs Cancelled Subs Chart */}
      <Card className="card-premium">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-success/20 to-coral/20 flex items-center justify-center">
              <Users className="w-4 h-4 text-success" />
            </div>
            <CardTitle>New vs Cancelled Subscribers (30 Days)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 px-6 pb-4">
          <ChartContainer
            config={{
              new: {
                label: "New Subscribers",
                color: "#4ade80",
              },
              cancelled: {
                label: "Cancelled",
                color: "#fb7185",
              },
            }}
            className="h-[180px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subsData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="new" fill="#4ade80" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cancelled" fill="#fb7185" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Row 3: MRR Growth Trend */}
      <Card className="card-premium">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-warning/20 to-primary/20 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-warning" />
            </div>
            <CardTitle>MRR Growth Trend (30 Days)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0 px-6 pb-4">
          <ChartContainer
            config={{
              mrr: {
                label: "MRR",
                color: "#fbbf24",
              },
            }}
            className="h-[180px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mrrGrowthData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.12)" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="mrr" stroke="#fbbf24" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Row 4: Churn per Product */}
      <ChurnPerProductOperational />

      {/* Row 5: Cohort Retention Analysis */}
      <CohortRetentionAnalysis />

      {/* Row 6: Cancellation Tracker */}
      <CancellationTracker />

      {/* AI Daily Insight section at the bottom */}
      <AIDailyInsight type="mrr" />
    </div>
  )
}
