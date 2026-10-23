import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import Input from '@/shared/ui/input'

const meta = {
  title: 'Shared/UI/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[527px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Водитель',
    placeholder: 'Введите имя водителя',
    helper: 'Вспомогательный текст',
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { helper: 'Введите имя водителя' },
}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Водитель',
    })
    input.focus()
    await expect(input).toHaveFocus()
  },
}

export const Filled: Story = {
  args: { defaultValue: 'Иван Иванов' },
}

export const Error: Story = {
  args: {
    defaultValue: 'Введите имя водителя',
    error: 'Вспомогательный текст',
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Водитель',
    })
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAttribute('aria-describedby')
    await expect(input).toHaveAccessibleDescription('Вспомогательный текст')
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole('textbox', {
      name: 'Водитель',
    })
    await expect(input).toBeDisabled()
  },
}
