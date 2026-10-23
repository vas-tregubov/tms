import { useId } from 'react'
import type { ReactNode, SelectHTMLAttributes } from 'react'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  helper?: string
  error?: string
  icon?: ReactNode
}

const Select = ({
  label,
  helper,
  error,
  icon,
  children,
  id,
  className = '',
  disabled = false,
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: SelectProps) => {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const message = error || helper
  const messageId = `${selectId}-helper`
  const describedBy =
    [ariaDescribedBy, message ? messageId : undefined]
      .filter(Boolean)
      .join(' ') || undefined
  const iconClasses = icon ? 'appearance-none pr-10' : ''

  return (
    <div className="flex w-full min-w-0 flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className={`text-sm leading-5 font-medium ${disabled ? 'text-muted' : 'text-foreground'}`}
        >
          {label}
        </label>
      )}
      <div className="relative w-full min-w-0">
        <select
          {...props}
          id={selectId}
          disabled={disabled}
          aria-describedby={describedBy}
          aria-invalid={error ? true : ariaInvalid}
          className={`h-9 w-full min-w-0 rounded-control border bg-surface px-3 text-sm leading-5 font-normal text-foreground has-[option:checked[value='']]:text-muted focus:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted [&_option]:text-foreground ${error ? 'border-danger focus:border-danger' : 'border-border focus:border-primary'} ${iconClasses} ${className}`}
        >
          {children}
        </select>
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

export default Select
