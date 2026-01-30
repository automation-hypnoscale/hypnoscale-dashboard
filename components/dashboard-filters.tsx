"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarDays, Sparkles } from "lucide-react"

export function DashboardFilters() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="date"
          className="w-[160px] pl-9 bg-card border-border text-foreground h-10 rounded-xl"
          placeholder="Start date"
        />
      </div>

      <div className="relative">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="date"
          className="w-[160px] pl-9 bg-card border-border text-foreground h-10 rounded-xl"
          placeholder="End date"
        />
      </div>

      <Button className="bg-gradient-to-r from-primary to-primary-muted text-primary-foreground hover:opacity-90 h-10 px-6 rounded-xl shadow-lg glow-primary transition-all duration-200 hover:scale-[1.02]">
        Apply Filters
      </Button>

      <Button
        variant="outline"
        className="border-coral/30 text-coral hover:bg-coral/10 hover:text-coral bg-transparent h-10 rounded-xl gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Seed Demo Data
      </Button>
    </div>
  )
}
