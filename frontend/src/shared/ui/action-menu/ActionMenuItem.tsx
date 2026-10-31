import type { MouseEventHandler, ReactNode } from 'react'

type ActionMenuItemProps = {
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  destructive?: boolean
  icon?: ReactNode
}

const ActionMenuItem = ({
  children,
  onClick,
  disabled = false,
  destructive = false,
  icon,
}: ActionMenuItemProps) => (
  <button
    type="button"
    role="menuitem"
    tabIndex={-1}
    disabled={disabled}
    aria-disabled={disabled || undefined}
    onClick={onClick}
    className={`flex min-h-9 w-full items-center gap-2 rounded-control bg-surface px-3 py-2 text-left text-sm leading-5 font-normal enabled:hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:inset-ring focus-visible:inset-ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:text-muted ${destructive ? 'text-danger' : 'text-foreground'}`}
  >
    {icon && (
      <span
        aria-hidden="true"
        className="inline-flex size-5 shrink-0 items-center justify-center"
      >
        {icon}
      </span>
    )}
    <span className="min-w-0 flex-1 break-words">{children}</span>
  </button>
)

export default ActionMenuItem
