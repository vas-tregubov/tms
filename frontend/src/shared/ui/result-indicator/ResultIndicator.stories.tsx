import type { Meta, StoryObj } from '@storybook/react-vite'

import ResultIndicator from '@/shared/ui/result-indicator'

const meta = {
  title: 'Shared/UI/ResultIndicator',
  component: ResultIndicator,
  tags: ['autodocs'],
  args: {
    variant: 'success',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'error'],
    },
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Decorative success or error indicator using the 48px Figma master geometry, existing Check/Close icons, and design tokens. Parent compositions provide the result text and accessibility semantics.',
      },
    },
  },
} satisfies Meta<typeof ResultIndicator>

export default meta

type Story = StoryObj<typeof meta>

export const Success: Story = {}

export const Error: Story = {
  args: { variant: 'error' },
}

export const WithResultText: Story = {
  render: (args) => (
    <div className="flex flex-col items-center gap-5 text-center">
      <ResultIndicator {...args} />
      <div className="space-y-2">
        <h2 className="text-xl leading-7 font-semibold text-foreground">
          Изменения сохранены
        </h2>
        <p className="text-sm leading-5 text-muted">
          Операция успешно завершена
        </p>
      </div>
    </div>
  ),
}
