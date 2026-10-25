import type { HTMLAttributes } from 'react'

import ChevronRightIcon from '@/shared/assets/icons/chevron-right.svg?react'

type BreadcrumbsItem = {
  id: string
  label: string
  href?: string
}

type BreadcrumbsProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  items: BreadcrumbsItem[]
}

const Breadcrumbs = ({
  items,
  className = '',
  'aria-label': ariaLabel = 'Breadcrumbs',
  ...props
}: BreadcrumbsProps) => {
  if (items.length === 0) {
    return null
  }

  return (
    <nav {...props} aria-label={ariaLabel} className={`min-w-0 ${className}`}>
      <ol className="flex min-w-0 items-center gap-1 text-sm leading-5">
        {items.map(({ id, label, href }, index) => {
          const isCurrent = index === items.length - 1

          return (
            <li
              key={id}
              className={`flex items-center gap-1 ${index === 0 ? 'min-w-7' : 'min-w-12'} ${isCurrent ? '' : 'shrink-[100]'}`}
            >
              {index > 0 && (
                <span aria-hidden="true" className="inline-flex shrink-0">
                  <ChevronRightIcon className="-m-1 size-6 text-muted" />
                </span>
              )}
              {isCurrent ? (
                <span
                  aria-current="page"
                  title={label}
                  className="min-w-0 truncate font-medium text-foreground"
                >
                  {label}
                </span>
              ) : href ? (
                <a
                  href={href}
                  title={label}
                  className="max-w-48 min-w-0 truncate rounded-control font-normal text-muted no-underline hover:text-foreground focus-visible:outline-1 focus-visible:outline-primary"
                >
                  {label}
                </a>
              ) : (
                <span
                  title={label}
                  className="max-w-48 min-w-0 truncate font-normal text-muted"
                >
                  {label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
