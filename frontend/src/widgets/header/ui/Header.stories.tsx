import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import Header from '@/widgets/header'

const meta = {
  title: 'Widgets/Header',
  component: Header,
  tags: ['autodocs'],
  args: {
    notifications: { onClick: fn() },
    userMenu: {
      initials: 'АП',
      name: 'Алексей Петров',
      role: 'Диспетчер',
      onClick: fn(),
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Application header composed from AppLogo, NotificationTrigger, and UserMenuTrigger. Uses the Figma 56px height, 20px horizontal padding, surface background, bottom border, and 8px gap between actions. The parent supplies display props and click handlers; the header owns no notification, routing, authentication, or dropdown logic.',
      },
    },
  },
} satisfies Meta<typeof Header>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
