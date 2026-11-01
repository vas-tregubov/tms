import type { AnchorHTMLAttributes, ReactNode } from 'react'

type SidebarItemProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  icon?: ReactNode
  active?: boolean
  renderLink?: (
    props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string },
  ) => ReactNode
}

const SidebarItem = ({
  href,
  icon,
  active = false,
  renderLink,
  children,
  className = '',
  'aria-current': ariaCurrent,
  ...props
}: SidebarItemProps) => {
  const linkProps = {
    ...props,
    href,
    'aria-current': ariaCurrent ?? (active ? 'page' : undefined),
    className: `flex h-9 items-center gap-2 rounded-control px-3 text-sm leading-5 no-underline transition-colors focus-visible:bg-surface-muted focus-visible:inset-ring focus-visible:inset-ring-primary focus-visible:outline-none ${active ? 'border-l-[3px] border-primary bg-primary-soft font-semibold text-primary' : 'font-medium text-foreground hover:bg-surface-muted'} ${className}`,
    children: (
      <>
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none inline-flex size-[30px] shrink-0 items-center justify-center text-foreground"
          >
            {icon}
          </span>
        )}
        <span className="min-w-0 flex-1">{children}</span>
      </>
    ),
  } satisfies AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

  return renderLink ? renderLink(linkProps) : <a {...linkProps} />
}

export default SidebarItem
