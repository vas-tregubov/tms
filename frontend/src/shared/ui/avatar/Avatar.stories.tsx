import type { Meta, StoryObj } from '@storybook/react-vite'

import Avatar from '@/shared/ui/avatar'

const meta = {
  title: 'Shared/UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: {
    initials: 'АП',
  },
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A non-interactive 32px initials avatar matching the Figma master. Pass short, already-prepared initials; the component does not derive them from a name or load images. Initials remain readable text. Parent compositions provide user identity and any interactive behavior.',
      },
    },
  },
} satisfies Meta<typeof Avatar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithName: Story = {
  render: (args) => (
    <div className="inline-flex items-center gap-2">
      <Avatar {...args} />
      <span className="text-sm leading-5 text-foreground">Алексей Петров</span>
    </div>
  ),
}
