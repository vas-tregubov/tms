import type { AnchorHTMLAttributes } from 'react'

type TextLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  disabled?: boolean
}

const TextLink = ({
  children,
  className = '',
  disabled = false,
  href,
  onClick,
  tabIndex,
  role,
  'aria-disabled': ariaDisabled,
  ...props
}: TextLinkProps) => (
  <a
    {...props}
    href={disabled ? undefined : href}
    role={disabled ? 'link' : role}
    aria-disabled={disabled ? true : ariaDisabled}
    tabIndex={disabled ? -1 : tabIndex}
    onClick={disabled ? (event) => event.preventDefault() : onClick}
    className={`relative inline-flex text-sm leading-5 font-normal whitespace-nowrap no-underline focus-visible:outline-none ${disabled ? 'cursor-not-allowed text-muted' : 'text-primary hover:text-primary-hover hover:after:absolute hover:after:inset-x-0 hover:after:bottom-0 hover:after:h-px hover:after:bg-current focus-visible:before:pointer-events-none focus-visible:before:absolute focus-visible:before:-inset-1 focus-visible:before:rounded-control focus-visible:before:border focus-visible:before:border-primary'} ${className}`}
  >
    {children}
  </a>
)

export default TextLink
