import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-surface enabled:hover:bg-primary-hover enabled:active:bg-primary-active focus-visible:bg-primary-hover focus-visible:inset-ring-2 focus-visible:inset-ring-primary-active',
  secondary:
    'border border-border bg-surface text-foreground enabled:hover:border-primary-hover enabled:hover:text-primary-hover enabled:active:border-primary-active enabled:active:text-primary-active focus-visible:border-primary focus-visible:text-primary-hover focus-visible:inset-ring focus-visible:inset-ring-primary',
}

const Button = ({
  children,
  className = '',
  disabled = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  const iconElement = icon ? (
    <span
      aria-hidden="true"
      className="inline-flex size-4 shrink-0 items-center justify-center"
    >
      {icon}
    </span>
  ) : null

  return (
    <button
      {...props}
      className={`inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-control px-3 py-2 text-sm leading-5 font-medium transition-[color,background-color,border-color,scale] enabled:active:scale-[0.98] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      type={type}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </button>
  )
}

export default Button
