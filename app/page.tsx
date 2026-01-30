"use client"

import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { ProfitDashboard } from "@/components/profit-dashboard"
import { CFODashboard } from "@/components/cfo-dashboard"
import { MRRDashboard } from "@/components/mrr-dashboard"
import { StockDashboard } from "@/components/stock-dashboard"
import { TeamDashboard } from "@/components/team-dashboard"
import { useNavigation } from "@/contexts/navigation-context"

export default function Home() {
  const { activeSheet } = useNavigation()

  const renderContent = () => {
    switch (activeSheet) {
      case "Performance":
        return <ProfitDashboard />
      case "CFO":
        return <CFODashboard />
      case "MRR":
        return <MRRDashboard />
      case "Stock":
        return <StockDashboard />
      case "Team":
        return <TeamDashboard />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="lg:ml-[220px]">
        <TopBar />

        <main className="p-6 md:p-8 lg:p-10">{renderContent()}</main>
      </div>
    </div>
  )
}
