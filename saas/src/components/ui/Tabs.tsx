import { cn } from '@/lib/utils'
import { useState } from 'react'

interface Tab {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (id: string) => void
  children: (activeTab: string) => React.ReactNode
  variant?: 'underline' | 'pill'
  className?: string
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  children,
  variant = 'underline',
  className,
}: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id)

  const handleChange = (id: string) => {
    setActive(id)
    onChange?.(id)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Tab bar */}
      <div
        className={cn(
          'flex',
          variant === 'underline'
            ? 'border-b border-[var(--border)] gap-1'
            : 'gap-1 p-1 bg-[var(--elevated)] rounded-xl w-fit',
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleChange(tab.id)}
            className={cn(
              'inline-flex items-center gap-2 font-medium transition-all duration-150 text-sm',
              variant === 'underline'
                ? [
                    'px-4 py-2.5 border-b-2 -mb-px',
                    active === tab.id
                      ? 'border-zeno-blue text-zeno-blue'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border)]',
                  ]
                : [
                    'px-3.5 py-1.5 rounded-lg',
                    active === tab.id
                      ? 'bg-[var(--surface)] text-[var(--text)] shadow-card'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]',
                  ],
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  'px-1.5 py-0.5 text-xs rounded-md',
                  active === tab.id
                    ? 'bg-zeno-blue/15 text-zeno-blue'
                    : 'bg-[var(--border)] text-[var(--text-muted)]',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">{children(active)}</div>
    </div>
  )
}
