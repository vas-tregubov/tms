import type { MouseEventHandler } from 'react'

import BellIcon from '@/shared/assets/icons/bell.svg?react'
import BellNewIcon from '@/shared/assets/icons/bell-new.svg?react'
import IconButton from '@/shared/ui/icon-button'

type NotificationTriggerProps = {
  hasUnread?: boolean
  onClick: MouseEventHandler<HTMLButtonElement>
}

const NotificationTrigger = ({
  hasUnread = false,
  onClick,
}: NotificationTriggerProps) => (
  <IconButton
    aria-label="Уведомления"
    icon={
      hasUnread ? (
        <BellNewIcon aria-hidden="true" className="size-[30px] shrink-0" />
      ) : (
        <BellIcon aria-hidden="true" className="size-[30px] shrink-0" />
      )
    }
    onClick={onClick}
  />
)

export default NotificationTrigger
