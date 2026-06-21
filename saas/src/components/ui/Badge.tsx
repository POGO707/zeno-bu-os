import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'amber' | 'red' | 'neutral' | 'purple'
  size?: 'sm' | 'md'
  dot?: boolean
  className?: string
}

const variants = {
  blue: 'bg-blue-500/10 text-zeno-blue border-blue-500/20',
  green: 'bg-green-500/10 text-zeno-green border-green-500/20',
  amber: 'bg-amber-500/10 text-zeno-amber border-amber-500/20',
  red: 'bg-red-500/10 text-zeno-red border-red-500/20',
  neutral: 'bg-[var(--elevated)] text-[var(--text-secondary)] border-[var(--border)]',
  purple: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
}

const dotColors = {
  blue: 'bg-zeno-blue',
  green: 'bg-zeno-green',
  amber: 'bg-zeno-amber',
  red: 'bg-zeno-red',
  neutral: 'bg-[var(--text-muted)]',
  purple: 'bg-purple-500',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        variants[variant],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-soft',
            dotColors[variant],
          )}
        />
      )}
      {children}
    </span>
  )
}
