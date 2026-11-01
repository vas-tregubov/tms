import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import NotificationTrigger from '@/shared/ui/notification-trigger'

const meta = {
  title: 'Shared/UI/NotificationTrigger',
  component: NotificationTrigger,
  tags: ['autodocs'],
  args: {
    hasUnread: false,
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Notification button composed from IconButton and the existing Bell/BellNew icons. The parent supplies hasUnread and the click handler. Both icons are decorative; the button is named Уведомления. No notification data, menu, or open state is managed here.',
      },
    },
  },
} satisfies Meta<typeof NotificationTrigger>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Unread: Story = {
  args: { hasUnread: true },
}
