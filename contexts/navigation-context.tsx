"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type SheetName = "Performance" | "CFO" | "MRR" | "Stock" | "Team"

interface NavigationContextType {
  activeSheet: SheetName
  setActiveSheet: (sheet: SheetName) => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [activeSheet, setActiveSheet] = useState<SheetName>("Performance")

  const handleSetActiveSheet = useCallback((sheet: SheetName) => {
    setActiveSheet(sheet)
  }, [])

  return (
    <NavigationContext.Provider value={{ activeSheet, setActiveSheet: handleSetActiveSheet }}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}
