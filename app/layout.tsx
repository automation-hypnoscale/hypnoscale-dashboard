import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { NavigationProvider } from "@/contexts/navigation-context"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HypnoScale - E-commerce Intelligence Dashboard",
  description: "Revenue, ad spend, COGS, profit/loss, subscriptions, inventory and MRR forecast",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0c1220",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <NavigationProvider>{children}</NavigationProvider>
      </body>
    </html>
  )
}
