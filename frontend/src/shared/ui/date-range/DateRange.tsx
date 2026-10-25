import type { ComponentProps, HTMLAttributes } from 'react'

import DateInput from '@/shared/ui/date-input'

type DateRangeInputProps = Omit<ComponentProps<typeof DateInput>, 'embedded'>

type DateRangeProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  'children' | 'role'
> & {
  startInputProps?: DateRangeInputProps
  endInputProps?: DateRangeInputProps
  disabled?: boolean
}

const DateRange = ({
  startInputProps = {},
  endInputProps = {},
  disabled = false,
  className = '',
  'aria-label': ariaLabel = 'Период',
  ...props
}: DateRangeProps) => (
  <div
    {...props}
    role="group"
    aria-label={ariaLabel}
    className={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2 ${className}`}
  >
    <DateInput
      aria-label="Начальная дата"
      {...startInputProps}
      disabled={disabled || startInputProps.disabled}
    />
    <span aria-hidden="true" className="text-sm leading-9 text-muted">
      —
    </span>
    <DateInput
      aria-label="Конечная дата"
      {...endInputProps}
      disabled={disabled || endInputProps.disabled}
    />
  </div>
)

export default DateRange
