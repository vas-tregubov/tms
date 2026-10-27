import type { Meta, StoryObj } from '@storybook/react-vite'

import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'

const meta = {
  title: 'Shared/UI/Loader',
  component: Loader,
  tags: ['autodocs'],
  args: {
    label: 'Загрузка',
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
  },
  decorators: [
    (Story) => (
      <div className="text-foreground">
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A spinner for short loading states: md (24px, default) for standalone or block usage, sm (16px) for buttons and inline usage. Inherits its parent text color. Exposes a status with a screen-reader label and respects reduced motion. The consumer owns loading state, placement, and disabling actions. When placed in Button, use children rather than its decorative aria-hidden icon slot to retain the status semantics.',
      },
    },
  },
} satisfies Meta<typeof Loader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InButton: Story = {
  args: { label: 'Пожалуйста, подождите', size: 'sm' },
  render: (args) => (
    <Button disabled>
      <span className="inline-flex items-center gap-2">
        <Loader {...args} />
        Сохранение
      </span>
    </Button>
  ),
}
