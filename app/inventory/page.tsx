'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function StockManagementPage() {
  // Data States
  const [products, setProducts] = useState<any[]>([])
  const [unmapped, setUnmapped] = useState<any[]>([])
  const [kpi, setKpi] = useState({ totalValue: 0, lowStock: 0, healthy: 0 })
  const [loading, setLoading] = useState(true)

  // UI States
  const [showRestock, setShowRestock] = useState(false)
  const [newBatch, setNewBatch] = useState({ base_product: 'Nurovita® Cooling Roller', unit_cost: '', quantity: '' })

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    // 1. Get All Active Batches
    const { data: batches } = await supabase.from('inventory_batches').select('*').eq('status', 'active')
    
    // 2. Get Unmapped Products
    const { data: unmappedData } = await supabase.from('product_map').select('*').eq('status', 'needs_review')

    if (batches) {
      // --- AGGREGATION LOGIC (The Magic) ---
      // We turn "Batches" into "Product Summaries"
      const productMap: Record<string, any> = {}
      let totalVal = 0
      let low = 0
      let good = 0

      batches.forEach(b => {
        if (!productMap[b.base_product]) {
          productMap[b.base_product] = { 
            name: b.base_product, 
            totalQty: 0, 
            avgCost: 0, 
            totalValue: 0,
            batchCount: 0 
          }
        }
        
        const prod = productMap[b.base_product]
        prod.totalQty += b.remaining_qty
        prod.totalValue += (b.remaining_qty * b.unit_cost)
        prod.batchCount += 1
        
        // Global KPI math
        totalVal += (b.remaining_qty * b.unit_cost)
      })

      // Finalize averages and status
      const productList = Object.values(productMap).map((p: any) => {
        p.avgCost = p.totalValue / p.totalQty
        p.status = p.totalQty < 100 ? 'Low Stock' : 'Healthy' // Threshold example
        if (p.totalQty < 100) low++; else good++;
        return p
      })

      setProducts(productList)
      setKpi({ totalValue: totalVal, lowStock: low, healthy: good })
    }

    if (unmappedData) setUnmapped(unmappedData)
    setLoading(false)
  }

  // --- ACTIONS ---
  async function addBatch() {
    if (!newBatch.unit_cost || !newBatch.quantity) return alert("Missing info")
    const { error } = await supabase.from('inventory_batches').insert({
      base_product: newBatch.base_product,
      unit_cost: parseFloat(newBatch.unit_cost),
      initial_qty: parseInt(newBatch.quantity),
      remaining_qty: parseInt(newBatch.quantity),
      status: 'active'
    })
    if (!error) {
      alert("Inventory Updated!"); setShowRestock(false); fetchData();
    }
  }

  async function mapProduct(id: string, base: string, units: number) {
    await supabase.from('product_map').update({ base_product: base, units_per_variant: units, status: 'verified' }).eq('product_id', id)
    fetchData()
  }

  if (loading) return <div className="p-10 text-zinc-400">Loading Dashboard...</div>

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      
      {/* HEADER & ACTIONS */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Stock Management</h1>
          <p className="text-zinc-500 mt-1">Inventory levels and reorder alerts</p>
        </div>
        <button 
          onClick={() => setShowRestock(!showRestock)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2"
        >
          {showRestock ? 'Close Form' : '➕ Add Stock'}
        </button>
      </div>

      {/* --- RESTOCK FORM (Hidden by default) --- */}
      {showRestock && (
        <div className="mb-8 bg-zinc-900 border border-zinc-700 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-semibold text-emerald-400 mb-4">Receive New Shipment</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Product</label>
              <select 
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                onChange={(e) => setNewBatch({...newBatch, base_product: e.target.value})}
              >
                <option value="Nurovita® Cooling Roller">Nurovita® Roller</option>
                <option value="Warming Oil">Warming Oil</option>
                <option value="PerfectX">PerfectX</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Unit Cost ($)</label>
              <input type="number" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                onChange={(e) => setNewBatch({...newBatch, unit_cost: e.target.value})} />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Quantity</label>
              <input type="number" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                onChange={(e) => setNewBatch({...newBatch, quantity: e.target.value})} />
            </div>
            <button onClick={addBatch} className="bg-white text-black font-bold py-2.5 rounded-lg hover:bg-zinc-200">
              Confirm Receipt
            </button>
          </div>
        </div>
      )}

      {/* --- URGENT ALERTS (The "Red Box" Logic) --- */}
      {unmapped.length > 0 && (
        <div className="mb-8 bg-red-950/30 border border-red-900 p-6 rounded-xl">
          <h3 className="text-red-400 font-bold flex items-center gap-2 mb-4">
            ⚠️ Action Required: Unidentified Products Sold
          </h3>
          <div className="space-y-3">
            {unmapped.map((p) => (
              <div key={p.product_id} className="flex flex-wrap gap-4 items-center bg-red-950/20 p-3 rounded border border-red-900/50">
                <span className="font-medium text-white min-w-[200px]">{p.offer_name}</span>
                <span className="text-xs text-red-300 font-mono">{p.product_id}</span>
                
                <div className="flex gap-2 ml-auto">
                  <select id={`b-${p.product_id}`} className="bg-zinc-900 border border-red-900 rounded px-2 py-1 text-sm">
                    <option value="">Map to...</option>
                    <option value="Nurovita® Cooling Roller">Nurovita Roller</option>
                    <option value="Warming Oil">Warming Oil</option>
                    <option value="PerfectX">PerfectX</option>
                  </select>
                  <input id={`u-${p.product_id}`} type="number" defaultValue={1} className="w-16 bg-zinc-900 border border-red-900 rounded px-2 py-1 text-sm" />
                  <button 
                    onClick={() => {
                      const b = (document.getElementById(`b-${p.product_id}`) as HTMLSelectElement).value;
                      const u = parseInt((document.getElementById(`u-${p.product_id}`) as HTMLInputElement).value);
                      if(b) mapProduct(p.product_id, b, u);
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Fix
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs font-bold tracking-wider uppercase">Total Stock Value</p>
          <p className="text-3xl font-bold text-white mt-2">${kpi.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 relative overflow-hidden">
          <div className="absolute right-0 top-0 p-3 opacity-10">⚠️</div>
          <p className="text-zinc-400 text-xs font-bold tracking-wider uppercase">Low Stock Alerts</p>
          <p className="text-3xl font-bold text-orange-400 mt-2">{kpi.lowStock}</p>
          <p className="text-xs text-zinc-500 mt-1">Reorder suggested</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs font-bold tracking-wider uppercase">Healthy Products</p>
          <p className="text-3xl font-bold text-emerald-400 mt-2">{kpi.healthy}</p>
          <p className="text-xs text-zinc-500 mt-1">No action needed</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-xs font-bold tracking-wider uppercase">Active Batches</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{products.reduce((acc, p) => acc + p.batchCount, 0)}</p>
          <p className="text-xs text-zinc-500 mt-1">Across all products</p>
        </div>
      </div>

      {/* --- MAIN INVENTORY TABLE --- */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h3 className="font-semibold text-lg text-white">Product Inventory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-950 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Product Name</th>
                <th className="px-6 py-4 text-right">Current Stock</th>
                <th className="px-6 py-4 text-right">Avg Unit Cost</th>
                <th className="px-6 py-4 text-right">Total Value</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {products.map((p) => (
                <tr key={p.name} className="hover:bg-zinc-800/50 transition">
                  <td className="px-6 py-4 font-medium text-white">{p.name}</td>
                  <td className="px-6 py-4 text-right font-mono text-white">{p.totalQty}</td>
                  <td className="px-6 py-4 text-right font-mono">${p.avgCost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-mono text-emerald-400 font-medium">
                    ${p.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'Healthy' 
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                        : 'bg-orange-950 text-orange-400 border border-orange-900'
                    }`}>
                      {p.status === 'Healthy' ? '● Healthy' : '⚠️ Reorder'}
                    </span>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-600">
                    No inventory found. Add stock to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}