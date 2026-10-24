import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helper?: string
  error?: string
  icon?: ReactNode
}

const Input = ({
  label,
  helper,
  error,
  icon,
  id,
  className = '',
  disabled = false,
  type = 'text',
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: InputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const message = error || helper
  const messageId = `${inputId}-helper`
  const describedBy =
    [ariaDescribedBy, message ? messageId : undefined]
      .filter(Boolean)
      .join(' ') || undefined

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className={`text-sm leading-5 font-medium ${disabled ? 'text-muted' : 'text-foreground'}`}
        >
          {label}
        </label>
      )}
      <div className="relative w-full min-w-0">
        <input
          {...props}
          id={inputId}
          type={type}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          className={`h-9 w-full min-w-0 rounded-control border bg-surface px-3 text-sm leading-5 font-normal text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'} ${icon ? 'pr-10' : ''} ${className}`}
        />
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 inline-flex size-5 -translate-y-1/2 items-center justify-center text-muted"
          >
            {icon}
          </span>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={`text-xs leading-4 font-normal ${error ? 'text-danger' : 'text-muted'}`}
        >
          {message}
        </p>
      )}
    </div>
  )
}

export default Input
