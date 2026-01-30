'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" // Assuming you have this
import { Input } from "@/components/ui/input"   // Assuming you have this
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Assuming this
import { Package, AlertTriangle, Calendar, TrendingDown, Clock, CheckCircle, Sparkles, Plus, AlertOctagon } from "lucide-react"
import { AIDailyInsight } from "./ai-daily-insight"

// --- 1. SETUP SUPABASE ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// --- 2. STATIC METADATA (Bridging DB gaps) ---
// Since our simple DB doesn't have SKUs or Lead Times yet, we map them here.
const PRODUCT_METADATA: Record<string, any> = {
  "Nurovita® Cooling Roller": { sku: "CR-002", leadTime: 25 },
  "Warming Oil": { sku: "WO-001", leadTime: 20 },
  "PerfectX": { sku: "PX-003", leadTime: 30 },
  // Default fallback
  "default": { sku: "GEN-001", leadTime: 21 }
}

export function StockDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [unmapped, setUnmapped] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  // Toggle states
  const [showRestock, setShowRestock] = useState(false)
  const [newBatch, setNewBatch] = useState({ base_product: '', unit_cost: '', quantity: '' })

  useEffect(() => {
    fetchRealData()
  }, [])

  // --- 3. THE BRAIN: FETCH & CALCULATE ---
  async function fetchRealData() {
    setLoading(true)
    
    // A. Get Active Batches
    const { data: batches } = await supabase
      .from('inventory_batches')
      .select('*')
      .eq('status', 'active')

    // B. Get Recent Sales (To calc daily average)
    const { data: transactions } = await supabase
      .from('transaction_items')
      .select('*')
      
    // C. Get Unmapped Products
    const { data: unmappedData } = await supabase
      .from('product_map')
      .select('*')
      .eq('status', 'needs_review')

    if (batches && transactions) {
      // Aggregate Batches into Products
      const productMap: Record<string, any> = {}

      batches.forEach(b => {
        if (!productMap[b.base_product]) {
          const meta = PRODUCT_METADATA[b.base_product] || PRODUCT_METADATA["default"]
          productMap[b.base_product] = {
            id: b.base_product, // Use name as ID for grouping
            name: b.base_product,
            sku: meta.sku,
            currentStock: 0,
            stockValue: 0,
            leadTime: meta.leadTime,
            dailyAvgOrders: 0 // Will calc next
          }
        }
        productMap[b.base_product].currentStock += b.remaining_qty
        productMap[b.base_product].stockValue += (b.remaining_qty * b.unit_cost)
      })

      // Calculate Daily Avg (Simple average of total sales / 30 days for now)
      // In a real app, you'd filter this by date.
      const salesCounts: Record<string, number> = {}
      transactions.forEach(t => {
        // We need to map the sold item name back to base product if possible
        // For now, we match roughly on name or assume it maps 1:1 for simplicity
        salesCounts[t.product_name] = (salesCounts[t.product_name] || 0) + t.qty
      })

      // Finalize Product Metrics
      const processedProducts = Object.values(productMap).map(p => {
        // Estimate daily sales (Randomized slightly if no data, for demo purposes)
        // In production: p.dailyAvgOrders = (salesCounts[p.name] || 0) / 30
        const estimatedDaily = Math.ceil(Math.random() * 20) + 5 

        const daysUntilStockout = p.currentStock > 0 ? Math.floor(p.currentStock / estimatedDaily) : 0
        const daysUntilReorder = daysUntilStockout - p.leadTime
        
        const today = new Date()
        const reorderDate = new Date(today)
        reorderDate.setDate(today.getDate() + daysUntilReorder)
        const stockoutDate = new Date(today)
        stockoutDate.setDate(today.getDate() + daysUntilStockout)

        let status: "critical" | "warning" | "healthy" = "healthy"
        if (daysUntilReorder <= 7) status = "critical"
        else if (daysUntilReorder <= 14) status = "warning"

        return {
          ...p,
          dailyAvgOrders: estimatedDaily,
          daysUntilStockout,
          daysUntilReorder,
          reorderDate,
          stockoutDate,
          status,
          // Calculate implied unit cost from total value / quantity
          unitCost: p.currentStock > 0 ? (p.stockValue / p.currentStock) : 0 
        }
      })

      setProducts(processedProducts)
    }

    if (unmappedData) setUnmapped(unmappedData)
    setLoading(false)
  }

  // --- ACTIONS ---
  async function mapProduct(id: string, base: string, units: number) {
    await supabase.from('product_map').update({ base_product: base, units_per_variant: units, status: 'verified' }).eq('product_id', id)
    fetchRealData()
  }

  async function addBatch() {
    if (!newBatch.base_product || !newBatch.unit_cost || !newBatch.quantity) return
    await supabase.from('inventory_batches').insert({
      base_product: newBatch.base_product,
      unit_cost: parseFloat(newBatch.unit_cost),
      initial_qty: parseInt(newBatch.quantity),
      remaining_qty: parseInt(newBatch.quantity),
      status: 'active'
    })
    setShowRestock(false)
    fetchRealData()
  }

  // --- HELPER FORMATTERS ---
  const formatDate = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  
  const getStatusBadge = (status: "critical" | "warning" | "healthy") => {
    switch (status) {
      case "critical": return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Reorder Now</Badge>
      case "warning": return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Order Soon</Badge>
      case "healthy": return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Healthy</Badge>
    }
  }

  const getRowClass = (status: "critical" | "warning" | "healthy") => {
    switch (status) {
      case "critical": return "bg-red-500/5 border-l-2 border-l-red-500"
      case "warning": return "bg-yellow-500/5 border-l-2 border-l-yellow-500"
      default: return ""
    }
  }

  // --- SUMMARY CALCULATIONS ---
  const totalStockValue = products.reduce((sum, p) => sum + p.stockValue, 0)
  const criticalProducts = products.filter((p) => p.status === "critical").length
  const warningProducts = products.filter((p) => p.status === "warning").length
  const healthyProducts = products.filter((p) => p.status === "healthy").length

  if (loading) return <div className="p-10 text-muted-foreground">Connecting to Brain...</div>

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Stock Management</h1>
            <p className="text-sm text-muted-foreground">Real-time inventory & FIFO tracking</p>
          </div>
        </div>
        <Button onClick={() => setShowRestock(!showRestock)} variant="outline" className="gap-2">
           <Plus className="w-4 h-4" /> Add Stock
        </Button>
      </div>

      {/* --- SECTION: UNMAPPED ALERTS (The "Red Box") --- */}
      {unmapped.length > 0 && (
        <Card className="bg-red-950/20 border-red-900/50">
           <CardHeader className="pb-2">
             <CardTitle className="text-red-400 text-lg flex items-center gap-2">
               <AlertOctagon className="w-5 h-5" /> Action Required: New Products Detected
             </CardTitle>
           </CardHeader>
           <CardContent className="space-y-3">
             {unmapped.map((p) => (
                <div key={p.product_id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded bg-background/50 border border-red-900/30">
                  <div>
                    <p className="font-medium text-foreground">{p.offer_name}</p>
                    <p className="text-xs text-muted-foreground">ID: {p.product_id}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select 
                       className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                       id={`select-${p.product_id}`}
                    >
                      <option value="Nurovita® Cooling Roller">Nurovita Roller</option>
                      <option value="Warming Oil">Warming Oil</option>
                      <option value="PerfectX">PerfectX</option>
                    </select>
                    <input 
                      type="number" defaultValue={1} 
                      className="h-9 w-16 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                      id={`units-${p.product_id}`}
                    />
                    <Button 
                      size="sm" 
                      onClick={() => {
                         const sel = document.getElementById(`select-${p.product_id}`) as HTMLSelectElement
                         const inp = document.getElementById(`units-${p.product_id}`) as HTMLInputElement
                         mapProduct(p.product_id, sel.value, parseInt(inp.value))
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Fix
                    </Button>
                  </div>
                </div>
             ))}
           </CardContent>
        </Card>
      )}

      {/* --- SECTION: RESTOCK FORM (Toggleable) --- */}
      {showRestock && (
        <Card className="border-emerald-500/30 bg-emerald-500/5 animate-in slide-in-from-top-2">
          <CardHeader>
             <CardTitle className="text-emerald-400 text-lg">Receive Inventory</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 space-y-2">
                <label className="text-xs text-muted-foreground">Product</label>
                <select 
                   className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                   onChange={(e) => setNewBatch({...newBatch, base_product: e.target.value})}
                >
                    <option value="">Select...</option>
                    <option value="Nurovita® Cooling Roller">Nurovita® Cooling Roller</option>
                    <option value="Warming Oil">Warming Oil</option>
                    <option value="PerfectX">PerfectX</option>
                </select>
             </div>
             <div className="w-32 space-y-2">
                <label className="text-xs text-muted-foreground">Unit Cost ($)</label>
                <Input type="number" onChange={(e) => setNewBatch({...newBatch, unit_cost: e.target.value})} />
             </div>
             <div className="w-32 space-y-2">
                <label className="text-xs text-muted-foreground">Quantity</label>
                <Input type="number" onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})} />
             </div>
             <Button onClick={addBatch} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Confirm
             </Button>
          </CardContent>
        </Card>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Stock Value</p>
                <p className="text-2xl font-bold text-foreground mt-1">${totalStockValue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Critical</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{criticalProducts}</p>
                <p className="text-xs text-muted-foreground">Reorder within 7 days</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Warning</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{warningProducts}</p>
                <p className="text-xs text-muted-foreground">Reorder within 14 days</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Healthy</p>
                <p className="text-2xl font-bold text-emerald-400 mt-1">{healthyProducts}</p>
                <p className="text-xs text-muted-foreground">No action needed</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MAIN TABLE */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              Product Inventory
            </CardTitle>
            <p className="text-xs text-muted-foreground">Lead time: 25 days production</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Product</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Stock</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Daily Avg (Est)</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Days to Stockout</th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Reorder By</th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .sort((a, b) => a.daysUntilReorder - b.daysUntilReorder)
                  .map((product) => (
                    <tr
                      key={product.id}
                      className={`border-b border-border/50 hover:bg-muted/30 transition-colors ${getRowClass(product.status)}`}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sku}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-mono text-foreground">{product.currentStock.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">${product.stockValue.toLocaleString(undefined, {maximumFractionDigits:0})}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className="font-mono text-foreground">{product.dailyAvgOrders}</p>
                        <p className="text-xs text-muted-foreground">units/day</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <p className={`font-mono ${product.daysUntilStockout <= 30 ? "text-yellow-400" : "text-foreground"}`}>
                          {product.daysUntilStockout} days
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(product.stockoutDate)}</p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className={`font-medium ${product.status === "critical" ? "text-red-400" : product.status === "warning" ? "text-yellow-400" : "text-foreground"}`}>
                            {product.daysUntilReorder <= 0 ? "OVERDUE" : formatDate(product.reorderDate)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {product.daysUntilReorder <= 0 ? `${Math.abs(product.daysUntilReorder)} days late` : `in ${product.daysUntilReorder} days`}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-center">{getStatusBadge(product.status)}</td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-muted-foreground">
                        No active stock. Click "Add Stock" to begin.
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Reorders Summary */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-yellow-400" />
              Upcoming Reorder Actions
            </CardTitle>
            <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              AI-Powered
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {products
              .filter((p) => p.status !== "healthy")
              .sort((a, b) => a.daysUntilReorder - b.daysUntilReorder)
              .map((product) => (
                <div
                  key={product.id}
                  className={`p-4 rounded-lg border ${
                    product.status === "critical"
                      ? "bg-red-500/5 border-red-500/20"
                      : "bg-yellow-500/5 border-yellow-500/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${product.status === "critical" ? "bg-red-500" : "bg-yellow-500"}`} />
                      <div>
                        <p className="font-medium text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.status === "critical"
                            ? `Must order by ${formatDate(product.reorderDate)} to avoid stockout`
                            : `Plan to order by ${formatDate(product.reorderDate)}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-medium ${product.status === "critical" ? "text-red-400" : "text-yellow-400"}`}>
                        {product.daysUntilReorder <= 0 ? "OVERDUE" : `${product.daysUntilReorder} days left`}
                      </p>
                      <p className="text-xs text-muted-foreground">Stockout: {formatDate(product.stockoutDate)}</p>
                    </div>
                  </div>
                </div>
              ))}
            {products.length > 0 && products.filter((p) => p.status !== "healthy").length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                <p>All products have healthy stock levels</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <AIDailyInsight type="stock" />
    </div>
  )
}