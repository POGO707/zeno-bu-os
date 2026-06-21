'use client'

import { useEffect, useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { useAppStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppStore()
  // Prevent hydration mismatch — only render after client-side hydration
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex">
        {/* Sidebar placeholder */}
        <div className="w-56 flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)]" />
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-[var(--border)] bg-[var(--surface)]" />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Sidebar />
      <div
        className={cn(
          'transition-all duration-300 ease-smooth min-h-screen flex flex-col',
          sidebarCollapsed ? 'ml-16' : 'ml-56',
        )}
      >
        <Topbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
