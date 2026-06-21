'use client'

import { Bell, Moon, Search, Sun } from 'lucide-react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/analytics': 'Analytics',
  '/invoices': 'Invoices',
  '/calculators': 'Calculators',
  '/calculators/profit': 'Profit Margin Calculator',
  '/calculators/gst': 'GST / Tax Calculator',
  '/calculators/shipping': 'Shipping Calculator',
  '/calculators/pricing': 'Freelance Rate Calculator',
}

export function Topbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Zeno'

  return (
    <header className="h-16 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-[var(--text)] font-semibold text-base">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-[var(--elevated)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm text-[var(--text-muted)] w-52 cursor-text hover:border-[var(--text-muted)] transition-colors">
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span>Search…</span>
        <kbd className="ml-auto text-[10px] bg-[var(--border)] px-1.5 py-0.5 rounded font-mono opacity-70">
          ⌘K
        </kbd>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          id="topbar-theme-toggle"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)] transition-all duration-150"
          aria-label="Toggle theme"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--elevated)] hover:text-[var(--text)] transition-all duration-150 relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-zeno-blue rounded-full border-2 border-[var(--surface)]" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zeno-blue to-purple-600 flex items-center justify-center text-white text-xs font-bold ml-1 cursor-pointer hover:scale-105 transition-transform">
          Z
        </div>
      </div>
    </header>
  )
}
