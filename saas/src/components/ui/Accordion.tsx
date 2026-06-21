import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface AccordionItem {
  id: string
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className={cn('divide-y divide-[var(--border)]', className)}>
      {items.map((item) => {
        const isOpen = open === item.id
        return (
          <div key={item.id}>
            <button
              onClick={() => setOpen(isOpen ? null : item.id)}
              className="flex w-full items-center justify-between py-5 text-left gap-4 group"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-medium text-[var(--text)] group-hover:text-zeno-blue transition-colors">
                {item.question}
              </span>
              <ChevronDown
                size={16}
                className={cn(
                  'flex-shrink-0 text-[var(--text-muted)] transition-transform duration-200',
                  isOpen && 'rotate-180',
                )}
              />
            </button>
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0',
              )}
            >
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
