import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react'

// ── Input ────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  prefix?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="field-label">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-[var(--text-muted)] pointer-events-none">
              {prefix}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'field-input',
              prefix && 'pl-9',
              suffix && 'pr-9',
              error && 'border-zeno-red focus:border-zeno-red focus:shadow-none focus:ring-red-500/20',
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-[var(--text-muted)] pointer-events-none">
              {suffix}
            </span>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-zeno-red">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'

// ── Textarea ─────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="field-label">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            'field-input resize-none min-h-[100px]',
            error && 'border-zeno-red',
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-zeno-red">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{hint}</p>}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

// ── Select ───────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="field-label">{label}</label>}
        <select
          ref={ref}
          className={cn(
            'field-input appearance-none cursor-pointer pr-9',
            error && 'border-zeno-red',
            className,
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.625rem center',
            backgroundSize: '1.25rem',
          }}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-xs text-zeno-red">{error}</p>}
      </div>
    )
  },
)
Select.displayName = 'Select'
