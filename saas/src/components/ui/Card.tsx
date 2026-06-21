import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function Card({ children, className, hover, padding = 'md', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'surface transition-all duration-200',
        hover && 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  accent?: 'blue' | 'green' | 'amber' | 'red'
  className?: string
}

const accents = {
  blue: {
    icon: 'bg-blue-500/10 text-zeno-blue',
    badge: 'text-zeno-blue bg-blue-500/10',
  },
  green: {
    icon: 'bg-green-500/10 text-zeno-green',
    badge: 'text-zeno-green bg-green-500/10',
  },
  amber: {
    icon: 'bg-amber-500/10 text-zeno-amber',
    badge: 'text-zeno-amber bg-amber-500/10',
  },
  red: {
    icon: 'bg-red-500/10 text-zeno-red',
    badge: 'text-zeno-red bg-red-500/10',
  },
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  accent = 'blue',
  className,
}: StatCardProps) {
  const colors = accents[accent]
  const isPositive = (change ?? 0) >= 0

  return (
    <Card className={className}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="font-number text-2xl font-semibold text-[var(--text)] mt-1">
            {value}
          </p>
          {change !== undefined && (
            <p className="flex items-center gap-1 mt-2 text-xs">
              <span
                className={cn(
                  'font-medium',
                  isPositive ? 'text-zeno-green' : 'text-zeno-red',
                )}
              >
                {isPositive ? '+' : ''}
                {change}%
              </span>
              {changeLabel && (
                <span className="text-[var(--text-muted)]">{changeLabel}</span>
              )}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
              colors.icon,
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}
