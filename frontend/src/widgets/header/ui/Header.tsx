import type { ComponentProps } from 'react'

import AppLogo from '@/shared/ui/app-logo'
import NotificationTrigger from '@/shared/ui/notification-trigger'
import UserMenuTrigger from '@/shared/ui/user-menu-trigger'

type HeaderProps = {
  notifications: ComponentProps<typeof NotificationTrigger>
  userMenu: ComponentProps<typeof UserMenuTrigger>
}

const Header = ({ notifications, userMenu }: HeaderProps) => (
  <header className="flex h-14 w-full shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-5">
    <AppLogo />
    <div className="flex shrink-0 items-center gap-2">
      <NotificationTrigger {...notifications} />
      <UserMenuTrigger {...userMenu} />
    </div>
  </header>
)

export default Header
