import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, fn, userEvent, within } from 'storybook/test'

import SearchInput from '@/shared/ui/search-input'

const meta = {
  title: 'Shared/UI/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    placeholder: 'Поиск...',
    'aria-label': 'Поиск',
    onChange: fn(),
    onClear: fn(),
  },
  render: function Render(args) {
    const [value, setValue] = useState(args.value)
    return (
      <SearchInput
        {...args}
        value={value}
        onChange={(event) => {
          const nextValue = event.currentTarget.value
          args.onChange(event)
          setValue(nextValue)
        }}
        onClear={() => {
          args.onClear()
          setValue('')
        }}
      />
    )
  },
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Поиск' })
    await userEvent.type(input, 'Тверь')
    await expect(input).toHaveValue('Тверь')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Очистить поиск' }),
    )
    await expect(args.onClear).toHaveBeenCalledTimes(1)
    await expect(input).toHaveValue('')
    await expect(
      canvas.queryByRole('button', { name: 'Очистить поиск' }),
    ).not.toBeInTheDocument()
  },
}
export const Focus: Story = { args: { autoFocus: true } }
export const Filled: Story = {
  args: { value: 'Москва' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('searchbox', { name: 'Поиск' })
    await userEvent.type(input, ' — Тверь')
    await expect(input).toHaveValue('Москва — Тверь')
    await userEvent.click(
      canvas.getByRole('button', { name: 'Очистить поиск' }),
    )
    await expect(args.onClear).toHaveBeenCalledTimes(1)
    await expect(canvas.getByRole('searchbox', { name: 'Поиск' })).toHaveValue(
      '',
    )
    await expect(
      canvas.queryByRole('button', { name: 'Очистить поиск' }),
    ).not.toBeInTheDocument()
  },
}
export const Disabled: Story = {
  args: { disabled: true, value: 'Москва' },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.getByRole('searchbox', { name: 'Поиск' }),
    ).toBeDisabled()
    const clear = canvas.getByRole('button', { name: 'Очистить поиск' })
    await expect(clear).toBeDisabled()
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Поиск' }),
      'Тверь',
    )
    await expect(canvas.getByRole('searchbox', { name: 'Поиск' })).toHaveValue(
      'Москва',
    )
    await userEvent.click(clear)
    await expect(args.onClear).not.toHaveBeenCalled()
  },
}
