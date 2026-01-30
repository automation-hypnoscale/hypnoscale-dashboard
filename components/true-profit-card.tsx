import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, CheckCircle } from "lucide-react"

interface TrueProfitCardProps {
  revenue: number
  totalCosts: number
  profit: number
  margin: number
}

export function TrueProfitCard({ revenue, totalCosts, profit, margin }: TrueProfitCardProps) {
  const isHealthy = margin >= 40

  return (
    <Card className="border-2 border-gray-900 bg-gradient-to-br from-success/5 to-success/10">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              {isHealthy ? (
                <CheckCircle className="w-6 h-6 text-success" />
              ) : (
                <TrendingUp className="w-6 h-6 text-warning" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">True Net Profit</p>
              <p className="text-4xl font-bold text-gray-900">${profit.toLocaleString()}</p>
            </div>
          </div>

          <div className="text-right">
            <div className={`text-3xl font-bold ${isHealthy ? "text-success" : "text-warning"}`}>
              {margin.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-500">margin</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Revenue: <span className="font-semibold text-gray-900">${revenue.toLocaleString()}</span>
            </span>
            <span className="text-gray-400">-</span>
            <span className="text-gray-600">
              Total Costs: <span className="font-semibold text-coral">${totalCosts.toLocaleString()}</span>
            </span>
            <span className="text-gray-400">=</span>
            <span className="text-gray-600">
              Profit: <span className="font-semibold text-success">${profit.toLocaleString()}</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
