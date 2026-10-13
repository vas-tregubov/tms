import type { Meta, StoryObj } from '@storybook/react-vite'

import StatusBadge from '@/shared/ui/status-badge'

const meta = {
  title: 'Shared/UI/StatusBadge',
  component: StatusBadge,
  tags: ['autodocs'],
  args: {
    variant: 'neutral',
    children: 'Создан',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['neutral', 'info', 'warning', 'success'],
    },
  },
} satisfies Meta<typeof StatusBadge>

export default meta

type Story = StoryObj<typeof meta>

export const Neutral: Story = {}

export const Info: Story = {
  args: { variant: 'info', children: 'Назначен' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'В пути' },
}

export const Success: Story = {
  args: { variant: 'success', children: 'Завершён' },
}
