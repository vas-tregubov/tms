import type { Meta, StoryObj } from '@storybook/react-vite'

import Stepper from '@/shared/ui/stepper'

const meta = {
  title: 'Shared/UI/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    currentStep: 1,
  },
  argTypes: {
    currentStep: {
      control: 'select',
      options: [1, 2, 3, 4],
    },
  },
} satisfies Meta<typeof Stepper>

export default meta

type Story = StoryObj<typeof meta>

export const CurrentStep1: Story = {}

export const CurrentStep2: Story = {
  args: { currentStep: 2 },
}

export const CurrentStep3: Story = {
  args: { currentStep: 3 },
}

export const CurrentStep4: Story = {
  args: { currentStep: 4 },
}
