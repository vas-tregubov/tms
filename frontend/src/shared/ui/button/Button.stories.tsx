import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/shared/ui/button'

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Create route',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
}

export const Danger: Story = {
  args: {
    children: 'Delete route',
    variant: 'danger',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}
