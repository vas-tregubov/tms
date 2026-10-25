import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import ChevronDownIcon from '@/shared/assets/icons/chevron-down.svg?react'
import Select from '@/shared/ui/select'

const meta = {
  title: 'Shared/UI/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[527px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Распределительный центр',
    helper: 'Вспомогательный текст',
    defaultValue: '',
    icon: <ChevronDownIcon className="size-5" aria-hidden="true" />,
    children: (
      <>
        <option value="">Выберите значение</option>
        <option value="moscow">РЦ Москва</option>
        <option value="saint-petersburg">РЦ Санкт-Петербург</option>
        <option value="kazan">РЦ Казань</option>
        <option value="yekaterinburg">РЦ Екатеринбург</option>
      </>
    ),
  },
  argTypes: {
    icon: { control: false },
    children: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Open the select by clicking it or using the platform keyboard shortcut. The native popup is rendered by the browser/OS and differs from the Figma dropdown. The chevron uses the project Icons Library.',
      },
    },
  },
} satisfies Meta<typeof Select>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Focus: Story = {
  args: { autoFocus: true },
}

export const Filled: Story = {
  args: { defaultValue: 'moscow' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', {
      name: 'Распределительный центр',
    })
    await userEvent.selectOptions(select, 'kazan')
    await expect(select).toHaveValue('kazan')
  },
}

export const Error: Story = {
  args: {
    defaultValue: 'moscow',
    error: 'Выберите другой распределительный центр',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', {
      name: 'Распределительный центр',
    })
    await expect(select).toHaveAttribute('aria-invalid', 'true')
    await expect(select).toHaveAttribute('aria-describedby')
    await expect(select).toHaveAccessibleDescription(
      'Выберите другой распределительный центр',
    )
    await expect(
      canvas.queryByText('Вспомогательный текст'),
    ).not.toBeInTheDocument()
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox', {
      name: 'Распределительный центр',
    })
    await expect(select).toBeDisabled()
  },
}
