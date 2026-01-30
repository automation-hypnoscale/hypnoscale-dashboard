"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Receipt, Repeat, Zap, TrendingUp, TrendingDown } from "lucide-react"

interface ExpenseItem {
  name: string
  amount: number
  trend?: "up" | "down" | "stable"
  trendValue?: string
}

interface ExpenseCategory {
  title: string
  icon: React.ElementType
  color: string
  items: ExpenseItem[]
}

const expenseCategories: ExpenseCategory[] = [
  {
    title: "Fixed Costs",
    icon: Repeat,
    color: "text-primary",
    items: [
      { name: "Warehouse Rent", amount: 4500, trend: "stable" },
      { name: "Salaries & Contractors", amount: 12000, trend: "stable" },
      { name: "Software & Tools", amount: 2400, trend: "up", trendValue: "+$200" },
      { name: "Insurance", amount: 800, trend: "stable" },
    ],
  },
  {
    title: "Variable Costs",
    icon: Zap,
    color: "text-warning",
    items: [
      { name: "Ad Spend", amount: 18432, trend: "down", trendValue: "-8.2%" },
      { name: "COGS (Inventory)", amount: 31211, trend: "stable" },
      { name: "Shipping & Fulfillment", amount: 7200, trend: "up", trendValue: "+$400" },
      { name: "Payment Processing", amount: 3620, trend: "stable" },
    ],
  },
  {
    title: "One-Time Costs",
    icon: Receipt,
    color: "text-coral",
    items: [
      { name: "Equipment (Q4)", amount: 0, trend: "stable" },
      { name: "Legal & Compliance", amount: 1500, trend: "stable" },
      { name: "Marketing (Photoshoot)", amount: 2000, trend: "stable" },
    ],
  },
]

const totalFixed = expenseCategories[0].items.reduce((sum, i) => sum + i.amount, 0)
const totalVariable = expenseCategories[1].items.reduce((sum, i) => sum + i.amount, 0)
const totalOneTime = expenseCategories[2].items.reduce((sum, i) => sum + i.amount, 0)
const grandTotal = totalFixed + totalVariable + totalOneTime

export function ExpenseBreakdown() {
  return (
    <Card className="card-premium">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Receipt className="w-4 h-4 text-coral" />
            Expense Breakdown (Monthly)
          </CardTitle>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">${grandTotal.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total expenses</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {expenseCategories.map((category) => {
          const Icon = category.icon
          const categoryTotal = category.items.reduce((sum, i) => sum + i.amount, 0)
          const percentage = ((categoryTotal / grandTotal) * 100).toFixed(0)

          return (
            <div key={category.title} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${category.color}`} />
                  <span className="text-sm font-medium text-foreground">{category.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">${categoryTotal.toLocaleString()}</span>
                  <Badge variant="outline" className="text-xs bg-secondary/50 text-muted-foreground border-border">
                    {percentage}%
                  </Badge>
                </div>
              </div>

              <div className="space-y-1 pl-6">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground">${item.amount.toLocaleString()}</span>
                      {item.trend === "up" && item.trendValue && (
                        <span className="text-xs text-coral flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          {item.trendValue}
                        </span>
                      )}
                      {item.trend === "down" && item.trendValue && (
                        <span className="text-xs text-success flex items-center gap-0.5">
                          <TrendingDown className="w-3 h-3" />
                          {item.trendValue}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {/* Summary bar */}
        <div className="pt-4 border-t border-border">
          <div className="flex h-3 rounded-full overflow-hidden bg-secondary">
            <div
              className="bg-primary"
              style={{ width: `${(totalFixed / grandTotal) * 100}%` }}
              title={`Fixed: $${totalFixed.toLocaleString()}`}
            />
            <div
              className="bg-warning"
              style={{ width: `${(totalVariable / grandTotal) * 100}%` }}
              title={`Variable: $${totalVariable.toLocaleString()}`}
            />
            <div
              className="bg-coral"
              style={{ width: `${(totalOneTime / grandTotal) * 100}%` }}
              title={`One-Time: $${totalOneTime.toLocaleString()}`}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Fixed: {((totalFixed / grandTotal) * 100).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Variable: {((totalVariable / grandTotal) * 100).toFixed(0)}%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-coral" />
              One-Time: {((totalOneTime / grandTotal) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
