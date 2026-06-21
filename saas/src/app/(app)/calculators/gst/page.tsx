'use client'

import { useState, useMemo } from 'react'
import { Percent, ArrowDown, ArrowUp, Info } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const PRESETS = [
  { label: 'AU GST (10%)', rate: 10 },
  { label: 'UK VAT (20%)', rate: 20 },
  { label: 'EU VAT (21%)', rate: 21 },
  { label: 'US Sales (8%)', rate: 8 },
  { label: 'CA HST (13%)', rate: 13 },
  { label: 'Custom', rate: null },
]

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState(1000)
  const [rate, setRate] = useState(10)
  const [preset, setPreset] = useState('AU GST (10%)')
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive')

  const result = useMemo(() => {
    if (mode === 'exclusive') {
      const tax = amount * (rate / 100)
      return { base: amount, tax, total: amount + tax }
    } else {
      const base = amount / (1 + rate / 100)
      const tax = amount - base
      return { base, tax, total: amount }
    }
  }, [amount, rate, mode])

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setPreset(p.label)
    if (p.rate !== null) setRate(p.rate)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
          <Percent className="w-5 h-5 text-zeno-blue" />
        </div>
        <div>
          <h2 className="text-title text-[var(--text)]">GST / Tax Calculator</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Add or remove GST/VAT from any amount.
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        {(['exclusive', 'inclusive'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${
              mode === m
                ? 'bg-zeno-blue text-white border-zeno-blue'
                : 'bg-[var(--elevated)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--border)]'
            }`}
          >
            {m === 'exclusive' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            {m === 'exclusive' ? 'Add tax (excl. GST)' : 'Remove tax (incl. GST)'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface p-6 space-y-5">
          <div>
            <label className="field-label">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">$</span>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="field-input pl-7 font-number"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {mode === 'exclusive'
                ? 'Amount before tax (ex-GST)'
                : 'Amount including tax (inc-GST)'}
            </p>
          </div>

          <div>
            <label className="field-label">Tax Preset</label>
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => applyPreset(p)}
                  className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${
                    preset === p.label
                      ? 'bg-zeno-blue/10 border-zeno-blue/30 text-zeno-blue'
                      : 'bg-[var(--elevated)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="field-label">Tax Rate</label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={rate}
                onChange={(e) => {
                  setRate(Number(e.target.value))
                  setPreset('Custom')
                }}
                className="field-input pr-10 font-number"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Visual breakdown */}
          <div className="surface p-6 space-y-4">
            <p className="text-sm font-semibold text-[var(--text)]">Result</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-secondary)]">
                  Base amount {mode === 'inclusive' ? '(ex-tax)' : ''}
                </span>
                <span className="font-number font-semibold text-[var(--text)]">
                  {formatCurrency(result.base)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[var(--border-subtle)]">
                <span className="text-sm text-[var(--text-secondary)]">
                  {rate}% Tax
                </span>
                <span className="font-number font-semibold text-zeno-amber">
                  +{formatCurrency(result.tax)}
                </span>
              </div>
              <div className="flex items-center justify-between py-4 rounded-xl bg-zeno-blue/5 px-3">
                <span className="font-semibold text-[var(--text)]">
                  Total {mode === 'exclusive' ? '(inc. tax)' : ''}
                </span>
                <span className="font-number font-bold text-zeno-blue text-2xl">
                  {formatCurrency(result.total)}
                </span>
              </div>
            </div>

            {/* Bar visualization */}
            <div>
              <div className="h-3 rounded-full bg-[var(--elevated)] overflow-hidden flex">
                <div
                  className="bg-zeno-blue h-full transition-all duration-500"
                  style={{ width: `${(result.base / result.total) * 100}%` }}
                />
                <div
                  className="bg-zeno-amber h-full transition-all duration-500"
                  style={{ width: `${(result.tax / result.total) * 100}%` }}
                />
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-[var(--text-muted)]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zeno-blue inline-block" /> Base
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-zeno-amber inline-block" /> Tax ({((result.tax / result.total) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-sm text-[var(--text-secondary)]">
            <Info className="w-4 h-4 text-zeno-blue mt-0.5 flex-shrink-0" />
            <p>
              Always check your local tax authority for current rates. Rates shown are for
              reference only.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
