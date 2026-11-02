import type { ComponentProps } from 'react'
import { Link, matchPath, Outlet, useLocation } from 'react-router'

import AppLayout from '@/app/layouts/app-layout'
import type Sidebar from '@/widgets/sidebar'

const SIDEBAR_HREFS = {
  home: '/',
  routes: '/routes',
  trips: '/trips',
  directories: '/directories',
  reports: '/reports',
  settings: '/settings',
} satisfies ComponentProps<typeof Sidebar>['hrefs']

const RoutedAppLayout = () => {
  const { pathname } = useLocation()
  const activeItem = (
    Object.keys(SIDEBAR_HREFS) as (keyof typeof SIDEBAR_HREFS)[]
  ).find((section) =>
    matchPath(
      { path: SIDEBAR_HREFS[section], end: section === 'home' },
      pathname,
    ),
  )

  return (
    <AppLayout
      sidebar={{
        hrefs: SIDEBAR_HREFS,
        activeItem,
        renderLink: ({ href, ...props }) => <Link {...props} to={href} />,
      }}
      header={{
        notifications: { onClick: () => {} },
        userMenu: {
          initials: 'АП',
          name: 'Алексей Петров',
          role: 'Диспетчер',
          onClick: () => {},
        },
      }}
    >
      <Outlet />
    </AppLayout>
  )
}

export default RoutedAppLayout
