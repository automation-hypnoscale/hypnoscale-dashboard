"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Monitor, Calendar, TrendingDown, DollarSign } from "lucide-react"
import { AIDailyInsight } from "@/components/ai-daily-insight"

// Team members data
const teamMembers = [
  { name: "John - Media Buyer", role: "Media Buyer", dailyCost: 120, monthlyCost: 2640, status: "active" },
  { name: "Sarah - VA", role: "Virtual Assistant", dailyCost: 45, monthlyCost: 990, status: "active" },
  { name: "Mike - Designer", role: "Creative Designer", dailyCost: 80, monthlyCost: 1760, status: "active" },
  { name: "Ana - Support", role: "Customer Support", dailyCost: 35, monthlyCost: 770, status: "active" },
  { name: "Tom - Developer", role: "Developer", dailyCost: 150, monthlyCost: 3300, status: "part-time" },
]

// Services/Software data
const services = [
  { name: "Shopify", category: "Platform", dailyCost: 3, monthlyCost: 89, billing: "Monthly" },
  { name: "Klaviyo", category: "Email Marketing", dailyCost: 17, monthlyCost: 500, billing: "Monthly" },
  { name: "Triple Whale", category: "Analytics", dailyCost: 10, monthlyCost: 300, billing: "Monthly" },
  { name: "Notion", category: "Productivity", dailyCost: 1, monthlyCost: 30, billing: "Monthly" },
  { name: "Slack", category: "Communication", dailyCost: 0.5, monthlyCost: 15, billing: "Monthly" },
  { name: "Figma", category: "Design", dailyCost: 2, monthlyCost: 60, billing: "Monthly" },
  { name: "ChatGPT Plus", category: "AI Tools", dailyCost: 0.7, monthlyCost: 20, billing: "Monthly" },
  { name: "Zapier", category: "Automation", dailyCost: 3, monthlyCost: 89, billing: "Monthly" },
]

export function TeamDashboard() {
  const totalTeamDaily = teamMembers.reduce((sum, m) => sum + m.dailyCost, 0)
  const totalTeamMonthly = teamMembers.reduce((sum, m) => sum + m.monthlyCost, 0)
  const totalServicesDaily = services.reduce((sum, s) => sum + s.dailyCost, 0)
  const totalServicesMonthly = services.reduce((sum, s) => sum + s.monthlyCost, 0)
  const totalDailyBurn = totalTeamDaily + totalServicesDaily
  const totalMonthlyBurn = totalTeamMonthly + totalServicesMonthly

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team & Services</h1>
          <p className="text-sm text-gray-600">Daily operational costs tracking</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-2 border-gray-900 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-xs text-gray-600 uppercase tracking-wider">Team Daily</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalTeamDaily}</p>
            <p className="text-xs text-gray-500">${totalTeamMonthly}/mo</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-900 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-gray-600 uppercase tracking-wider">Services Daily</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${totalServicesDaily.toFixed(0)}</p>
            <p className="text-xs text-gray-500">${totalServicesMonthly}/mo</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-900 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-coral" />
              <span className="text-xs text-gray-600 uppercase tracking-wider">Total Daily Burn</span>
            </div>
            <p className="text-2xl font-bold text-coral">${totalDailyBurn.toFixed(0)}</p>
            <p className="text-xs text-gray-500">${totalMonthlyBurn}/mo</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-gray-900 bg-white">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-success" />
              <span className="text-xs text-gray-600 uppercase tracking-wider">This Month</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${(totalDailyBurn * 13).toFixed(0)}</p>
            <p className="text-xs text-gray-500">13 days so far</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Members */}
      <Card className="border-2 border-gray-900 bg-white">
        <CardHeader className="pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <CardTitle className="text-base font-semibold text-gray-900">Team Members</CardTitle>
            <span className="ml-auto text-sm font-semibold text-purple-600">${totalTeamDaily}/day</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Role</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Daily</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Monthly</th>
                <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-900">{member.name}</td>
                  <td className="p-3 text-gray-600">{member.role}</td>
                  <td className="p-3 text-right font-semibold text-gray-900">${member.dailyCost}</td>
                  <td className="p-3 text-right text-gray-600">${member.monthlyCost}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.status === "active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Services/Software */}
      <Card className="border-2 border-gray-900 bg-white">
        <CardHeader className="pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-blue-500" />
            <CardTitle className="text-base font-semibold text-gray-900">Software & Services</CardTitle>
            <span className="ml-auto text-sm font-semibold text-blue-600">${totalServicesDaily.toFixed(0)}/day</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Service</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Category</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Daily</th>
                <th className="text-right text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">Monthly</th>
                <th className="text-center text-xs font-semibold text-gray-600 uppercase tracking-wider p-3">
                  Billing
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-900">{service.name}</td>
                  <td className="p-3 text-gray-600">{service.category}</td>
                  <td className="p-3 text-right font-semibold text-gray-900">${service.dailyCost.toFixed(2)}</td>
                  <td className="p-3 text-right text-gray-600">${service.monthlyCost}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {service.billing}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Cost Breakdown Visual */}
      <Card className="border-2 border-gray-900 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-600" />
            <CardTitle className="text-base font-semibold text-gray-900">Daily Burn Breakdown</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Team Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Team Costs</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${totalTeamDaily}/day ({((totalTeamDaily / totalDailyBurn) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(totalTeamDaily / totalDailyBurn) * 100}%` }}
                />
              </div>
            </div>

            {/* Services Bar */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Services & Software</span>
                <span className="text-sm font-semibold text-gray-900">
                  ${totalServicesDaily.toFixed(0)}/day ({((totalServicesDaily / totalDailyBurn) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${(totalServicesDaily / totalDailyBurn) * 100}%` }}
                />
              </div>
            </div>

            {/* Total */}
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm font-semibold text-gray-900">Total Daily Burn</span>
                <span className="text-lg font-bold text-coral">${totalDailyBurn.toFixed(0)}/day</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Projected monthly: ${totalMonthlyBurn.toLocaleString()} | Projected yearly: $
                {(totalMonthlyBurn * 12).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Daily Insight */}
      <AIDailyInsight type="team" />
    </div>
  )
}
