'use client'

import { useState, useMemo } from 'react'
import { Truck, Info, Package } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const CARRIERS = [
  { name: 'Standard Post', baseRate: 5.5, perKg: 1.2 },
  { name: 'Express Courier', baseRate: 12, perKg: 2.5 },
  { name: 'Overnight', baseRate: 25, perKg: 4 },
  { name: 'Economy Freight', baseRate: 3, perKg: 0.8 },
]

export default function ShippingCalculatorPage() {
  const [weight, setWeight] = useState(2)
  const [length, setLength] = useState(30)
  const [width, setWidth] = useState(20)
  const [height, setHeight] = useState(15)
  const [packagingCost, setPackagingCost] = useState(2.5)
  const [margin, setMargin] = useState(15)

  const results = useMemo(() => {
    // Volumetric weight (DIM weight): L×W×H / 5000
    const volWeight = (length * width * height) / 5000
    const chargeableWeight = Math.max(weight, volWeight)

    return CARRIERS.map((c) => {
      const shippingCost = c.baseRate + chargeableWeight * c.perKg
      const totalCost = shippingCost + packagingCost
      const suggestedPrice = totalCost * (1 + margin / 100)
      return {
        ...c,
        shippingCost,
        totalCost,
        suggestedPrice,
        profit: suggestedPrice - totalCost,
      }
    })
  }, [weight, length, width, height, packagingCost, margin])

  const volWeight = (length * width * height) / 5000
  const chargeableWeight = Math.max(weight, volWeight)

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
          <Truck className="w-5 h-5 text-zeno-amber" />
        </div>
        <div>
          <h2 className="text-title text-[var(--text)]">Shipping Cost Calculator</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Compare carriers and build your shipping price to cover costs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface p-6 space-y-5">
          <div>
            <p className="text-sm font-semibold text-[var(--text)] mb-4">Package Details</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label">Weight (kg)</label>
                <input type="number" min={0.1} step={0.1} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="field-input font-number" />
              </div>
              <div>
                <label className="field-label">Length (cm)</label>
                <input type="number" min={1} value={length} onChange={(e) => setLength(Number(e.target.value))} className="field-input font-number" />
              </div>
              <div>
                <label className="field-label">Width (cm)</label>
                <input type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="field-input font-number" />
              </div>
              <div>
                <label className="field-label">Height (cm)</label>
                <input type="number" min={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="field-input font-number" />
              </div>
            </div>
          </div>

          <div className="surface-elevated p-4 rounded-xl text-sm space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Actual weight</span>
              <span className="font-number font-semibold text-[var(--text)]">{weight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Volumetric weight</span>
              <span className="font-number font-semibold text-[var(--text)]">{volWeight.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 mt-2">
              <span className="font-medium text-[var(--text)]">Chargeable weight</span>
              <span className="font-number font-bold text-zeno-blue">{chargeableWeight.toFixed(2)} kg</span>
            </div>
          </div>

          <div>
            <label className="field-label">Packaging Cost</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">$</span>
              <input type="number" min={0} step={0.5} value={packagingCost} onChange={(e) => setPackagingCost(Number(e.target.value))} className="field-input pl-7 font-number" />
            </div>
          </div>

          <div>
            <label className="field-label">Your Margin (%)</label>
            <div className="relative">
              <input type="number" min={0} max={200} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="field-input pr-10 font-number" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">%</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">Added to suggest your charged shipping price</p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-[var(--text)] px-1">Carrier Comparison</p>
          {results.map((r) => (
            <div key={r.name} className="surface p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Package className="w-4 h-4 text-zeno-amber" />
                </div>
                <p className="font-semibold text-[var(--text)] text-sm">{r.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="surface-elevated p-3 rounded-lg">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Shipping</p>
                  <p className="font-number font-bold text-[var(--text)] text-base">{formatCurrency(r.shippingCost)}</p>
                </div>
                <div className="surface-elevated p-3 rounded-lg">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Cost</p>
                  <p className="font-number font-bold text-[var(--text)] text-base">{formatCurrency(r.totalCost)}</p>
                </div>
                <div className="surface-elevated p-3 rounded-lg bg-zeno-blue/5">
                  <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Charge</p>
                  <p className="font-number font-bold text-zeno-blue text-base">{formatCurrency(r.suggestedPrice)}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2 p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 text-sm text-[var(--text-secondary)]">
            <Info className="w-4 h-4 text-zeno-amber mt-0.5 flex-shrink-0" />
            <p>
              Volumetric weight is calculated as L×W×H ÷ 5000. Carriers charge whichever is
              higher — actual or volumetric weight.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
