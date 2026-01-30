"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserMinus, TrendingUp, TrendingDown } from "lucide-react"

interface CancellationReason {
  reason: string
  percentage: number
  count: number
}

const cancellationReasons: CancellationReason[] = [
  { reason: "Too expensive", percentage: 34, count: 30 },
  { reason: "Product didn't work", percentage: 28, count: 25 },
  { reason: "Have too much product", percentage: 22, count: 20 },
  { reason: "Switching to competitor", percentage: 9, count: 8 },
  { reason: "Other", percentage: 7, count: 6 },
]

const cancellationStats = {
  today: 4,
  todayTrend: "up" as const,
  thisWeek: 21,
  weekTrend: "down" as const,
  thisMonth: 89,
  monthTrend: "down" as const,
  lastMonth: 102,
}

export function CancellationTracker() {
  const monthChange = (
    ((cancellationStats.thisMonth - cancellationStats.lastMonth) / cancellationStats.lastMonth) *
    100
  ).toFixed(1)
  const isImproving = cancellationStats.thisMonth < cancellationStats.lastMonth

  return (
    <Card className="card-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserMinus className="w-4 h-4 text-coral" />
            Cancellation Tracker
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs ${isImproving ? "bg-success/10 text-success border-success/20" : "bg-coral/10 text-coral border-coral/20"}`}
          >
            {isImproving ? <TrendingDown className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1" />}
            {monthChange}% vs last month
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Time Period Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold text-coral">{cancellationStats.today}</p>
                {cancellationStats.todayTrend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-coral" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-success" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">Today</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold text-warning">{cancellationStats.thisWeek}</p>
                {cancellationStats.weekTrend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-coral" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-success" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-2xl font-bold text-foreground">{cancellationStats.thisMonth}</p>
                {cancellationStats.monthTrend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-coral" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-success" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
          </div>

          {/* Top Cancellation Reasons */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Top Reasons</p>
            <div className="space-y-2">
              {cancellationReasons.slice(0, 3).map((item, idx) => (
                <div key={item.reason} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {idx + 1}. {item.reason}
                    </span>
                    <span className="text-foreground font-medium">{item.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? "bg-coral" : idx === 1 ? "bg-warning" : "bg-muted-foreground"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
