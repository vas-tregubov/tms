import type { Meta, StoryObj } from '@storybook/react-vite'

import AppLogo from '@/shared/ui/app-logo'

const meta = {
  title: 'Shared/UI/AppLogo',
  component: AppLogo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A non-interactive MVP wordmark: TMS/ in Inter semibold, with foreground text and a primary-blue slash. Uses the Header typography (20px/28px). Renders readable text without extra ARIA, link, or heading semantics. Consumers own layout and any navigation behavior.',
      },
    },
  },
} satisfies Meta<typeof AppLogo>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
