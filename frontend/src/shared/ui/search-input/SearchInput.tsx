import type { ChangeEventHandler, InputHTMLAttributes } from 'react'

import CloseIcon from '@/shared/assets/icons/close.svg?react'
import SearchIcon from '@/shared/assets/icons/search.svg?react'

type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'value' | 'defaultValue' | 'onChange'
> & {
  value: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onClear: () => void
}

const SearchInput = ({
  value,
  onChange,
  onClear,
  disabled = false,
  readOnly = false,
  className = '',
  ...props
}: SearchInputProps) => (
  <div
    className={`flex h-9 w-full min-w-0 items-center gap-2 overflow-hidden rounded-control border px-3 text-sm leading-5 ${disabled ? 'border-border bg-surface-muted text-muted' : 'border-border bg-surface focus-within:border-primary'} ${className}`}
  >
    <SearchIcon
      aria-hidden="true"
      className={`size-4.5 shrink-0 ${value && !disabled ? 'text-foreground' : 'text-muted'}`}
    />
    <input
      {...props}
      type="search"
      value={value}
      onChange={onChange}
      disabled={disabled}
      readOnly={readOnly}
      className="min-w-0 flex-1 bg-transparent font-normal text-foreground placeholder:text-muted focus:outline-none disabled:cursor-not-allowed disabled:text-muted [&::-webkit-search-cancel-button]:appearance-none"
    />
    {value && (
      <button
        type="button"
        aria-label="Очистить поиск"
        disabled={disabled || readOnly}
        onClick={onClear}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded-control text-muted enabled:cursor-pointer enabled:hover:text-foreground focus-visible:outline-1 focus-visible:outline-primary disabled:cursor-not-allowed"
      >
        <CloseIcon aria-hidden="true" className="size-5" />
      </button>
    )}
  </div>
)

export default SearchInput
