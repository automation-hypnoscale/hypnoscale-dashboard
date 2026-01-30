"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, AlertTriangle, TrendingUp, Target, Package, Users } from "lucide-react"

type InsightType = "performance" | "cfo" | "mrr" | "stock" | "team"

interface InsightData {
  status: "success" | "warning" | "critical"
  title: string
  description: string
  icon: typeof TrendingUp
}

const insights: Record<InsightType, InsightData[]> = {
  performance: [
    {
      status: "warning",
      title: "ROAS Declining on Ad Set #4",
      description: "Performance dropped 12% over last 3 days. Consider pausing or reducing budget by 30%.",
      icon: TrendingUp,
    },
    {
      status: "critical",
      title: "AOV $8 Below Target",
      description: "Current AOV $52 vs target $70. Test upsell offers at checkout to increase average order value.",
      icon: Target,
    },
    {
      status: "success",
      title: "Mobile Conversion +18%",
      description: "Cold traffic converting 18% better on mobile vs desktop. Consider mobile-first ad creative.",
      icon: TrendingUp,
    },
  ],
  cfo: [
    {
      status: "warning",
      title: "Cash Runway: 6.1 Months",
      description: "Below safe threshold. Recommend reducing monthly burn by $5k or securing additional funding.",
      icon: AlertTriangle,
    },
    {
      status: "critical",
      title: "UK Market CM% Dropped to 12%",
      description: "Contribution margin declining. Investigate shipping costs and payment processor fees.",
      icon: Target,
    },
    {
      status: "warning",
      title: "Stripe Balance 41% of Total Cash",
      description: "High concentration risk. Consider diversifying to PayPal or bank account for better stability.",
      icon: AlertTriangle,
    },
  ],
  mrr: [
    {
      status: "critical",
      title: "Month 2 Churn at 28%",
      description: "Highest drop-off point. Add onboarding email sequence at day 20-30 to improve retention.",
      icon: AlertTriangle,
    },
    {
      status: "warning",
      title: "Neuro Supplement Churn +5%",
      description: "Churn increased vs last month. Check for quality complaints or shipping delays.",
      icon: Target,
    },
    {
      status: "success",
      title: "Rebill Success at 72%",
      description: "Above target. Consider enabling dunning management to push success rate to 75%+.",
      icon: TrendingUp,
    },
  ],
  stock: [
    {
      status: "critical",
      title: "Warming Oils Stockout in 8 Days",
      description: "Reorder deadline passed. Expedite production order NOW or risk lost sales.",
      icon: Package,
    },
    {
      status: "success",
      title: "Comfort Balm Sales Velocity +40%",
      description: "Demand increasing. Consider increasing next reorder quantity by 25-30%.",
      icon: TrendingUp,
    },
    {
      status: "warning",
      title: "Vein Supplement has 28 Days Stock",
      description: "Above average inventory. Delay next order by 1-2 weeks to optimize cash flow.",
      icon: Package,
    },
  ],
  team: [
    {
      status: "warning",
      title: "Developer Costs 35% of Team Burn",
      description:
        "Part-time developer at $150/day is highest cost. Consider transitioning to full-time for better ROI.",
      icon: Users,
    },
    {
      status: "success",
      title: "Software Stack Optimized",
      description: "Current $37/day for services is efficient for your scale. No immediate cuts recommended.",
      icon: TrendingUp,
    },
    {
      status: "critical",
      title: "Klaviyo Spend High for List Size",
      description:
        "$500/mo for email marketing. Review if engagement rates justify cost or switch to cheaper alternative.",
      icon: AlertTriangle,
    },
  ],
}

const getStatusConfig = (status: "success" | "warning" | "critical") => {
  switch (status) {
    case "success":
      return {
        dot: "bg-success",
        bg: "bg-success/5",
        border: "border-success/20",
        text: "text-success",
      }
    case "warning":
      return {
        dot: "bg-warning",
        bg: "bg-warning/5",
        border: "border-warning/20",
        text: "text-warning",
      }
    case "critical":
      return {
        dot: "bg-coral",
        bg: "bg-coral/5",
        border: "border-coral/20",
        text: "text-coral",
      }
  }
}

export function AIDailyInsight({ type }: { type: InsightType }) {
  const typeInsights = insights[type]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-warning/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI Daily Insight</h2>
            <p className="text-xs text-gray-600">Actionable recommendations updated daily</p>
          </div>
        </div>
        <Badge className="bg-primary/10 text-primary border-primary/20">Today</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {typeInsights.map((insight, idx) => {
          const config = getStatusConfig(insight.status)
          const Icon = insight.icon
          return (
            <Card key={idx} className={`border-2 border-gray-900 ${config.bg}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.dot} mt-1.5`} />
                    <CardTitle className="text-sm font-semibold text-gray-900 leading-tight">{insight.title}</CardTitle>
                  </div>
                  <Icon className={`w-4 h-4 ${config.text} flex-shrink-0`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-600 leading-relaxed">{insight.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
