import { Construction, Sparkles } from "lucide-react"

interface ComingSoonPlaceholderProps {
  title: string
  description?: string
}

export function ComingSoonPlaceholder({ title, description }: ComingSoonPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
          <Construction className="w-10 h-10 text-primary/60" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-warning/20 flex items-center justify-center border border-warning/20">
          <Sparkles className="w-3 h-3 text-warning" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-md">
        {description || "This section is under development. New features and insights are coming soon."}
      </p>

      <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
        <div className="w-2 h-2 rounded-full bg-warning animate-pulse" />
        <span className="text-sm text-muted-foreground">Coming Soon</span>
      </div>
    </div>
  )
}
