"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

interface CostItem {
  name: string
  value: string
  percentage?: number
  daily?: boolean
}

interface ExpandableCostCardProps {
  title: string
  totalValue: string
  subtitle?: string
  items: CostItem[]
  icon: React.ReactNode
  accentColor?: "coral" | "primary" | "warning" | "success"
}

export function ExpandableCostCard({
  title,
  totalValue,
  subtitle,
  items,
  icon,
  accentColor = "coral",
}: ExpandableCostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const accentColors = {
    coral: "text-coral bg-coral/10",
    primary: "text-primary bg-primary/10",
    warning: "text-warning bg-warning/10",
    success: "text-success bg-success/10",
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
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", accentColors[accentColor])}>
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-600">{title}</span>
          </div>
          <ChevronDown
            className={cn("w-4 h-4 text-gray-400 transition-transform duration-300", isExpanded ? "rotate-180" : "")}
          />
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{totalValue}</span>
        </div>

        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}

        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
          <span>
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
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
            {items.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  {item.daily && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">/day</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                  {item.percentage !== undefined && (
                    <div className="flex items-center gap-1">
                      <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            accentColor === "coral"
                              ? "bg-coral"
                              : accentColor === "warning"
                                ? "bg-warning"
                                : accentColor === "success"
                                  ? "bg-success"
                                  : "bg-primary",
                          )}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{item.percentage}%</span>
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
