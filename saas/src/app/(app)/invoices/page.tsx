'use client'

import { useState, useMemo } from 'react'
import {
  Plus, Search, FileText, Trash2, Send, CheckCircle2,
  Clock, AlertCircle, Copy,
} from 'lucide-react'
import { useAppStore, type Invoice } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

// ─── Status badge ─────────────────────────────────────────────
const statusConfig = {
  paid: { label: 'Paid', icon: <CheckCircle2 className="w-3 h-3" />, cls: 'text-zeno-green bg-green-500/10 border-green-500/20' },
  sent: { label: 'Sent', icon: <Send className="w-3 h-3" />, cls: 'text-zeno-blue bg-blue-500/10 border-blue-500/20' },
  draft: { label: 'Draft', icon: <FileText className="w-3 h-3" />, cls: 'text-[var(--text-muted)] bg-[var(--elevated)] border-[var(--border)]' },
  overdue: { label: 'Overdue', icon: <AlertCircle className="w-3 h-3" />, cls: 'text-zeno-red bg-red-500/10 border-red-500/20' },
}

function StatusBadge({ status }: { status: Invoice['status'] }) {
  const cfg = statusConfig[status]
  return (
    <span className={cn('inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border', cfg.cls)}>
      {cfg.icon}
      {cfg.label}
    </span>
  )
}

// ─── New Invoice Form ─────────────────────────────────────────
function NewInvoiceModal({ onClose }: { onClose: () => void }) {
  const { addInvoice, invoices } = useAppStore()
  const [client, setClient] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split('T')[0]
  })
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }])
  const [taxRate, setTaxRate] = useState(10)
  const [notes, setNotes] = useState('')

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  const addItem = () => setItems((prev) => [...prev, { desc: '', qty: 1, price: 0 }])
  const updateItem = (idx: number, field: string, value: string | number) => {
    setItems((prev) => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }

  const handleCreate = () => {
    if (!client) return
    const nextNum = `INV-${String(invoices.length + 1).padStart(4, '0')}`
    addInvoice({
      id: Date.now().toString(),
      number: nextNum,
      client,
      clientEmail,
      clientAddress: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate,
      items: items.map((item, i) => ({
        id: String(i),
        description: item.desc,
        quantity: item.qty,
        unitPrice: item.price,
      })),
      taxRate,
      notes,
      status: 'draft',
      currency: 'USD',
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-[var(--surface)] border-b border-[var(--border)] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-semibold text-[var(--text)]">New Invoice</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] text-xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">
          {/* Client info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Client Name *</label>
              <input className="field-input" value={client} onChange={(e) => setClient(e.target.value)} placeholder="Acme Corporation" />
            </div>
            <div>
              <label className="field-label">Client Email</label>
              <input className="field-input" type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="billing@acme.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Issue Date</label>
              <input className="field-input" type="date" defaultValue={new Date().toISOString().split('T')[0]} readOnly />
            </div>
            <div>
              <label className="field-label">Due Date</label>
              <input className="field-input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Line items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="field-label mb-0">Line Items</label>
              <button onClick={addItem} className="text-xs text-zeno-blue hover:underline font-medium flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] px-1">
                <span className="col-span-6">Description</span>
                <span className="col-span-2 text-center">Qty</span>
                <span className="col-span-4 text-right">Unit Price</span>
              </div>
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    className="field-input col-span-6 text-sm"
                    placeholder="Service description"
                    value={item.desc}
                    onChange={(e) => updateItem(i, 'desc', e.target.value)}
                  />
                  <input
                    className="field-input col-span-2 text-sm text-center"
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                  />
                  <input
                    className="field-input col-span-4 text-sm text-right font-number"
                    type="number"
                    min={0}
                    placeholder="0.00"
                    value={item.price || ''}
                    onChange={(e) => updateItem(i, 'price', Number(e.target.value))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Tax + totals */}
          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label className="field-label">Tax Rate (%)</label>
              <input className="field-input" type="number" min={0} max={100} value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} />
            </div>
            <div className="surface-elevated rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Subtotal</span>
                <span className="font-number font-semibold text-[var(--text)]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[var(--text-secondary)]">Tax ({taxRate}%)</span>
                <span className="font-number font-semibold text-[var(--text)]">{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border)] pt-2">
                <span className="font-semibold text-[var(--text)]">Total</span>
                <span className="font-number font-bold text-[var(--text)] text-base">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="field-label">Notes</label>
            <textarea
              className="field-input resize-none"
              rows={3}
              placeholder="Payment terms, additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] px-6 py-4 flex justify-end gap-3 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors">
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!client}
            className="flex items-center gap-2 bg-zeno-blue text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-zeno-blue-hover disabled:opacity-50 disabled:pointer-events-none transition-all"
          >
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Invoices Page ───────────────────────────────────────

export default function InvoicesPage() {
  const { invoices, updateInvoice, deleteInvoice } = useAppStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showNew, setShowNew] = useState(false)

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.client.toLowerCase().includes(search.toLowerCase()) ||
        inv.number.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || inv.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [invoices, search, statusFilter])

  const totals = useMemo(() => {
    const calc = (status: string[]) =>
      invoices
        .filter((inv) => status.includes(inv.status))
        .reduce((s, inv) => {
          const sub = inv.items.reduce((a, i) => a + i.quantity * i.unitPrice, 0)
          return s + sub * (1 + inv.taxRate / 100)
        }, 0)
    return {
      paid: calc(['paid']),
      outstanding: calc(['sent', 'overdue']),
      draft: calc(['draft']),
    }
  }, [invoices])

  return (
    <div className="space-y-6 animate-fade-in">
      {showNew && <NewInvoiceModal onClose={() => setShowNew(false)} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-title text-[var(--text)]">Invoices</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          id="new-invoice-btn"
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 bg-zeno-blue text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-zeno-blue-hover transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Paid', value: totals.paid, icon: <CheckCircle2 className="w-4 h-4" />, cls: 'text-zeno-green bg-green-500/10' },
          { label: 'Outstanding', value: totals.outstanding, icon: <Clock className="w-4 h-4" />, cls: 'text-zeno-amber bg-amber-500/10' },
          { label: 'Draft', value: totals.draft, icon: <FileText className="w-4 h-4" />, cls: 'text-[var(--text-muted)] bg-[var(--elevated)]' },
        ].map((stat) => (
          <div key={stat.label} className="surface p-4 flex items-center gap-3">
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', stat.cls)}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{stat.label}</p>
              <p className="font-number font-bold text-[var(--text)] text-lg">{formatCurrency(stat.value)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" />
          <input
            className="bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none flex-1"
            placeholder="Search by client or invoice number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'paid', 'sent', 'draft', 'overdue'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all duration-150',
                statusFilter === s
                  ? 'bg-zeno-blue text-white'
                  : 'bg-[var(--elevated)] text-[var(--text-secondary)] hover:bg-[var(--border)]',
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Invoice table */}
      <div className="surface overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[var(--border)] text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
          <span className="col-span-1">#</span>
          <span className="col-span-3">Client</span>
          <span className="col-span-2">Due Date</span>
          <span className="col-span-2">Status</span>
          <span className="col-span-2 text-right">Amount</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-[var(--text-muted)]">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No invoices found</p>
          </div>
        )}

        {filtered.map((inv) => {
          const subtotal = inv.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0)
          const total = subtotal * (1 + inv.taxRate / 100)

          return (
            <div
              key={inv.id}
              className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--elevated)] transition-colors items-center group"
            >
              <span className="col-span-1 font-mono text-xs text-[var(--text-muted)]">
                {inv.number}
              </span>
              <div className="col-span-3">
                <p className="text-sm font-semibold text-[var(--text)] truncate">{inv.client}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{inv.clientEmail}</p>
              </div>
              <span className="col-span-2 text-sm text-[var(--text-secondary)]">{inv.dueDate}</span>
              <div className="col-span-2">
                <StatusBadge status={inv.status} />
              </div>
              <div className="col-span-2 text-right">
                <span className="font-number font-semibold text-sm text-[var(--text)]">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {inv.status !== 'paid' && (
                  <button
                    title="Mark as paid"
                    onClick={() => updateInvoice(inv.id, { status: 'paid' })}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-zeno-green hover:bg-green-500/10 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  title="Duplicate"
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--border)] transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  title="Delete"
                  onClick={() => deleteInvoice(inv.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zeno-red hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
