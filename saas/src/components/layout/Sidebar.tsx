'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Calculator,
  ChevronLeft,
  FileText,
  LayoutDashboard,
  Truck,
  Users,
  Zap,
  DollarSign,
  Percent,
} from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const nav = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    label: 'Invoices',
    href: '/invoices',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    type: 'divider',
    label: 'Calculators',
  },
  {
    label: 'Profit Margin',
    href: '/calculators/profit',
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    label: 'GST / Tax',
    href: '/calculators/gst',
    icon: <Percent className="w-4 h-4" />,
  },
  {
    label: 'Shipping',
    href: '/calculators/shipping',
    icon: <Truck className="w-4 h-4" />,
  },
  {
    label: 'Freelance Rate',
    href: '/calculators/pricing',
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: 'All Calculators',
    href: '/calculators',
    icon: <Calculator className="w-4 h-4" />,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-screen z-30 flex flex-col',
        'bg-[var(--surface)] border-r border-[var(--border)]',
        'transition-all duration-300 ease-smooth',
        sidebarCollapsed ? 'w-16' : 'w-56',
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 border-b border-[var(--border)] flex-shrink-0',
          sidebarCollapsed ? 'justify-center px-4' : 'gap-2.5 px-5',
        )}
      >
        <div className="w-8 h-8 rounded-lg bg-zeno-blue flex items-center justify-center flex-shrink-0 shadow-glow-blue">
          <Zap className="w-4 h-4 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="font-bold text-lg gradient-text">Zeno</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {nav.map((item, i) => {
          if ('type' in item && item.type === 'divider') {
            return (
              <div key={i} className="pt-4 pb-1.5">
                {!sidebarCollapsed && (
                  <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                    {item.label}
                  </p>
                )}
                {sidebarCollapsed && (
                  <div className="border-t border-[var(--border)] mx-2 my-2" />
                )}
              </div>
            )
          }

          if (!('href' in item)) return null
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              title={sidebarCollapsed ? item.label : undefined}
              className={cn(
                'nav-item',
                isActive && 'active',
                sidebarCollapsed && 'justify-center px-0 w-12 mx-auto',
              )}
            >
              {item.icon}
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="flex-shrink-0 border-t border-[var(--border)] p-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)] transition-all duration-150 text-sm font-medium',
            sidebarCollapsed && 'justify-center',
          )}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            className={cn(
              'w-4 h-4 transition-transform duration-300',
              sidebarCollapsed && 'rotate-180',
            )}
          />
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
