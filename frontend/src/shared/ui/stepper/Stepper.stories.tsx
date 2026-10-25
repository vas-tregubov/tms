import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import Stepper from '@/shared/ui/stepper'

const meta = {
  title: 'Shared/UI/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    currentStep: 1,
    items: [
      'Основные данные',
      'Назначение',
      'Водитель и ТС',
      'Проверка и сохранение',
    ],
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const [step1, step2, step3, step4] = canvas.getAllByRole('listitem')

    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)

    await expect(step1).toHaveTextContent('Основные данные — завершено')
    await expect(step1).not.toHaveAttribute('aria-current')

    await expect(step2).toHaveTextContent('Назначение — завершено')
    await expect(step2).not.toHaveAttribute('aria-current')

    await expect(step3).toHaveTextContent('Водитель и ТС — текущий шаг')
    await expect(step3).toHaveAttribute('aria-current', 'step')

    await expect(step4).toHaveTextContent('Проверка и сохранение — ожидает')
    await expect(step4).not.toHaveAttribute('aria-current')
  },
}

export const CurrentStep4: Story = {
  args: { currentStep: 4 },
}
