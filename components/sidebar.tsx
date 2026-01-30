"use client"

import { useState } from "react"
import { BarChart3, DollarSign, Package, TrendingUp, Menu, X, Sparkles, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigation } from "@/contexts/navigation-context"

const navItems = [
  { name: "Performance", icon: BarChart3, href: "#" },
  { name: "CFO", icon: DollarSign, href: "#" },
  { name: "MRR", icon: TrendingUp, href: "#" },
  { name: "Stock", icon: Package, href: "#" },
  { name: "Team", icon: Users, href: "#" },
] as const

export function Sidebar() {
  const { activeSheet, setActiveSheet } = useNavigation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-50 transition-all duration-200 hover:scale-105"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-[220px] bg-white border-r-2 border-gray-900 z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="p-6 border-b-2 border-gray-900">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-muted flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 tracking-tight">HypnoScale</h1>
              <p className="text-xs text-gray-600">Profit Intelligence</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSheet === item.name

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveSheet(item.name as typeof activeSheet)
                  setMobileOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                <span>{item.name}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t-2 border-gray-900">
          <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-coral/10 border border-primary/20">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">Enterprise Plan</p>
                <p className="text-[10px] text-gray-600">AI-powered insights</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
