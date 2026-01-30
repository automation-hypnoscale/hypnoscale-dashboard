"use client"

import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string
  subtext?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  sparkline?: number[]
  accentColor?: "primary" | "warning" | "coral" | "success" | "teal"
}

export function KPICard({
  title,
  value,
  subtext,
  trend = "neutral",
  trendValue,
  sparkline,
  accentColor,
}: KPICardProps) {
  const trendColors = {
    up: "text-success",
    down: "text-coral",
    neutral: "text-muted-foreground",
  }

  const accentBorderColors = {
    primary: "border-l-primary",
    warning: "border-l-warning",
    coral: "border-l-coral",
    success: "border-l-success",
    teal: "border-l-cyan-500",
  }

  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  const generateSparkline = (data: number[]) => {
    if (!data || data.length < 2) return ""
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 80
    const height = 24
    const points = data.map((v, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    return `M${points.join(" L")}`
  }

  const sparklineColors = {
    primary: "rgb(34, 211, 238)",
    warning: "rgb(251, 191, 36)",
    coral: "rgb(251, 113, 133)",
    success: "rgb(74, 222, 128)",
    teal: "rgb(45, 212, 191)",
  }
  const sparklineColor = accentColor ? sparklineColors[accentColor] : "rgb(34, 211, 238)"

  return (
    <div
      className={cn(
        "bg-white border-2 border-gray-900 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group h-full",
        accentColor && `border-l-[4px] ${accentBorderColors[accentColor]}`,
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-600 font-medium">{title}</p>
        {trend !== "neutral" && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColors[trend]}`}>
            <TrendIcon size={14} />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
          {subtext && <p className="text-xs text-gray-600 mt-1 truncate">{subtext}</p>}
        </div>

        {sparkline && sparkline.length > 0 && (
          <svg
            width="80"
            height="24"
            className="opacity-50 group-hover:opacity-80 transition-opacity flex-shrink-0 ml-4"
          >
            <defs>
              <linearGradient id={`sparkline-gradient-${title.replace(/\s+/g, "-")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={sparklineColor} stopOpacity="0.5" />
                <stop offset="100%" stopColor={sparklineColor} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={generateSparkline(sparkline)}
              fill="none"
              stroke={sparklineColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  )
}
