import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Invoice Types ──────────────────────────────────────────────
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  number: string
  client: string
  clientEmail: string
  clientAddress: string
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  taxRate: number
  notes: string
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  currency: string
  createdAt: string
}

// ─── Store Interface ─────────────────────────────────────────────
interface AppState {
  // Navigation
  sidebarCollapsed: boolean
  setSidebarCollapsed: (val: boolean) => void
  toggleSidebar: () => void

  // Invoices
  invoices: Invoice[]
  addInvoice: (invoice: Invoice) => void
  updateInvoice: (id: string, updates: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void

  // Business metrics (for analytics)
  businessName: string
  setBusinessName: (name: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Sidebar
      sidebarCollapsed: false,
      setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      // Invoices - seed with one sample
      invoices: [
        {
          id: '1',
          number: 'INV-0001',
          client: 'Acme Corporation',
          clientEmail: 'billing@acme.com',
          clientAddress: '123 Business Ave, New York, NY 10001',
          issueDate: new Date().toISOString().split('T')[0],
          dueDate: new Date(Date.now() + 30 * 86400000)
            .toISOString()
            .split('T')[0],
          items: [
            {
              id: '1',
              description: 'Web Design & Development',
              quantity: 1,
              unitPrice: 3500,
            },
            {
              id: '2',
              description: 'Monthly Maintenance (3 months)',
              quantity: 3,
              unitPrice: 250,
            },
          ],
          taxRate: 10,
          notes: 'Payment due within 30 days. Thank you for your business!',
          status: 'sent',
          currency: 'USD',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          number: 'INV-0002',
          client: 'StartupXYZ',
          clientEmail: 'cfo@startupxyz.io',
          clientAddress: '456 Tech Park, San Francisco, CA 94107',
          issueDate: new Date(Date.now() - 15 * 86400000)
            .toISOString()
            .split('T')[0],
          dueDate: new Date(Date.now() + 15 * 86400000)
            .toISOString()
            .split('T')[0],
          items: [
            {
              id: '1',
              description: 'Brand Strategy Consulting',
              quantity: 8,
              unitPrice: 200,
            },
          ],
          taxRate: 0,
          notes: '',
          status: 'paid',
          currency: 'USD',
          createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        },
        {
          id: '3',
          number: 'INV-0003',
          client: 'Global Media Co.',
          clientEmail: 'accounts@globalmedia.com',
          clientAddress: '789 Media Blvd, Chicago, IL 60601',
          issueDate: new Date(Date.now() - 45 * 86400000)
            .toISOString()
            .split('T')[0],
          dueDate: new Date(Date.now() - 15 * 86400000)
            .toISOString()
            .split('T')[0],
          items: [
            {
              id: '1',
              description: 'Social Media Campaign',
              quantity: 1,
              unitPrice: 5000,
            },
            { id: '2', description: 'Photography', quantity: 2, unitPrice: 800 },
          ],
          taxRate: 8,
          notes: 'Late fees may apply after due date.',
          status: 'overdue',
          currency: 'USD',
          createdAt: new Date(Date.now() - 45 * 86400000).toISOString(),
        },
      ],
      addInvoice: (invoice) =>
        set((s) => ({ invoices: [invoice, ...s.invoices] })),
      updateInvoice: (id, updates) =>
        set((s) => ({
          invoices: s.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv,
          ),
        })),
      deleteInvoice: (id) =>
        set((s) => ({ invoices: s.invoices.filter((inv) => inv.id !== id) })),

      businessName: 'My Business',
      setBusinessName: (name) => set({ businessName: name }),
    }),
    { name: 'zeno-store' },
  ),
)
