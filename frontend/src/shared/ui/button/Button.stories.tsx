import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '@/shared/ui/button/Button'

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

export const Default: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
