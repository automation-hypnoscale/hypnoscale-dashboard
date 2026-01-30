"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, TrendingUp, TrendingDown } from "lucide-react"

interface SubMetric {
  name: string
  value: string
  percentage?: number
  trend?: "up" | "down" | "neutral"
}

interface ExpandableKPICardProps {
  title: string
  mainValue: string
  target?: string
  subMetrics: SubMetric[]
  icon: React.ReactNode
  status?: "on-track" | "warning" | "critical"
}

export function ExpandableKPICard({
  title,
  mainValue,
  target,
  subMetrics,
  icon,
  status = "on-track",
}: ExpandableKPICardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const statusColors = {
    "on-track": "text-success",
    warning: "text-warning",
    critical: "text-coral",
  }

  return (
    <div
      className={cn(
        "bg-white border-2 border-gray-900 rounded-2xl overflow-hidden transition-all duration-300 ease-in-out cursor-pointer hover:shadow-md",
        isExpanded ? "shadow-lg" : "",
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Main Content */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <ChevronDown
            className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isExpanded ? "rotate-180" : "")}
          />
        </div>

        <div className="flex items-baseline gap-2">
          <span className={cn("text-3xl font-bold", statusColors[status])}>{mainValue}</span>
          {target && <span className="text-xs text-gray-500">target: {target}</span>}
        </div>

        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <span>{subMetrics.length} channels</span>
          <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
        </div>
      </div>

      {/* Expandable Section */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-gray-50">
          <div className="space-y-2">
            {subMetrics.map((metric, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  {metric.trend &&
                    (metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-success" />
                    ) : metric.trend === "down" ? (
                      <TrendingDown className="w-3 h-3 text-coral" />
                    ) : null)}
                  <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">{metric.value}</span>
                  {metric.percentage !== undefined && (
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${metric.percentage}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
