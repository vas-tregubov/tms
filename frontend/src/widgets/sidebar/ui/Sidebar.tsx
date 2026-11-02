import type { ComponentProps } from 'react'

import SidebarItem from '@/shared/ui/sidebar-item'

import {
  bottomItems,
  mainItems,
  type SidebarSection,
} from '../model/navigation'

type SidebarProps = {
  hrefs: Record<SidebarSection, string>
  activeItem?: SidebarSection
  renderLink?: ComponentProps<typeof SidebarItem>['renderLink']
}

const Sidebar = ({ hrefs, activeItem, renderLink }: SidebarProps) => (
  <nav
    aria-label="Основная навигация"
    className="flex h-full min-h-0 w-60 shrink-0 flex-col gap-3 overflow-y-auto border-r border-border bg-surface py-3"
  >
    <ul className="m-0 flex list-none flex-col gap-0.5 px-2">
      {mainItems.map(({ id, label, Icon }) => (
        <li key={id}>
          <SidebarItem
            href={hrefs[id]}
            renderLink={renderLink}
            active={activeItem === id}
            icon={
              <Icon
                aria-hidden="true"
                className={`size-full ${activeItem === id ? 'text-primary' : ''}`}
              />
            }
          >
            {label}
          </SidebarItem>
        </li>
      ))}
    </ul>
    <ul className="m-0 mt-auto flex list-none flex-col gap-0.5 px-2">
      {bottomItems.map(({ id, label, Icon }) => (
        <li key={id}>
          <SidebarItem
            href={hrefs[id]}
            renderLink={renderLink}
            active={activeItem === id}
            icon={
              <Icon
                aria-hidden="true"
                className={`size-full ${activeItem === id ? 'text-primary' : ''}`}
              />
            }
          >
            {label}
          </SidebarItem>
        </li>
      ))}
    </ul>
  </nav>
)

export default Sidebar
