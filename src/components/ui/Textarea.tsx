import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export default function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={3}
        {...props}
        className={`
          w-full px-3 py-2 bg-background border rounded-md text-sm text-text-primary
          placeholder-muted transition-colors duration-150 resize-none
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
