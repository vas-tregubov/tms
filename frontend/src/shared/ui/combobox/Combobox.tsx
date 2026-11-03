import { useEffect, useId, useRef, useState } from 'react'

import CheckIcon from '@/shared/assets/icons/check.svg?react'
import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import CloseIcon from '@/shared/assets/icons/close.svg?react'
import SearchIcon from '@/shared/assets/icons/search.svg?react'

export type ComboboxOption = { value: string; label: string }
type ComboboxProps = {
  label: string
  options: ComboboxOption[]
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  placeholder?: string
  helper?: string
  error?: string
  disabled?: boolean
}

const Combobox = ({
  label,
  options,
  value,
  onChange,
  onBlur,
  placeholder = 'Начните вводить...',
  helper = 'Введите часть названия или откройте список',
  error,
  disabled = false,
}: ComboboxProps) => {
  const id = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const selected = options.find((option) => option.value === value)
  const results = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  )
  const open = isOpen && !disabled
  const close = () => {
    setIsOpen(false)
    setIsTyping(false)
    setQuery('')
    setActiveIndex(-1)
  }
  const choose = (option: ComboboxOption) => {
    onChange(option.value)
    close()
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
        setIsTyping(false)
        setQuery('')
        setActiveIndex(-1)
      }
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])

  useEffect(() => {
    if (open && activeIndex >= 0)
      document
        .getElementById(`${id}-option-${activeIndex}`)
        ?.scrollIntoView?.({ block: 'nearest' })
  }, [activeIndex, id, open])

  return (
    <div
      ref={rootRef}
      className="flex w-full min-w-0 flex-col gap-1"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          close()
          onBlur?.()
        }
      }}
    >
      <label
        htmlFor={id}
        className={`text-sm leading-5 font-medium ${disabled ? 'text-muted' : 'text-foreground'}`}
      >
        {label}
      </label>
      <div className="relative">
        <div
          className={`flex h-9 items-center gap-2 rounded-control border px-3 focus-within:border-primary ${error ? 'border-danger focus-within:border-danger' : open ? 'border-primary' : 'border-border'} ${disabled ? 'bg-surface-muted text-muted' : 'bg-surface text-foreground'}`}
        >
          <SearchIcon
            className="size-[18px] shrink-0 text-muted"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? `${id}-list` : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              open && results[activeIndex]
                ? `${id}-option-${activeIndex}`
                : undefined
            }
            aria-invalid={Boolean(error)}
            aria-describedby={`${id}-message`}
            autoComplete="off"
            disabled={disabled}
            placeholder={placeholder}
            value={isTyping ? query : (selected?.label ?? '')}
            className="min-w-0 flex-1 bg-transparent text-sm leading-5 placeholder:text-muted focus:outline-none disabled:cursor-not-allowed"
            onClick={() => setIsOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value)
              setIsTyping(true)
              setIsOpen(true)
              setActiveIndex(-1)
              if (value) onChange('')
            }}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                if (open) event.preventDefault()
                close()
              }
              if (event.key === 'Tab') close()
              if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault()
                setIsOpen(true)
                setActiveIndex((index) =>
                  results.length
                    ? event.key === 'ArrowDown'
                      ? Math.min(index + 1, results.length - 1)
                      : index < 0
                        ? results.length - 1
                        : Math.max(index - 1, 0)
                    : -1,
                )
              }
              if (event.key === 'Enter' && open) {
                event.preventDefault()
                if (results[activeIndex]) choose(results[activeIndex])
              }
            }}
          />
          {isTyping && query ? (
            <button
              type="button"
              aria-label={`Очистить поиск: ${label}`}
              disabled={disabled}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setQuery('')
                setActiveIndex(-1)
                inputRef.current?.focus()
              }}
              className="cursor-pointer text-muted focus-visible:outline-1 focus-visible:outline-primary"
            >
              <CloseIcon className="size-4" aria-hidden="true" />
            </button>
          ) : selected ? (
            <CheckIcon className="size-4 shrink-0" aria-hidden="true" />
          ) : null}
          <button
            type="button"
            aria-label={`${open ? 'Закрыть' : 'Открыть'} список: ${label}`}
            disabled={disabled}
            tabIndex={-1}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setIsOpen(!open)
              inputRef.current?.focus()
            }}
            className="cursor-pointer text-muted disabled:cursor-not-allowed"
          >
            <ChevronDownIcon
              className={`size-5 ${open ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>
        </div>
        {open && (
          <ul
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            className="absolute top-full left-0 z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-control border border-border bg-surface py-1 shadow-card"
          >
            {results.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={value === option.value}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
                className={`flex min-h-9 cursor-pointer items-center px-3 text-sm leading-5 ${activeIndex === index ? 'bg-primary-soft' : ''}`}
              >
                {option.label}
              </li>
            ))}
            {!results.length && (
              <li role="presentation" className="p-3">
                <p role="status" className="text-sm leading-5">
                  Ничего не найдено
                </p>
                <p className="mt-1 text-xs leading-4 text-muted">
                  Измените или очистите запрос
                </p>
              </li>
            )}
          </ul>
        )}
      </div>
      <p
        id={`${id}-message`}
        className={`text-xs leading-4 ${error ? 'text-danger' : 'text-muted'}`}
      >
        {error || helper}
      </p>
    </div>
  )
}
export default Combobox
