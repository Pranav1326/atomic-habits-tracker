import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        {...props}
        className={`
          w-full px-3 py-2 bg-background border rounded-md text-sm text-text-primary
          placeholder-muted transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-danger' : 'border-border'}
          ${className}
        `}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
