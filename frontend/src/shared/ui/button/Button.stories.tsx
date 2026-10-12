import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/shared/ui/button'

const meta = {
  title: 'Shared/UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    disabled: false,
    iconPosition: 'left',
  },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary'] },
    iconPosition: { control: 'select', options: ['left', 'right'] },
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Hover and press the button to inspect interaction states. Use Tab to inspect keyboard focus. Icons are supplied by the caller.',
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

const icon = <span className="text-base leading-none">+</span>

export const Primary: Story = {}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const SecondaryDisabled: Story = {
  args: { variant: 'secondary', disabled: true },
}

export const IconLeft: Story = {
  args: { icon, iconPosition: 'left' },
}

export const IconRight: Story = {
  args: { icon, iconPosition: 'right' },
}

export const SecondaryIconLeft: Story = {
  args: { variant: 'secondary', icon, iconPosition: 'left' },
}

export const SecondaryIconRight: Story = {
  args: { variant: 'secondary', icon, iconPosition: 'right' },
}

export const DisabledWithIcon: Story = {
  args: { disabled: true, icon },
}

export const SecondaryDisabledWithIcon: Story = {
  args: { variant: 'secondary', disabled: true, icon },
}
