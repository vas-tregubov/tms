import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fireEvent, userEvent, within } from 'storybook/test'

import DateInput from '@/shared/ui/date-input'

const meta = {
  title: 'Shared/UI/DateInput',
  component: DateInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
  args: { label: 'Дата отправки', helper: 'Выберите дату отправки' },
  parameters: {
    docs: {
      description: {
        component:
          'Native date input with ISO YYYY-MM-DD values and browser-localized display. The native calendar indicator remains clickable beneath the decorative project Calendar icon. Dates are checked on blur against 1930-01-01–2099-12-31. External errors take priority.',
      },
    },
  },
} satisfies Meta<typeof DateInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByLabelText('Дата отправки')
    for (const value of [
      '2026-10-24',
      '1929-12-31',
      '2100-01-01',
      '20004-10-24',
    ]) {
      input.focus()
      fireEvent.change(input, { target: { value } })
      await expect(
        canvas.queryByText('Введите корректную дату'),
      ).not.toBeInTheDocument()
      await userEvent.tab()
      if (value === '2026-10-24') {
        await expect(input).not.toHaveAttribute('aria-invalid', 'true')
      } else {
        await expect(input).toHaveAttribute('aria-invalid', 'true')
        await expect(input).toHaveAccessibleDescription(
          'Введите корректную дату',
        )
      }
    }
    input.focus()
    fireEvent.change(input, { target: { value: '' } })
    await userEvent.tab()
  },
}
export const Focus: Story = {
  args: { autoFocus: true },
  render: function Render(args) {
    const [value, setValue] = useState('')
    return (
      <DateInput
        {...args}
        value={value}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Дата отправки')
    fireEvent.change(input, { target: { value: '2026-10-24' } })
    await expect(input).toHaveValue('2026-10-24')
    fireEvent.change(input, { target: { value: '' } })
    await expect(input).toHaveValue('')
  },
}
export const Filled: Story = { args: { defaultValue: '2026-10-24' } }
export const Error: Story = {
  args: { defaultValue: '2026-10-24', error: 'Выберите другую дату отправки' },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByLabelText('Дата отправки')
    await expect(input).toHaveAttribute('aria-invalid', 'true')
    await expect(input).toHaveAccessibleDescription(
      'Выберите другую дату отправки',
    )
    await expect(
      within(canvasElement).queryByText('Выберите дату отправки'),
    ).not.toBeInTheDocument()
  },
}
export const Disabled: Story = { args: { disabled: true } }
