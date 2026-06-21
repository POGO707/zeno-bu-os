'use client'

import { useState, useMemo } from 'react'
import { DollarSign, Info, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

function InputField({
  label, value, onChange, prefix, suffix, hint,
}: {
  label: string
  value: number | string
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  hint?: string
}) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm font-medium">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`field-input font-number ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm font-medium">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-[var(--text-muted)] mt-1">{hint}</p>}
    </div>
  )
}

function ResultRow({ label, value, highlight, description }: {
  label: string; value: string; highlight?: boolean; description?: string
}) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-[var(--border-subtle)] last:border-0 ${highlight ? 'rounded-lg px-3 bg-zeno-blue/5' : ''}`}>
      <div>
        <p className={`text-sm font-medium ${highlight ? 'text-[var(--text)]' : 'text-[var(--text-secondary)]'}`}>
          {label}
        </p>
        {description && <p className="text-xs text-[var(--text-muted)]">{description}</p>}
      </div>
      <span className={`font-number font-bold ${highlight ? 'text-zeno-blue text-xl' : 'text-[var(--text)] text-base'}`}>
        {value}
      </span>
    </div>
  )
}

export default function ProfitCalculatorPage() {
  const [revenue, setRevenue] = useState(10000)
  const [cogs, setCogs] = useState(4000)
  const [expenses, setExpenses] = useState(2000)
  const [tax, setTax] = useState(25)

  const results = useMemo(() => {
    const grossProfit = revenue - cogs
    const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : 0
    const ebitda = grossProfit - expenses
    const taxAmount = Math.max(0, ebitda * (tax / 100))
    const netProfit = ebitda - taxAmount
    const netMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0
    const breakEven = ebitda <= 0 ? null : cogs + expenses
    return { grossProfit, grossMargin, ebitda, taxAmount, netProfit, netMargin, breakEven }
  }, [revenue, cogs, expenses, tax])

  const marginColor =
    results.netMargin >= 20
      ? 'text-zeno-green'
      : results.netMargin >= 10
        ? 'text-zeno-amber'
        : 'text-zeno-red'

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-zeno-green" />
        </div>
        <div>
          <h2 className="text-title text-[var(--text)]">Profit Margin Calculator</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Know exactly what you keep from every dollar of revenue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface p-6 space-y-5">
          <p className="text-sm font-semibold text-[var(--text)] mb-1">Your Numbers</p>
          <InputField label="Total Revenue" value={revenue} onChange={setRevenue} prefix="$" hint="Total sales / income before deductions" />
          <InputField label="Cost of Goods Sold (COGS)" value={cogs} onChange={setCogs} prefix="$" hint="Direct costs to produce your product/service" />
          <InputField label="Operating Expenses" value={expenses} onChange={setExpenses} prefix="$" hint="Rent, salaries, software, marketing, etc." />
          <InputField label="Tax Rate" value={tax} onChange={setTax} suffix="%" hint="Income/corporate tax rate applied to profit" />
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Net margin hero */}
          <div className="surface p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
              Net Profit Margin
            </p>
            <div className={`text-6xl font-bold font-number ${marginColor} mb-2`}>
              {results.netMargin.toFixed(1)}%
            </div>
            <div className="flex items-center justify-center gap-1.5 text-sm text-[var(--text-secondary)]">
              <TrendingUp className="w-4 h-4" />
              {results.netMargin >= 20
                ? 'Excellent margin — above industry average'
                : results.netMargin >= 10
                  ? 'Good margin — room to optimize'
                  : 'Low margin — review cost structure'}
            </div>
          </div>

          {/* Breakdown */}
          <div className="surface p-5">
            <p className="text-sm font-semibold text-[var(--text)] mb-1">Full Breakdown</p>
            <div className="mt-3">
              <ResultRow label="Revenue" value={formatCurrency(revenue)} />
              <ResultRow label="Cost of Goods" value={`−${formatCurrency(cogs)}`} />
              <ResultRow label="Gross Profit" value={formatCurrency(results.grossProfit)} description={`${results.grossMargin.toFixed(1)}% gross margin`} />
              <ResultRow label="Operating Expenses" value={`−${formatCurrency(expenses)}`} />
              <ResultRow label="EBITDA" value={formatCurrency(results.ebitda)} description="Earnings before tax" />
              <ResultRow label="Tax" value={`−${formatCurrency(results.taxAmount)}`} description={`${tax}% rate`} />
              <ResultRow label="Net Profit" value={formatCurrency(results.netProfit)} highlight />
            </div>
          </div>

          {/* Info tips */}
          <div className="flex gap-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-sm text-[var(--text-secondary)]">
            <Info className="w-4 h-4 text-zeno-blue mt-0.5 flex-shrink-0" />
            <p>
              A healthy net profit margin is typically{' '}
              <strong className="text-[var(--text)]">15–25%</strong> for service businesses and{' '}
              <strong className="text-[var(--text)]">5–15%</strong> for product businesses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
