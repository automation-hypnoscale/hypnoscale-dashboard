"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, AlertTriangle, TrendingUp, Target, Package, Users, Loader2 } from "lucide-react"

type InsightType = "performance" | "cfo" | "mrr" | "stock" | "team"

interface DBInsight {
  status: "success" | "warning" | "critical"
  title: string
  content: string // Map this to description
  type: InsightType
}

const getStatusConfig = (status: "success" | "warning" | "critical") => {
  switch (status) {
    case "success":
      return { dot: "bg-success", bg: "bg-success/5", text: "text-success" }
    case "warning":
      return { dot: "bg-warning", bg: "bg-warning/5", text: "text-warning" }
    case "critical":
      return { dot: "bg-coral", bg: "bg-coral/5", text: "text-coral" }
    default:
      return { dot: "bg-gray-400", bg: "bg-gray-50", text: "text-gray-400" }
  }
}

const getIcon = (type: InsightType, status: string) => {
  if (status === "critical" || status === "warning") return AlertTriangle
  switch (type) {
    case "performance": return TrendingUp
    case "cfo": return Target
    case "mrr": return Users
    case "stock": return Package
    default: return Sparkles
  }
}

export function AIDailyInsight({ type }: { type: InsightType }) {
  const [insights, setInsights] = useState<DBInsight[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true)
      const { data, error } = await supabase
        .from("ai_daily_insights")
        .select("*")
        .eq("type", type)
        .order("created_at", { ascending: false })
        .limit(3)

      if (!error && data) {
        setInsights(data)
      }
      setLoading(false)
    }

    fetchInsights()
  }, [type])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-warning/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Daily Insight</h2>
            <p className="text-xs text-gray-600">Real-time analysis of your {type} data</p>
          </div>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">
          {loading ? "Analyzing..." : "Today"}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          // Loading Skeleton
          [1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl border-2 border-dashed border-gray-200 animate-pulse bg-gray-50" />
          ))
        ) : insights.length > 0 ? (
          insights.map((insight, idx) => {
            const config = getStatusConfig(insight.status)
            const Icon = getIcon(insight.type, insight.status)
            return (
              <Card key={idx} className={`border-2 border-gray-900 ${config.bg} shadow-sm transition-all hover:shadow-md`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full ${config.dot} mt-1.5`} />
                      <CardTitle className="text-sm font-bold text-gray-900 leading-tight">
                        {insight.title}
                      </CardTitle>
                    </div>
                    <Icon className={`w-4 h-4 ${config.text} flex-shrink-0`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {insight.content}
                  </p>
                </CardContent>
              </Card>
            )
          })
        ) : (
          // Empty State
          <div className="col-span-3 py-10 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No {type} insights generated for today yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}