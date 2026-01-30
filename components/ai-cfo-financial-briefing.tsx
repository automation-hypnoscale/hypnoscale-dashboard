"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight, Brain, Sparkles, Copy, Download, Check } from "lucide-react"
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
    cashRunway: Insight[]
    marketProfitability: Insight[]
    treasury: Insight[]
  }
  analyzedAt: string
}

const generateDayData = (daysOffset: number): DayData => {
  const date = new Date(2025, 10, 24)
  date.setDate(date.getDate() + daysOffset)

  const insightSets: Record<number, DayData["insights"]> = {
    0: {
      cashRunway: [
        {
          id: "cr1",
          status: "success",
          text: "Runway at 6.1 months. Safe to scale ad spend to $8.2k/day without risk.",
        },
        {
          id: "cr2",
          status: "warning",
          text: "USA: Adspend LLC Facebook account has 12 days runway. Top up $10k before Friday.",
        },
        { id: "cr3", status: "info", text: "AU: Stripe reserve releasing $18k on Dec 3. Available for reinvestment." },
        {
          id: "cr4",
          status: "info",
          text: "Monthly burn rate decreased 8% due to shipping optimization. Runway extended by 2 weeks.",
        },
        { id: "cr5", status: "success", text: "CA: Operations cash positive. $12k surplus after all costs." },
      ],
      marketProfitability: [
        {
          id: "mp1",
          status: "success",
          text: "USA: Highest margin at 42%. Scale aggressively - increase budget by 30%.",
        },
        {
          id: "mp2",
          status: "warning",
          text: "UK: Bleeding money at 8% margin. Shipping costs 22% vs 12% benchmark. Fix or exit.",
        },
        {
          id: "mp3",
          status: "success",
          text: "AU: Cash cow at 45% margin. Low returns (6%), high AOV ($90). Maintain spend.",
        },
        {
          id: "mp4",
          status: "info",
          text: "NZ: New market showing 31% margin after first 30 days. Monitor closely before scaling.",
        },
        { id: "mp5", status: "success", text: "IE: At 38% margin. Strong subscription uptake offsetting high CAC." },
      ],
      treasury: [
        {
          id: "t1",
          status: "warning",
          text: "AU: 41% of cash in one Stripe account. Concentration risk - diversify processors.",
        },
        {
          id: "t2",
          status: "info",
          text: "USA: PayPal balance $28.4k available instantly. Consider transferring $15k to ad accounts.",
        },
        { id: "t3", status: "success", text: "Chase account earning 4.5% APY on idle cash. $192 earned this month." },
        {
          id: "t4",
          status: "info",
          text: "Accounts payable: $36.9k due next 37 days. Cash position covers 3.8x obligations.",
        },
      ],
    },
    "-1": {
      cashRunway: [
        { id: "cr1", status: "info", text: "Runway stable at 6.3 months. Weekend ad spend lower than weekday." },
        {
          id: "cr2",
          status: "success",
          text: "AU: Received $12k wire from wholesale partner. Cash position improved.",
        },
      ],
      marketProfitability: [
        { id: "mp1", status: "success", text: "USA: Margin improved to 43% from Friday promo. Continue testing." },
        {
          id: "mp2",
          status: "warning",
          text: "UK: Still underperforming. Shipping partner sent new rate card - reviewing.",
        },
      ],
      treasury: [
        { id: "t1", status: "info", text: "All accounts reconciled. No discrepancies found." },
        { id: "t2", status: "success", text: "USA: Stripe payout processed: $8,420 arriving Monday." },
      ],
    },
    "1": {
      cashRunway: [],
      marketProfitability: [],
      treasury: [],
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

export function AICFOFinancialBriefing() {
  const [dayOffset, setDayOffset] = useState(0)
  const [slideDirection, setSlideDirection] = useState<"left" | "right" | null>(null)
  const [copied, setCopied] = useState(false)

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

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(dayData.insights, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="mt-12 pt-10 border-t border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">AI Strategic Briefing</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Analyzed at {dayData.analyzedAt} <span className="text-primary">• Financial strategy insights</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyJSON}
            className="h-9 px-3 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 bg-transparent"
          >
            {copied ? <Check className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
            {copied ? "Copied" : "Copy JSON"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 bg-transparent"
          >
            <Download className="w-4 h-4 mr-1.5" />
            Export Report
          </Button>

          <div className="flex items-center gap-2 ml-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevDay}
              className="h-9 w-9 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="min-w-[200px] text-center px-5 py-2 bg-card rounded-xl border border-border">
              <span className="text-sm font-medium text-foreground">
                {formatDate(dayData.date)} • {formatFullDate(dayData.date)}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextDay}
              className="h-9 w-9 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-secondary/50 bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div
        className={`
          grid grid-cols-1 md:grid-cols-3 gap-6
          ${slideDirection === "left" ? "animate-slide-left" : ""}
          ${slideDirection === "right" ? "animate-slide-right" : ""}
        `}
      >
        <InsightColumn title="Cash & Runway" insights={dayData.insights.cashRunway} />
        <InsightColumn title="Market Profitability" insights={dayData.insights.marketProfitability} />
        <InsightColumn title="Treasury" insights={dayData.insights.treasury} />
      </div>
    </section>
  )
}
