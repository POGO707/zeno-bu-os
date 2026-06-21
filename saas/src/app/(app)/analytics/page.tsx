'use client'

import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react'
import { StatCard } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'

const monthly = [
  { month: 'Jan', revenue: 3200, expenses: 1800, profit: 1400 },
  { month: 'Feb', revenue: 4100, expenses: 2100, profit: 2000 },
  { month: 'Mar', revenue: 3750, expenses: 1950, profit: 1800 },
  { month: 'Apr', revenue: 5200, expenses: 2400, profit: 2800 },
  { month: 'May', revenue: 4800, expenses: 2200, profit: 2600 },
  { month: 'Jun', revenue: 6100, expenses: 2700, profit: 3400 },
  { month: 'Jul', revenue: 5500, expenses: 2500, profit: 3000 },
  { month: 'Aug', revenue: 7200, expenses: 3100, profit: 4100 },
  { month: 'Sep', revenue: 6800, expenses: 2900, profit: 3900 },
  { month: 'Oct', revenue: 8100, expenses: 3400, profit: 4700 },
  { month: 'Nov', revenue: 7600, expenses: 3200, profit: 4400 },
  { month: 'Dec', revenue: 9400, expenses: 3800, profit: 5600 },
]

const topClients = [
  { name: 'Acme Corp', revenue: 12500 },
  { name: 'StartupXYZ', revenue: 8200 },
  { name: 'Global Media', revenue: 7600 },
  { name: 'TechFlow', revenue: 5900 },
  { name: 'NovaBrands', revenue: 4400 },
]

const revenueByCategory = [
  { name: 'Design', value: 34 },
  { name: 'Dev', value: 28 },
  { name: 'Consulting', value: 22 },
  { name: 'Other', value: 16 },
]

const PIE_COLORS = ['#3B6FE8', '#22C55E', '#F59E0B', '#8B5CF6']

const tooltipStyle = {
  contentStyle: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    fontSize: '12px',
    color: 'var(--text)',
  },
}

export default function AnalyticsPage() {
  const totalRevenue = monthly.reduce((s, m) => s + m.revenue, 0)
  const totalProfit = monthly.reduce((s, m) => s + m.profit, 0)
  const avgMargin = ((totalProfit / totalRevenue) * 100).toFixed(1)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Annual Revenue"
          value={formatCurrency(totalRevenue)}
          change={18.3}
          changeLabel="YoY"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="green"
        />
        <StatCard
          label="Annual Profit"
          value={formatCurrency(totalProfit)}
          change={24.1}
          changeLabel="YoY"
          icon={<DollarSign className="w-5 h-5" />}
          accent="blue"
        />
        <StatCard
          label="Avg Margin"
          value={`${avgMargin}%`}
          change={2.8}
          changeLabel="YoY"
          icon={<BarChart3 className="w-5 h-5" />}
          accent="amber"
        />
        <StatCard
          label="Best Month"
          value="Dec"
          icon={<TrendingDown className="w-5 h-5" />}
          accent="red"
        />
      </div>

      {/* Revenue trend chart */}
      <div className="surface p-5">
        <div className="mb-5">
          <p className="font-semibold text-[var(--text)] text-sm">
            Revenue, Expenses & Profit — 2024
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Monthly breakdown for the full year
          </p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={monthly} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
            <defs>
              {[
                { id: 'revGrad', color: '#3B6FE8' },
                { id: 'expGrad', color: '#EF4444' },
                { id: 'profGrad', color: '#22C55E' },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
            <Area type="monotone" dataKey="revenue" stroke="#3B6FE8" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
            <Area type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
            <Area type="monotone" dataKey="profit" stroke="#22C55E" strokeWidth={2} fill="url(#profGrad)" name="Profit" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: bar chart + pie + top clients */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div className="surface p-5 lg:col-span-1">
          <p className="font-semibold text-[var(--text)] text-sm mb-4">
            Monthly Profit
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="profit" fill="#3B6FE8" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="surface p-5">
          <p className="font-semibold text-[var(--text)] text-sm mb-4">
            Revenue by Category
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={revenueByCategory}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {revenueByCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {revenueByCategory.map((cat, i) => (
              <div key={cat.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: PIE_COLORS[i] }}
                />
                <span className="text-xs text-[var(--text-secondary)]">
                  {cat.name} — {cat.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top clients */}
        <div className="surface p-5">
          <p className="font-semibold text-[var(--text)] text-sm mb-4">
            Top Clients by Revenue
          </p>
          <div className="space-y-3">
            {topClients.map((client, i) => {
              const max = topClients[0].revenue
              const pct = (client.revenue / max) * 100
              return (
                <div key={client.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[var(--text-secondary)] font-medium">
                      {client.name}
                    </span>
                    <span className="font-number text-[var(--text)] font-semibold">
                      {formatCurrency(client.revenue)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[var(--elevated)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
