import type { Meta, StoryObj } from '@storybook/react-vite'

import DateRange from '@/shared/ui/date-range'

const meta = {
  title: 'Shared/UI/DateRange',
  component: DateRange,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-96 max-w-full">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Two standalone DateInput components separated by a dash. Each field retains its own Calendar icon, native picker, styling, and date validation. Input props are forwarded independently.',
      },
    },
  },
} satisfies Meta<typeof DateRange>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Focus: Story = { args: { startInputProps: { autoFocus: true } } }
export const Filled: Story = {
  args: {
    startInputProps: { defaultValue: '2026-10-24' },
    endInputProps: { defaultValue: '2026-10-31' },
  },
}
export const Disabled: Story = { args: { disabled: true } }
