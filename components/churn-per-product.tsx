"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, TrendingUp, Users, AlertTriangle } from "lucide-react"

interface ChurnProductData {
  product: string
  activeSubs: number
  m1Churn: number
  m2Churn: number
  m3Churn: number
  m6Churn: number
  m12Churn: number
  totalLost30d: number
  mrrLost: number
  trend: "up" | "down" | "stable"
}

const churnData: ChurnProductData[] = [
  {
    product: "Neuro Supplement",
    activeSubs: 847,
    m1Churn: 12,
    m2Churn: 18,
    m3Churn: 8,
    m6Churn: 6,
    m12Churn: 4,
    totalLost30d: 34,
    mrrLost: 1224,
    trend: "down",
  },
  {
    product: "Vein Supplement",
    activeSubs: 623,
    m1Churn: 15,
    m2Churn: 22,
    m3Churn: 10,
    m6Churn: 7,
    m12Churn: 5,
    totalLost30d: 31,
    mrrLost: 1085,
    trend: "up",
  },
  {
    product: "Comfort Balm",
    activeSubs: 412,
    m1Churn: 8,
    m2Churn: 12,
    m3Churn: 5,
    m6Churn: 3,
    m12Churn: 2,
    totalLost30d: 12,
    mrrLost: 396,
    trend: "stable",
  },
  {
    product: "Warming Oils",
    activeSubs: 284,
    m1Churn: 10,
    m2Churn: 14,
    m3Churn: 6,
    m6Churn: 4,
    m12Churn: 3,
    totalLost30d: 8,
    mrrLost: 264,
    trend: "down",
  },
  {
    product: "Cooling Roller",
    activeSubs: 156,
    m1Churn: 9,
    m2Churn: 13,
    m3Churn: 5,
    m6Churn: 4,
    m12Churn: 3,
    totalLost30d: 6,
    mrrLost: 198,
    trend: "stable",
  },
]

const totalActiveSubs = churnData.reduce((sum, p) => sum + p.activeSubs, 0)
const totalLost = churnData.reduce((sum, p) => sum + p.totalLost30d, 0)
const totalMRRLost = churnData.reduce((sum, p) => sum + p.mrrLost, 0)

const getChurnColor = (churn: number) => {
  if (churn <= 10) return "text-success"
  if (churn <= 15) return "text-warning"
  return "text-coral"
}

const getChurnBg = (churn: number) => {
  if (churn <= 10) return "bg-success/10"
  if (churn <= 15) return "bg-warning/10"
  return "bg-coral/10"
}

// Performance tab version - operational focus with M1-M12 breakdown
export function ChurnPerProductOperational() {
  const atRiskProducts = churnData.filter((p) => p.m2Churn > 18).length

  return (
    <Card className="card-premium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="w-4 h-4 text-coral" />
            Churn Rate per Product
          </CardTitle>
          <div className="flex items-center gap-3">
            {atRiskProducts > 0 && (
              <Badge variant="outline" className="bg-coral/10 text-coral border-coral/20 text-xs">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {atRiskProducts} high M2 churn
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-8 gap-2 text-xs text-muted-foreground pb-2 border-b border-border px-2">
            <span className="col-span-2">Product</span>
            <span className="text-center">M1</span>
            <span className="text-center">M2</span>
            <span className="text-center">M3</span>
            <span className="text-center">M6</span>
            <span className="text-center">M12</span>
            <span className="text-center">Lost (30d)</span>
          </div>

          {/* Rows */}
          {churnData.map((product) => {
            const hasHighM2 = product.m2Churn > 18
            return (
              <div
                key={product.product}
                className={`grid grid-cols-8 gap-2 py-3 px-2 rounded-lg items-center ${
                  hasHighM2 ? "bg-coral/5 border-l-2 border-l-coral" : "hover:bg-muted/30"
                }`}
              >
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate">{product.product}</span>
                  {product.trend === "up" && <TrendingUp className="w-3 h-3 text-coral flex-shrink-0" />}
                  {product.trend === "down" && <TrendingDown className="w-3 h-3 text-success flex-shrink-0" />}
                </div>
                <div className="flex justify-center">
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${getChurnBg(product.m1Churn)} ${getChurnColor(product.m1Churn)}`}
                  >
                    {product.m1Churn}%
                  </span>
                </div>
                <div className="flex justify-center">
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${getChurnBg(product.m2Churn)} ${getChurnColor(product.m2Churn)}`}
                  >
                    {product.m2Churn}%
                  </span>
                </div>
                <div className="flex justify-center">
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${getChurnBg(product.m3Churn)} ${getChurnColor(product.m3Churn)}`}
                  >
                    {product.m3Churn}%
                  </span>
                </div>
                <div className="flex justify-center">
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${getChurnBg(product.m6Churn)} ${getChurnColor(product.m6Churn)}`}
                  >
                    {product.m6Churn}%
                  </span>
                </div>
                <div className="flex justify-center">
                  <span
                    className={`text-xs font-medium px-1.5 py-0.5 rounded ${getChurnBg(product.m12Churn)} ${getChurnColor(product.m12Churn)}`}
                  >
                    {product.m12Churn}%
                  </span>
                </div>
                <span className="text-sm text-center text-coral font-medium">-{product.totalLost30d}</span>
              </div>
            )
          })}
        </div>

        {/* Footer summary */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Total Active: <span className="text-foreground font-medium">{totalActiveSubs.toLocaleString()}</span>
          </span>
          <span className="text-muted-foreground">
            30d Lost: <span className="text-coral font-medium">-{totalLost}</span>
          </span>
          <span className="text-muted-foreground">
            MRR Lost: <span className="text-coral font-medium">-${totalMRRLost.toLocaleString()}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

// CFO tab version - financial impact focus
export function ChurnPerProductFinancial() {
  return (
    <Card className="card-premium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingDown className="w-4 h-4 text-coral" />
            Churn Revenue Impact
          </CardTitle>
          <div className="text-right">
            <p className="text-lg font-bold text-coral">-${totalMRRLost.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">MRR lost (30d)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 text-xs text-muted-foreground pb-2 border-b border-border">
            <span>Product</span>
            <span className="text-center">Worst Month</span>
            <span className="text-center">MRR Lost</span>
            <span className="text-center">Annualized Loss</span>
          </div>

          {/* Rows sorted by MRR lost */}
          {[...churnData]
            .sort((a, b) => b.mrrLost - a.mrrLost)
            .map((product) => {
              const worstMonth = product.m2Churn >= product.m1Churn ? "M2" : "M1"
              const worstChurn = Math.max(product.m1Churn, product.m2Churn)
              const annualizedLoss = product.mrrLost * 12
              return (
                <div
                  key={product.product}
                  className="grid grid-cols-4 gap-4 py-3 px-3 rounded-lg bg-muted/20 items-center"
                >
                  <span className="text-sm font-medium text-foreground">{product.product}</span>
                  <div className="flex justify-center">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getChurnBg(worstChurn)} ${getChurnColor(worstChurn)} border-transparent`}
                    >
                      {worstMonth}: {worstChurn}%
                    </Badge>
                  </div>
                  <span className="text-sm text-center text-coral font-medium">
                    -${product.mrrLost.toLocaleString()}
                  </span>
                  <span className="text-sm text-center text-muted-foreground">
                    -${annualizedLoss.toLocaleString()}/yr
                  </span>
                </div>
              )
            })}
        </div>

        {/* Footer summary */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Monthly Impact: <span className="text-coral font-medium">-${totalMRRLost.toLocaleString()}</span>
          </span>
          <span className="text-muted-foreground">
            Annual Impact: <span className="text-coral font-medium">-${(totalMRRLost * 12).toLocaleString()}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
