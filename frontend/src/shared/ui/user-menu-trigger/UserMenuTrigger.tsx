import type { MouseEventHandler } from 'react'

import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import Avatar from '@/shared/ui/avatar'

type UserMenuTriggerProps = {
  initials: string
  name: string
  role: string
  onClick: MouseEventHandler<HTMLButtonElement>
}

const UserMenuTrigger = ({
  initials,
  name,
  role,
  onClick,
}: UserMenuTriggerProps) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex cursor-pointer items-center gap-2 rounded-control bg-transparent px-2 py-1.5 text-left transition-colors hover:bg-surface-muted focus-visible:bg-surface-muted focus-visible:inset-ring focus-visible:inset-ring-primary focus-visible:outline-none"
  >
    <span aria-hidden="true" className="inline-flex shrink-0">
      <Avatar initials={initials} />
    </span>
    <span className="flex shrink-0 flex-col items-start whitespace-nowrap">
      <span className="text-sm leading-5 font-medium text-foreground">
        {name}
      </span>
      <span className="text-xs leading-4 font-normal text-muted">{role}</span>
    </span>
    <ChevronDownIcon
      aria-hidden="true"
      className="size-5 shrink-0 text-muted"
    />
  </button>
)

export default UserMenuTrigger
