import type { Meta, StoryObj } from '@storybook/react-vite'

import MoreVerticalIcon from '@/shared/assets/icons/more-vertical.svg?react'
import IconButton from '@/shared/ui/icon-button'

const meta = {
  title: 'Shared/UI/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: {
    'aria-label': 'More actions',
    icon: <MoreVerticalIcon className="size-5" aria-hidden="true" />,
    variant: 'ghost',
    disabled: false,
  },
  argTypes: {
    variant: { control: 'select', options: ['ghost', 'outline'] },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Hover and press to inspect interaction states. Use Tab to inspect keyboard focus. Supply an icon and an accessible action label.',
      },
    },
  },
} satisfies Meta<typeof IconButton>

export default meta

type Story = StoryObj<typeof meta>

export const Ghost: Story = {}

export const Outline: Story = {
  args: { variant: 'outline' },
}

export const GhostDisabled: Story = {
  args: { disabled: true },
}

export const OutlineDisabled: Story = {
  args: { variant: 'outline', disabled: true },
}
