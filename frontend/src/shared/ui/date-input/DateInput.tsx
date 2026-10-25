import { useId, useState } from 'react'
import type { ComponentProps } from 'react'

import CalendarIcon from '@/shared/assets/icons/calendar.svg?react'
import Input from '@/shared/ui/input'

type DateInputProps = Omit<
  ComponentProps<typeof Input>,
  'type' | 'icon' | 'min' | 'max' | 'value' | 'defaultValue'
> & {
  embedded?: boolean
  value?: string
  defaultValue?: string
}

const DateInput = ({
  embedded = false,
  label,
  helper,
  error,
  value,
  defaultValue,
  onBlur,
  onChange,
  id,
  className = '',
  'aria-describedby': ariaDescribedBy,
  'aria-invalid': ariaInvalid,
  ...props
}: DateInputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [rangeError, setRangeError] = useState(false)
  const message = error || (rangeError ? 'Введите корректную дату' : undefined)
  const errorId = `${inputId}-error`
  const inputProps: ComponentProps<typeof Input> = {
    ...props,
    id: inputId,
    type: 'date',
    className:
      'relative [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:size-5 [&::-webkit-calendar-picker-indicator]:opacity-0',
    min: '1930-01-01',
    max: '2099-12-31',
    value,
    defaultValue: value === undefined ? defaultValue : undefined,
    onChange: (event) => {
      event.currentTarget.setCustomValidity(error || '')
      setRangeError(false)
      onChange?.(event)
    },
    onBlur: (event) => {
      const input = event.currentTarget
      const invalid =
        input.validity.badInput ||
        Boolean(
          input.value &&
          (!Number.isFinite(input.valueAsNumber) ||
            input.valueAsNumber < Date.UTC(1930, 0, 1) ||
            input.valueAsNumber > Date.UTC(2099, 11, 31)),
        )
      event.currentTarget.setCustomValidity(
        error || (invalid ? 'Введите корректную дату' : ''),
      )
      setRangeError(invalid)
      onBlur?.(event)
    },
  }

  if (embedded) {
    return (
      <div className="min-w-0">
        <input
          {...inputProps}
          aria-invalid={message ? true : ariaInvalid}
          aria-describedby={
            [ariaDescribedBy, message ? errorId : undefined]
              .filter(Boolean)
              .join(' ') || undefined
          }
          className={`${inputProps.className} block w-full min-w-0 field-sizing-fixed border-0 bg-transparent p-0 text-left text-sm leading-5 font-normal text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed disabled:text-muted ${className}`}
        />
        {message && (
          <span id={errorId} className="sr-only">
            {message}
          </span>
        )}
      </div>
    )
  }

  return (
    <Input
      {...inputProps}
      label={label}
      helper={helper}
      error={message}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedBy}
      icon={<CalendarIcon className="size-5" />}
      className={`${inputProps.className} ${className}`}
    />
  )
}

export default DateInput
