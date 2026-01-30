import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react"

interface GoldenKPICardProps {
  name: string
  status: "flagged" | "on-track"
  target: string
  current: string
  action: string
  subMetrics?: {
    successful: string
    total: string
    rate: string
  }
}

export function GoldenKPICard({ name, status, target, current, action, subMetrics }: GoldenKPICardProps) {
  const isFlagged = status === "flagged"

  return (
    <div
      className={cn(
        "bg-white border-2 border-gray-900 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group relative overflow-hidden",
        isFlagged && "animate-pulse-glow",
      )}
    >
      {isFlagged && (
        <div className="absolute inset-0 bg-gradient-to-br from-coral/5 to-transparent pointer-events-none" />
      )}

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center",
                isFlagged ? "bg-coral/15" : "bg-success/15",
              )}
            >
              {isFlagged ? (
                <AlertTriangle className="w-4 h-4 text-coral" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-success" />
              )}
            </div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
          </div>

          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
              isFlagged
                ? "bg-coral/15 text-coral border border-coral/30"
                : "bg-success/15 text-success border border-success/30",
            )}
          >
            {isFlagged ? "Action Required" : "On Track"}
          </span>
        </div>

        <div className="flex items-center gap-6 mb-4">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Target</p>
            <p className="text-lg font-bold text-gray-900">{target}</p>
          </div>
          <div className="text-gray-600">
            <ArrowRight size={16} />
          </div>
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Current</p>
            <p className={cn("text-lg font-bold", isFlagged ? "text-coral" : "text-success")}>{current}</p>
          </div>
        </div>

        {subMetrics && (
          <div className="mb-3 p-2.5 rounded-lg bg-gray-50 border border-gray-200">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Successful</p>
                <p className="text-sm font-bold text-success">{subMetrics.successful}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Total</p>
                <p className="text-sm font-bold text-gray-900">{subMetrics.total}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Rate</p>
                <p className="text-sm font-bold text-success">{subMetrics.rate}</p>
              </div>
            </div>
          </div>
        )}

        <div
          className={cn(
            "p-3 rounded-xl text-sm",
            isFlagged ? "bg-coral/5 border border-coral/10" : "bg-success/5 border border-success/10",
          )}
        >
          <span className={cn("font-medium mr-1", isFlagged ? "text-coral" : "text-success")}>
            {isFlagged ? "Action:" : "Status:"}
          </span>
          <span className="text-gray-600">{action}</span>
        </div>
      </div>
    </div>
  )
}
