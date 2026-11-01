import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'

import UserMenuTrigger from '@/shared/ui/user-menu-trigger'

const meta = {
  title: 'Shared/UI/UserMenuTrigger',
  component: UserMenuTrigger,
  tags: ['autodocs'],
  args: {
    initials: 'МС',
    name: 'Мария Соколова',
    role: 'Оператор',
    onClick: fn(),
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A native button composed from Avatar, display name, role text, and the shared chevron icon. Supply prepared initials and an onClick handler. Role is a display label, not an HTML role or permission. Hover with the pointer and use Tab for the focus-visible state. The parent owns any future menu behavior; this component has no open state or dropdown.',
      },
    },
  },
} satisfies Meta<typeof UserMenuTrigger>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
