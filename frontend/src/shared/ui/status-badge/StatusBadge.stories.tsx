import type { Meta, StoryObj } from '@storybook/react-vite'

import StatusBadge from '@/shared/ui/status-badge'

const meta = {
  title: 'Shared/UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: {
    status: 'created',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['created', 'assigned', 'intransit', 'completed'],
    },
  },
} satisfies Meta<typeof StatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Created: Story = {}

export const Assigned: Story = {
  args: { status: 'assigned' },
}

export const InTransit: Story = {
  args: { status: 'intransit' },
}

export const Completed: Story = {
  args: { status: 'completed' },
}
