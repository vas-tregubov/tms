import CheckIcon from '@/shared/assets/icons/check.svg?react'
import CloseIcon from '@/shared/assets/icons/close.svg?react'

type ResultIndicatorProps = {
  variant?: 'success' | 'error'
}

const ResultIndicator = ({ variant = 'success' }: ResultIndicatorProps) => (
  <span
    aria-hidden="true"
    data-variant={variant}
    className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full text-surface ${variant === 'error' ? 'bg-danger' : 'bg-status-completed'}`}
  >
    {variant === 'error' ? (
      <CloseIcon className="size-12 shrink-0" />
    ) : (
      <CheckIcon className="size-12 shrink-0" />
    )}
  </span>
)

export default ResultIndicator
