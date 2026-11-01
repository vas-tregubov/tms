import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import AppLayout from '@/app/layouts/app-layout'

const meta = {
  title: 'App/AppLayout',
  component: AppLayout,
  tags: ['autodocs'],
  args: {
    sidebar: {
      hrefs: {
        home: '#home',
        routes: '#routes',
        trips: '#trips',
        directories: '#directories',
        reports: '#reports',
        settings: '#settings',
      },
      activeItem: 'routes',
    },
    header: {
      notifications: { onClick: fn() },
      userMenu: {
        initials: 'АП',
        name: 'Алексей Петров',
        role: 'Диспетчер',
        onClick: fn(),
      },
    },
    children: (
      <div className="space-y-5">
        <h1 className="text-2xl leading-8 font-semibold">Область страницы</h1>
        <p className="text-sm leading-5 text-muted">
          Прокручивается только контент. Header и Sidebar остаются на месте.
        </p>
        <div className="rounded-card border border-border bg-surface p-4 text-sm leading-5">
          Содержимое текущей страницы.
        </div>
      </div>
    ),
  },
  argTypes: { children: { control: false } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Desktop application shell on the app layer. Header spans the full application width. Below it, Sidebar keeps its 240px navigation width and main fills the remaining space. The body and main can shrink; main owns Page content scrolling and 20px padding. Header and Sidebar stay outside that scroll area. Supply widget props and Page content through children. No routing, Outlet wrapper, domain data, or authentication is implemented.',
      },
    },
  },
} satisfies Meta<typeof AppLayout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
