import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  isLoading?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:bg-primary-active',
  secondary:
    'border border-border bg-surface text-foreground hover:bg-surface-muted active:bg-background',
  danger: 'bg-danger text-white hover:bg-danger-hover active:bg-danger-hover',
}

const Button = ({
  children,
  className = '',
  disabled = false,
  isLoading = false,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      aria-busy={isLoading}
      className={`inline-flex items-center justify-center rounded-control px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      type={type}
    >
      {isLoading ? 'Loading…' : children}
    </button>
  )
}

export default Button
