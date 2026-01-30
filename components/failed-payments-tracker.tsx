"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CreditCard, DollarSign, CheckCircle, Target } from "lucide-react"

interface PaymentData {
  totalAttempts: number
  approved: number
  failed: number
  approvalRate: number
  targetRate: number
  revenueProcessed: number
  revenueFailed: number
}

// Cold Traffic: Target 85%+ approval rate
export function FailedPaymentsColdTraffic() {
  const data: PaymentData = {
    totalAttempts: 847,
    approved: 724,
    failed: 123,
    approvalRate: 85.5,
    targetRate: 85,
    revenueProcessed: 57920,
    revenueFailed: 9840,
  }

  const isOnTarget = data.approvalRate >= data.targetRate
  const difference = data.approvalRate - data.targetRate

  return (
    <Card className="card-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CreditCard className="w-4 h-4 text-primary" />
            Cold Traffic Payments
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs ${isOnTarget ? "bg-success/10 text-success border-success/20" : "bg-coral/10 text-coral border-coral/20"}`}
          >
            <Target className="w-3 h-3 mr-1" />
            Target: {data.targetRate}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Approval Rate - Main Focus */}
          <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Approval Rate</span>
              {isOnTarget ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-coral" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${isOnTarget ? "text-success" : "text-coral"}`}>
                {data.approvalRate.toFixed(1)}%
              </p>
              <span className={`text-sm ${difference >= 0 ? "text-success" : "text-coral"}`}>
                {difference >= 0 ? "+" : ""}
                {difference.toFixed(1)}% vs target
              </span>
            </div>

            {/* Progress bar with target marker */}
            <div className="mt-3 relative">
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isOnTarget ? "bg-success" : "bg-coral"}`}
                  style={{ width: `${Math.min(data.approvalRate, 100)}%` }}
                />
              </div>
              {/* Target line */}
              <div className="absolute top-0 w-0.5 h-3 bg-foreground/60" style={{ left: `${data.targetRate}%` }} />
            </div>
          </div>

          {/* Payment Counts */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded bg-muted/10">
              <p className="text-lg font-semibold text-foreground">{data.totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Attempts</p>
            </div>
            <div className="text-center p-2 rounded bg-success/10">
              <p className="text-lg font-semibold text-success">{data.approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div className="text-center p-2 rounded bg-coral/10">
              <p className="text-lg font-semibold text-coral">{data.failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>

          {/* Revenue Impact */}
          <div className="flex justify-between text-xs pt-2 border-t border-border/30">
            <span className="text-muted-foreground">
              Processed: <span className="text-success font-medium">${data.revenueProcessed.toLocaleString()}</span>
            </span>
            <span className="text-muted-foreground">
              Lost: <span className="text-coral font-medium">${data.revenueFailed.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// MRR/Rebills: Target 80%+ approval rate
export function FailedPaymentsMRR() {
  const data: PaymentData = {
    totalAttempts: 412,
    approved: 347,
    failed: 65,
    approvalRate: 84.2,
    targetRate: 80,
    revenueProcessed: 12492,
    revenueFailed: 2340,
  }

  const isOnTarget = data.approvalRate >= data.targetRate
  const difference = data.approvalRate - data.targetRate

  return (
    <Card className="card-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="w-4 h-4 text-warning" />
            Rebill Payments (MRR)
          </CardTitle>
          <Badge
            variant="outline"
            className={`text-xs ${isOnTarget ? "bg-success/10 text-success border-success/20" : "bg-coral/10 text-coral border-coral/20"}`}
          >
            <Target className="w-3 h-3 mr-1" />
            Target: {data.targetRate}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Approval Rate - Main Focus */}
          <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Approval Rate</span>
              {isOnTarget ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-coral" />
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold ${isOnTarget ? "text-success" : "text-coral"}`}>
                {data.approvalRate.toFixed(1)}%
              </p>
              <span className={`text-sm ${difference >= 0 ? "text-success" : "text-coral"}`}>
                {difference >= 0 ? "+" : ""}
                {difference.toFixed(1)}% vs target
              </span>
            </div>

            {/* Progress bar with target marker */}
            <div className="mt-3 relative">
              <div className="h-3 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${isOnTarget ? "bg-success" : "bg-coral"}`}
                  style={{ width: `${Math.min(data.approvalRate, 100)}%` }}
                />
              </div>
              {/* Target line */}
              <div className="absolute top-0 w-0.5 h-3 bg-foreground/60" style={{ left: `${data.targetRate}%` }} />
            </div>
          </div>

          {/* Payment Counts */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded bg-muted/10">
              <p className="text-lg font-semibold text-foreground">{data.totalAttempts}</p>
              <p className="text-xs text-muted-foreground">Rebills</p>
            </div>
            <div className="text-center p-2 rounded bg-success/10">
              <p className="text-lg font-semibold text-success">{data.approved}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div className="text-center p-2 rounded bg-coral/10">
              <p className="text-lg font-semibold text-coral">{data.failed}</p>
              <p className="text-xs text-muted-foreground">Failed</p>
            </div>
          </div>

          {/* Revenue Impact */}
          <div className="flex justify-between text-xs pt-2 border-t border-border/30">
            <span className="text-muted-foreground">
              Processed: <span className="text-success font-medium">${data.revenueProcessed.toLocaleString()}</span>
            </span>
            <span className="text-muted-foreground">
              Lost: <span className="text-coral font-medium">${data.revenueFailed.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
