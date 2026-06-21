'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ArrowRight,
  Calculator,
  DollarSign,
  FileText,
  Percent,
  TrendingUp,
  Truck,
  Users,
  AlertCircle,
} from 'lucide-react'
import { StatCard } from '@/components/ui/Card'
import { useAppStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'

const revenueData = [
  { month: 'Jan', revenue: 3200, expenses: 1800 },
  { month: 'Feb', revenue: 4100, expenses: 2100 },
  { month: 'Mar', revenue: 3750, expenses: 1950 },
  { month: 'Apr', revenue: 5200, expenses: 2400 },
  { month: 'May', revenue: 4800, expenses: 2200 },
  { month: 'Jun', revenue: 6100, expenses: 2700 },
]

const quickTools = [
  { label: 'Profit Margin', icon: <DollarSign className="w-5 h-5" />, href: '/calculators/profit', color: 'text-zeno-green bg-green-500/10' },
  { label: 'GST / Tax', icon: <Percent className="w-5 h-5" />, href: '/calculators/gst', color: 'text-zeno-blue bg-blue-500/10' },
  { label: 'Shipping', icon: <Truck className="w-5 h-5" />, href: '/calculators/shipping', color: 'text-zeno-amber bg-amber-500/10' },
  { label: 'Freelance Rate', icon: <Users className="w-5 h-5" />, href: '/calculators/pricing', color: 'text-purple-500 bg-purple-500/10' },
  { label: 'Invoices', icon: <FileText className="w-5 h-5" />, href: '/invoices', color: 'text-zeno-red bg-red-500/10' },
  { label: 'All Calculators', icon: <Calculator className="w-5 h-5" />, href: '/calculators', color: 'text-cyan-500 bg-cyan-500/10' },
]

const statusColors: Record<string, string> = {
  paid: 'text-zeno-green bg-green-500/10',
  sent: 'text-zeno-blue bg-blue-500/10',
  draft: 'text-[var(--text-muted)] bg-[var(--elevated)]',
  overdue: 'text-zeno-red bg-red-500/10',
}

export default function DashboardPage() {
  const { invoices } = useAppStore()

  const stats = useMemo(() => {
    const paid = invoices.filter((inv) => inv.status === 'paid')
    const outstanding = invoices.filter(
      (inv) => inv.status === 'sent' || inv.status === 'overdue',
    )

    const calcTotal = (invs: typeof invoices) =>
      invs.reduce((sum, inv) => {
        const subtotal = inv.items.reduce(
          (s, item) => s + item.quantity * item.unitPrice,
          0,
        )
        return sum + subtotal * (1 + inv.taxRate / 100)
      }, 0)

    return {
      paidTotal: calcTotal(paid),
      outstandingTotal: calcTotal(outstanding),
      invoiceCount: invoices.length,
      overdueCount: invoices.filter((inv) => inv.status === 'overdue').length,
    }
  }, [invoices])

  const recentInvoices = invoices.slice(0, 5)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-title text-[var(--text)]">Good morning 👋</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>
        <Link
          href="/invoices"
          className="hidden sm:flex items-center gap-2 bg-zeno-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zeno-blue-hover transition-all duration-150 shadow-sm"
        >
          New Invoice
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Overdue alert */}
      {stats.overdueCount > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/8 border border-red-500/20 text-zeno-red">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">
            You have {stats.overdueCount} overdue invoice{stats.overdueCount > 1 ? 's' : ''}.{' '}
            <Link href="/invoices" className="underline underline-offset-2">
              View invoices →
            </Link>
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.paidTotal)}
          change={12.4}
          changeLabel="vs last month"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="green"
        />
        <StatCard
          label="Outstanding"
          value={formatCurrency(stats.outstandingTotal)}
          change={-3.2}
          changeLabel="vs last month"
          icon={<DollarSign className="w-5 h-5" />}
          accent="amber"
        />
        <StatCard
          label="Total Invoices"
          value={stats.invoiceCount}
          change={8.1}
          changeLabel="vs last month"
          icon={<FileText className="w-5 h-5" />}
          accent="blue"
        />
        <StatCard
          label="Overdue"
          value={stats.overdueCount}
          icon={<AlertCircle className="w-5 h-5" />}
          accent="red"
        />
      </div>

      {/* Revenue chart + quick tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart */}
        <div className="surface p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="font-semibold text-[var(--text)] text-sm">
                Revenue vs Expenses
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Last 6 months
              </p>
            </div>
            <Link
              href="/analytics"
              className="text-xs text-zeno-blue hover:underline font-medium"
            >
              Full analytics →
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B6FE8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3B6FE8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: 'var(--text)',
                }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3B6FE8" strokeWidth={2} fill="url(#revGrad)" name="Revenue" />
              <Area type="monotone" dataKey="expenses" stroke="#22C55E" strokeWidth={2} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick tools */}
        <div className="surface p-5">
          <p className="font-semibold text-[var(--text)] text-sm mb-4">
            Quick Tools
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {quickTools.map((tool) => (
              <Link
                key={tool.label}
                href={tool.href}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--elevated)] hover:bg-[var(--border)] transition-all duration-150 text-center group"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${tool.color} transition-transform duration-200 group-hover:scale-110`}
                >
                  {tool.icon}
                </div>
                <span className="text-xs font-medium text-[var(--text-secondary)] leading-tight">
                  {tool.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="surface p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-[var(--text)] text-sm">
            Recent Invoices
          </p>
          <Link
            href="/invoices"
            className="text-xs text-zeno-blue hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {recentInvoices.map((inv) => {
            const subtotal = inv.items.reduce(
              (s, item) => s + item.quantity * item.unitPrice,
              0,
            )
            const total = subtotal * (1 + inv.taxRate / 100)
            return (
              <div
                key={inv.id}
                className="flex items-center gap-4 py-3 border-b border-[var(--border-subtle)] last:border-0"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--elevated)] flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-[var(--text-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--text)] truncate">
                    {inv.client}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {inv.number} · Due {inv.dueDate}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-number text-sm font-semibold text-[var(--text)]">
                    {formatCurrency(total)}
                  </p>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
