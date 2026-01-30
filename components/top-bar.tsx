import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Share2, Bell, Settings } from "lucide-react"

export function TopBar() {
  return (
    <header className="h-16 border-b-2 border-gray-900 bg-white/95 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-4 md:px-8">
      <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
        <span>Dashboard</span>
        <span>/</span>
        <span className="text-gray-900 font-medium">Profit Overview</span>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <Bell size={18} strokeWidth={1.5} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral rounded-full" />
        </button>

        <button className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
          <Settings size={18} strokeWidth={1.5} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-2 border-gray-900 text-gray-900 hover:bg-gray-100 bg-white h-9"
        >
          <Share2 size={15} strokeWidth={1.5} />
          Share
        </Button>

        <Button
          size="sm"
          className="bg-gradient-to-r from-coral to-coral-muted text-white hover:opacity-90 h-9 shadow-lg transition-all duration-200 hover:scale-[1.02]"
        >
          New Report
        </Button>

        <div className="relative">
          <Avatar className="h-9 w-9 ring-2 ring-gray-900 ring-offset-2 ring-offset-white">
            <AvatarImage src="/diverse-avatars.png" />
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary-muted text-white text-xs font-semibold">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-white" />
        </div>
      </div>
    </header>
  )
}
