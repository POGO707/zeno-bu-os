'use client'

import { useState, useMemo } from 'react'
import { Users, Info, TrendingUp } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

export default function FreelancePricingPage() {
  // Income goals
  const [annualIncome, setAnnualIncome] = useState(80000)
  const [workWeeks, setWorkWeeks] = useState(48)
  const [hoursPerWeek, setHoursPerWeek] = useState(40)
  const [billablePercent, setBillablePercent] = useState(70)

  // Expenses
  const [annualExpenses, setAnnualExpenses] = useState(12000)
  const [taxRate, setTaxRate] = useState(25)

  // Buffer
  const [buffer, setBuffer] = useState(20)

  const results = useMemo(() => {
    const totalHoursPerYear = workWeeks * hoursPerWeek
    const billableHours = totalHoursPerYear * (billablePercent / 100)

    const targetGross = annualIncome / (1 - taxRate / 100)
    const totalNeeded = (targetGross + annualExpenses) * (1 + buffer / 100)

    const hourlyRate = billableHours > 0 ? totalNeeded / billableHours : 0
    const dailyRate = hourlyRate * 8
    const weeklyRate = hourlyRate * hoursPerWeek * (billablePercent / 100)
    const monthlyRate = totalNeeded / 12

    return {
      billableHours,
      totalHoursPerYear,
      targetGross,
      totalNeeded,
      hourlyRate,
      dailyRate,
      weeklyRate,
      monthlyRate,
    }
  }, [annualIncome, workWeeks, hoursPerWeek, billablePercent, annualExpenses, taxRate, buffer])

  const rateColor =
    results.hourlyRate >= 150
      ? 'text-zeno-green'
      : results.hourlyRate >= 75
        ? 'text-zeno-blue'
        : 'text-zeno-amber'

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <h2 className="text-title text-[var(--text)]">Freelance Rate Calculator</h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Find your minimum viable rate to hit your income goals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="surface p-6 space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Income Goal
            </p>
            <div className="space-y-4">
              <div>
                <label className="field-label">Target Annual Take-Home</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">$</span>
                  <input type="number" min={0} value={annualIncome} onChange={(e) => setAnnualIncome(Number(e.target.value))} className="field-input pl-7 font-number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Work Weeks/Year</label>
                  <input type="number" min={1} max={52} value={workWeeks} onChange={(e) => setWorkWeeks(Number(e.target.value))} className="field-input font-number" />
                </div>
                <div>
                  <label className="field-label">Hours/Week</label>
                  <input type="number" min={1} max={80} value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="field-input font-number" />
                </div>
              </div>
              <div>
                <label className="field-label">
                  Billable Hours — <span className="text-zeno-blue font-bold">{billablePercent}%</span>
                </label>
                <input
                  type="range"
                  min={20}
                  max={100}
                  step={5}
                  value={billablePercent}
                  onChange={(e) => setBillablePercent(Number(e.target.value))}
                  className="w-full accent-zeno-blue mt-2"
                />
                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1">
                  <span>20%</span><span>{Math.round(results.billableHours)} hrs/yr billable</span><span>100%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[var(--border)] pt-5">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-4">
              Business Costs
            </p>
            <div className="space-y-4">
              <div>
                <label className="field-label">Annual Business Expenses</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">$</span>
                  <input type="number" min={0} value={annualExpenses} onChange={(e) => setAnnualExpenses(Number(e.target.value))} className="field-input pl-7 font-number" />
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-1">Software, insurance, marketing, equipment</p>
              </div>
              <div>
                <label className="field-label">Tax Rate</label>
                <div className="relative">
                  <input type="number" min={0} max={60} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="field-input pr-10 font-number" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">%</span>
                </div>
              </div>
              <div>
                <label className="field-label">
                  Safety Buffer — <span className="text-zeno-amber font-bold">{buffer}%</span>
                </label>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={5}
                  value={buffer}
                  onChange={(e) => setBuffer(Number(e.target.value))}
                  className="w-full accent-zeno-amber mt-2"
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Extra buffer for slow periods & unexpected costs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {/* Hourly hero */}
          <div className="surface p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">
              Minimum Hourly Rate
            </p>
            <div className={`text-6xl font-bold font-number ${rateColor} mb-2`}>
              {formatCurrency(results.hourlyRate)}
            </div>
            <p className="text-sm text-[var(--text-secondary)] flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Per billable hour
            </p>
          </div>

          {/* Rate breakdown */}
          <div className="surface p-5 space-y-1">
            <p className="text-sm font-semibold text-[var(--text)] mb-3">Rate Breakdown</p>
            {[
              { label: 'Daily Rate (8h)', value: formatCurrency(results.dailyRate) },
              { label: 'Weekly Rate', value: formatCurrency(results.weeklyRate) },
              { label: 'Monthly Rate', value: formatCurrency(results.monthlyRate) },
              { label: 'Annual Revenue Needed', value: formatCurrency(results.totalNeeded) },
              { label: 'Billable Hours/Year', value: `${Math.round(results.billableHours)} hrs` },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-2.5 border-b border-[var(--border-subtle)] last:border-0">
                <span className="text-sm text-[var(--text-secondary)]">{row.label}</span>
                <span className="font-number font-semibold text-[var(--text)]">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-2 p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 text-sm text-[var(--text-secondary)]">
            <Info className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <p>
              This is your <strong className="text-[var(--text)]">minimum rate</strong>. Market
              rates, experience, and specialization should push your actual rate higher.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
