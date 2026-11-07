import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { fn } from 'storybook/test'

import Combobox from './Combobox'

const meta = {
  title: 'Shared/UI/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  args: {
    label: 'Значение',
    value: '',
    onChange: fn(),
    options: [
      { value: 'studio', label: 'Студия' },
      { value: 'design', label: 'Студия дизайна' },
      { value: 'workshop', label: 'Мастерская' },
      { value: 'office', label: 'Офис' },
    ],
  },
  decorators: [
    (Story) => (
      <div className="min-h-80 w-[366px] max-w-full">
        <Story />
      </div>
    ),
  ],
  render: function Render(args) {
    const [, updateArgs] = useArgs()
    return (
      <Combobox
        {...args}
        onChange={(value) => {
          args.onChange(value)
          updateArgs({ value })
        }}
      />
    )
  },
} satisfies Meta<typeof Combobox>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Focus: Story = {
  play: async ({ canvas }) => {
    canvas.getByRole('combobox').focus()
  },
}
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('combobox'))
  },
}
export const Typing: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Студ')
  },
}
export const Results: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Студ')
    await userEvent.keyboard('{ArrowDown}')
  },
}
export const Selected: Story = { args: { value: 'design' } }
export const NoResults: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('combobox'), 'Жжж')
  },
}
export const Error: Story = { args: { error: 'Выберите значение из списка' } }
export const Disabled: Story = { args: { disabled: true } }
