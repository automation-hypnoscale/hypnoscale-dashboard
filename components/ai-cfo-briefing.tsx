"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Brain, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

type InsightStatus = "warning" | "info" | "success"

interface Insight {
  id: string
  status: InsightStatus
  text: string
}

interface DayData {
  date: Date
  insights: {
    overall: Insight[]
    facebook: Insight[]
    shopify: Insight[]
    subscription: Insight[]
    inventory: Insight[]
  }
  analyzedAt: string
}

const generateDayData = (daysOffset: number): DayData => {
  const date = new Date(2025, 10, 24)
  date.setDate(date.getDate() + daysOffset)

  const insightSets: Record<number, DayData["insights"]> = {
    0: {
      overall: [
        { id: "o1", status: "success", text: "Revenue up 12% WoW. Strong performance across all channels." },
        { id: "o2", status: "info", text: "USA: CAC decreased by $2.40. Consider scaling ad spend." },
        { id: "o3", status: "warning", text: "UK: Conversion rate dropped 8%. Check checkout flow for issues." },
        { id: "o4", status: "success", text: "AU: Market performing at 45% margin. Strong AOV of $90." },
      ],
      facebook: [
        { id: "f1", status: "warning", text: "CPM increased 23% overnight. Pause low-ROAS campaigns immediately." },
        { id: "f2", status: "success", text: "USA: Lookalike audience 3.2x ROAS. Increase budget by 20%." },
        { id: "f3", status: "info", text: "UK: New creative testing shows +15% CTR on video ads." },
        { id: "f4", status: "success", text: "CA: Campaign hitting 4.1x ROAS. Scale to $500/day." },
      ],
      shopify: [
        { id: "s1", status: "success", text: "AOV reached $127, highest this quarter." },
        { id: "s2", status: "warning", text: "USA: Cart abandonment at 72%. Review shipping costs display." },
        { id: "s3", status: "info", text: "NZ: Store page speed improved by 340ms after CDN update." },
      ],
      subscription: [
        { id: "sub1", status: "info", text: "1,247 new subscribers this week. Churn stable at 4.2%." },
        { id: "sub2", status: "success", text: "USA: LTV:CAC ratio improved to 4.8:1. Subscription model healthy." },
        {
          id: "sub3",
          status: "warning",
          text: "UK: Subscription cancellations up 18%. Survey suggests pricing concern.",
        },
        { id: "sub4", status: "success", text: "IE: Sub opt-in rate at 28%, highest in EU markets." },
      ],
      inventory: [
        { id: "i1", status: "warning", text: "SKU-4521 stock critical: 12 units remaining. Reorder now." },
        { id: "i2", status: "info", text: "Q1 inventory arriving Dec 15. Storage capacity confirmed." },
        { id: "i3", status: "success", text: "AU: Warehouse fully stocked. 45 days of inventory on hand." },
      ],
    },
    "-1": {
      overall: [
        { id: "o1", status: "info", text: "Weekend traffic 8% below forecast. Normal seasonal pattern." },
        { id: "o2", status: "success", text: "USA: Black Friday prep complete. All systems operational." },
      ],
      facebook: [
        { id: "f1", status: "info", text: "Ad account health score: 92/100. No policy violations." },
        { id: "f2", status: "warning", text: "USA: Attribution window changes affecting reported conversions." },
      ],
      shopify: [{ id: "s1", status: "success", text: "Site speed improved 340ms after CDN optimization." }],
      subscription: [{ id: "sub1", status: "success", text: "Annual plan conversion rate at 34%, up from 28%." }],
      inventory: [
        { id: "i1", status: "success", text: "All top 20 SKUs fully stocked for holiday rush." },
        { id: "i2", status: "info", text: "USA: 3PL partner confirmed 2-day shipping through Dec 23." },
      ],
    },
    "1": {
      overall: [],
      facebook: [],
      shopify: [],
      subscription: [],
      inventory: [],
    },
  }

  const insights = insightSets[daysOffset] || insightSets[0]

  return { date, insights, analyzedAt: "8:00 AM" }
}

const formatDate = (date: Date): string => {
  const today = new Date(2025, 10, 24)
  const diffTime = date.getTime() - today.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === -1) return "Yesterday"
  if (diffDays === 1) return "Tomorrow"

  return date.toLocaleDateString("en-US", { weekday: "long" })
}

const formatFullDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

interface InsightCardProps {
  insight: Insight
  floatClass: string
}

function InsightCard({ insight, floatClass }: InsightCardProps) {
  const statusStyles = {
    warning: "border-coral/20 bg-coral/5 hover:border-coral/40",
    info: "border-border bg-card-elevated/50 hover:border-primary/30",
    success: "border-success/20 bg-success/5 hover:border-success/40",
  }

  const statusDotColors = {
    warning: "bg-coral shadow-[0_0_8px_rgba(251,113,133,0.5)]",
    info: "bg-primary/60",
    success: "bg-success shadow-[0_0_8px_rgba(74,222,128,0.5)]",
  }

  return (
    <div
      className={`
        group p-4 rounded-xl border backdrop-blur-sm
        ${statusStyles[insight.status]}
        hover:-translate-y-1 hover:shadow-lg
        transition-all duration-300 ease-out
        ${floatClass}
      `}
    >
      <div className="flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${statusDotColors[insight.status]}`} />
        <p className="text-sm text-foreground/90 leading-relaxed">{insight.text}</p>
      </div>
    </div>
  )
}

interface InsightColumnProps {
  title: string
  insights: Insight[]
  icon?: React.ReactNode
}

function InsightColumn({ title, insights, icon }: InsightColumnProps) {
  const floatClasses = [
    "animate-float",
    "animate-float-delay-1",
    "animate-float-delay-2",
    "animate-float-delay-3",
    "animate-float-delay-4",
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-lg">
          {insights.length}
        </span>
      </div>

      {insights.length > 0 ? (
        <div className="flex flex-col gap-3">
          {insights.map((insight, idx) => (
            <InsightCard key={insight.id} insight={insight} floatClass={floatClasses[idx % floatClasses.length]} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-muted-foreground/50 text-sm">No observations</p>
        </div>
      )}
    </div>
  )
}

export function AICFOBriefing() {
  const [dayOffset, setDayOffset] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)

  const dayData = generateDayData(dayOffset)

  const handlePrevDay = () => {
    setSlideDirection("right")
    setDayOffset((prev) => prev - 1)
    setTimeout(() => setSlideDirection(null), 400)
  }

  const handleNextDay = () => {
    setSlideDirection("left")
    setDayOffset((prev) => prev + 1)
    setTimeout(() => setSlideDirection(null), 400)
  }

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">AI Operations Briefing</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Analyzed at {dayData.analyzedAt} <span className="text-primary">• Operational insights</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevDay}
            className="h-10 w-10 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 bg-transparent"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="min-w-[200px] text-center px-5 py-2.5 bg-card rounded-xl border border-border">
            <span className="text-sm font-medium text-foreground">
              {formatDate(dayData.date)} • {formatFullDate(dayData.date)}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextDay}
            className="h-10 w-10 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 bg-transparent"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div
        className={`
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6
          ${slideDirection === "left" ? "animate-slide-left" : ""}
          ${slideDirection === "right" ? "animate-slide-right" : ""}
        `}
      >
        <InsightColumn title="Overall" insights={dayData.insights.overall} />
        <InsightColumn title="Facebook" insights={dayData.insights.facebook} />
        <InsightColumn title="Shopify" insights={dayData.insights.shopify} />
        <InsightColumn title="Subscription" insights={dayData.insights.subscription} />
        <InsightColumn title="Inventory" insights={dayData.insights.inventory} />
      </div>
    </section>
  )
}
