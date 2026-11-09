import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import { ErrorFallback } from '@/app/error-boundary'
import AppLayout from '@/app/layouts/app-layout'

const meta = {
  title: 'App/ErrorFallback',
  component: ErrorFallback,
  tags: ['autodocs'],
  args: { onReload: fn() },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ErrorFallback>

export default meta

type Story = StoryObj<typeof meta>

export const Fullscreen: Story = {}

export const Page: Story = {
  args: { onGoHome: fn() },
  decorators: [
    (Story) => (
      <AppLayout
        sidebar={{
          hrefs: {
            home: '#home',
            routes: '#routes',
            trips: '#trips',
            directories: '#directories',
            reports: '#reports',
            settings: '#settings',
          },
          activeItem: 'trips',
        }}
        header={{
          notifications: { onClick: fn() },
          userMenu: {
            initials: 'АП',
            name: 'Алексей Петров',
            role: 'Диспетчер',
            onClick: fn(),
          },
        }}
      >
        <Story />
      </AppLayout>
    ),
  ],
}
