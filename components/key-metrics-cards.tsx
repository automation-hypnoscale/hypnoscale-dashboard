"use client"

import { cn } from "@/lib/utils"
import { TrendingUp, Activity, Users } from "lucide-react"

// Profit Margin Gauge Card
export function ProfitMarginCard({ margin }: { margin: number }) {
  const isHealthy = margin > 50
  const gaugePercent = Math.min(margin, 100)

  // Calculate the arc for the gauge (semi-circle)
  const radius = 40
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (gaugePercent / 100) * circumference

  return (
    <div className="card-premium p-5 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">Profit Margin</p>
        <div className={cn("flex items-center gap-1 text-xs font-medium", isHealthy ? "text-success" : "text-coral")}>
          <TrendingUp size={14} />
          <span>{isHealthy ? "Healthy" : "Low"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Gauge Visual */}
        <div className="relative w-[100px] h-[55px] flex-shrink-0">
          <svg viewBox="0 0 100 55" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={isHealthy ? "rgb(74, 222, 128)" : "rgb(251, 113, 133)"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
            {/* Center text */}
            <text
              x="50"
              y="48"
              textAnchor="middle"
              className={cn("text-lg font-bold fill-current", isHealthy ? "text-success" : "text-coral")}
              style={{ fontSize: "16px" }}
            >
              {margin.toFixed(1)}%
            </text>
          </svg>
        </div>

        {/* Target indicator */}
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Target: &gt;50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isHealthy ? "bg-success" : "bg-coral")} />
            <span className="text-muted-foreground">Current: {margin.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// FB ROAS Health Card
export function ROASHealthCard({
  realROAS,
}: {
  realROAS: number
}) {
  const isHealthy = realROAS > 1.8 // Internal threshold check without displaying

  return (
    <div className="card-premium p-5 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">FB ROAS Health</p>
        <div className={cn("flex items-center gap-1 text-xs font-medium", isHealthy ? "text-success" : "text-coral")}>
          <Activity size={14} />
          <span>{isHealthy ? "Profitable" : "At Risk"}</span>
        </div>
      </div>

      <div className="flex items-center justify-center">
        {/* Real ROAS - Now the main focus */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-1">Real ROAS</p>
          <p className={cn("text-3xl font-bold tracking-tight", isHealthy ? "text-success" : "text-coral")}>
            {realROAS.toFixed(1)}x
          </p>
        </div>
      </div>

      {/* Status indicator */}
      <div
        className={cn(
          "mt-4 px-3 py-1.5 rounded-lg text-xs font-medium text-center",
          isHealthy ? "bg-success/10 text-success" : "bg-coral/10 text-coral",
        )}
      >
        {isHealthy ? "Above profitability threshold" : "Below profitability threshold"}
      </div>
    </div>
  )
}

// Subscription Opt-in Card
export function SubOptInCard({
  rate,
  totalOrders,
  subscribed,
}: {
  rate: number
  totalOrders: number
  subscribed: number
}) {
  const isHealthy = rate >= 15 // Target 15%+ opt-in rate
  const gaugePercent = Math.min(rate * 3, 100) // Scale for visual (33% = full)

  const radius = 40
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (gaugePercent / 100) * circumference

  return (
    <div className="card-premium p-5 rounded-2xl h-full">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground font-medium">Sub Opt-in Rate</p>
        <div className={cn("flex items-center gap-1 text-xs font-medium", isHealthy ? "text-success" : "text-coral")}>
          <Users size={14} />
          <span>{isHealthy ? "Strong" : "Low"}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Gauge Visual */}
        <div className="relative w-[100px] h-[55px] flex-shrink-0">
          <svg viewBox="0 0 100 55" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={isHealthy ? "rgb(74, 222, 128)" : "rgb(251, 113, 133)"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
            {/* Center text */}
            <text
              x="50"
              y="48"
              textAnchor="middle"
              className={cn("text-lg font-bold fill-current", isHealthy ? "text-success" : "text-coral")}
              style={{ fontSize: "16px" }}
            >
              {rate.toFixed(1)}%
            </text>
          </svg>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Target: 15%+</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">
              {subscribed.toLocaleString()} / {totalOrders.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
