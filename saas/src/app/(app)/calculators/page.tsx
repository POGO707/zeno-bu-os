'use client'

import Link from 'next/link'
import {
  DollarSign, Percent, Truck, Users, ArrowRight,
  Calculator, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const calculators = [
  {
    href: '/calculators/profit',
    icon: <DollarSign className="w-7 h-7" />,
    title: 'Profit Margin',
    description:
      'Calculate gross and net profit margins. Know exactly what you keep from every sale.',
    accent: 'from-green-500/20 to-emerald-500/10 text-zeno-green border-green-500/20',
    tag: 'Most popular',
  },
  {
    href: '/calculators/gst',
    icon: <Percent className="w-7 h-7" />,
    title: 'GST / Tax Calculator',
    description:
      'Add or remove GST/VAT from any amount. Supports custom tax rates for any country.',
    accent: 'from-blue-500/20 to-indigo-500/10 text-zeno-blue border-blue-500/20',
    tag: null,
  },
  {
    href: '/calculators/shipping',
    icon: <Truck className="w-7 h-7" />,
    title: 'Shipping Cost',
    description:
      'Calculate shipping costs, compare carriers, and factor in packaging to set accurate pricing.',
    accent: 'from-amber-500/20 to-yellow-500/10 text-zeno-amber border-amber-500/20',
    tag: null,
  },
  {
    href: '/calculators/pricing',
    icon: <Users className="w-7 h-7" />,
    title: 'Freelance Rate',
    description:
      'Find your ideal hourly or project rate based on income goals, expenses, and billable hours.',
    accent: 'from-purple-500/20 to-violet-500/10 text-purple-500 border-purple-500/20',
    tag: 'New',
  },
]

export default function CalculatorsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-zeno-blue/10 flex items-center justify-center">
            <Calculator className="w-5 h-5 text-zeno-blue" />
          </div>
          <h2 className="text-title text-[var(--text)]">Business Calculators</h2>
        </div>
        <p className="text-[var(--text-secondary)] text-sm max-w-xl">
          Instant, accurate calculations for every business scenario. No spreadsheets needed.
        </p>
      </div>

      {/* Calculator grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {calculators.map((calc) => (
          <Link
            key={calc.href}
            href={calc.href}
            className="group surface p-6 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
          >
            {calc.tag && (
              <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-zeno-amber/20 text-zeno-amber rounded-full border border-zeno-amber/30">
                {calc.tag}
              </span>
            )}
            <div
              className={cn(
                'w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 border transition-transform duration-300 group-hover:scale-110',
                calc.accent,
              )}
            >
              {calc.icon}
            </div>
            <h3 className="font-semibold text-[var(--text)] text-base mb-2">
              {calc.title}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4">
              {calc.description}
            </p>
            <div className="flex items-center gap-1 text-xs font-semibold text-[var(--text-muted)] group-hover:text-zeno-blue transition-colors">
              Open calculator
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Tips */}
      <div className="surface p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-zeno-blue" />
          <p className="font-semibold text-[var(--text)] text-sm">
            Pro Tips
          </p>
        </div>
        <ul className="space-y-2.5 text-sm text-[var(--text-secondary)]">
          <li className="flex items-start gap-2">
            <span className="text-zeno-green mt-0.5">✓</span>
            Use the <strong className="text-[var(--text)]">Profit Margin</strong> calculator before setting any price — know your cost floor first.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zeno-green mt-0.5">✓</span>
            Always add tax <em>after</em> calculating your base price using the <strong className="text-[var(--text)]">GST Calculator</strong>.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-zeno-green mt-0.5">✓</span>
            Revisit your <strong className="text-[var(--text)]">Freelance Rate</strong> every 6 months as your business grows.
          </li>
        </ul>
      </div>
    </div>
  )
}

