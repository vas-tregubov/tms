import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonVariant = 'ghost' | 'outline'

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  icon: ReactNode
  'aria-label': string
  variant?: IconButtonVariant
}

const variantClasses: Record<IconButtonVariant, string> = {
  ghost:
    'bg-transparent enabled:hover:bg-surface-muted enabled:active:bg-border focus-visible:bg-primary-soft focus-visible:inset-ring focus-visible:inset-ring-primary',
  outline:
    'border border-border bg-surface enabled:hover:border-primary-hover enabled:active:border-primary-active focus-visible:border-primary focus-visible:inset-ring focus-visible:inset-ring-primary disabled:bg-surface-muted',
}

const IconButton = ({
  icon,
  variant = 'ghost',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}: IconButtonProps) => (
  <button
    {...props}
    className={`inline-flex size-9 shrink-0 items-center justify-center rounded-control p-1.5 text-foreground transition-colors focus-visible:outline-none disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
    disabled={disabled}
    type={type}
  >
    <span
      aria-hidden="true"
      className="inline-flex size-5 shrink-0 items-center justify-center"
    >
      {icon}
    </span>
  </button>
)

export default IconButton
