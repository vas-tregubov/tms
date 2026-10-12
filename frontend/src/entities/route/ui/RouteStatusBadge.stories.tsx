import type { Meta, StoryObj } from '@storybook/react-vite'

import RouteStatusBadge from './RouteStatusBadge'

const meta = {
  title: 'Entities/Route/RouteStatusBadge',
  component: RouteStatusBadge,
  tags: ['autodocs'],
  args: {
    status: 'created',
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['created', 'assigned', 'in-transit', 'completed'],
    },
  },
} satisfies Meta<typeof RouteStatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Created: Story = {}

export const Assigned: Story = {
  args: { status: 'assigned' },
}

export const InTransit: Story = {
  args: { status: 'in-transit' },
}

export const Completed: Story = {
  args: { status: 'completed' },
}
