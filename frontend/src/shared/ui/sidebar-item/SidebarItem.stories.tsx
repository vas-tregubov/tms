import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, within } from 'storybook/test'

import AnalyticsIcon from '@/shared/assets/icons/analytics.svg?react'
import SidebarItem from '@/shared/ui/sidebar-item'

const meta = {
  title: 'Shared/UI/SidebarItem',
  component: SidebarItem,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[527px] max-w-full">
        <Story />
      </div>
    ),
  ],
  args: {
    href: '#example',
    children: 'Главная',
    active: false,
    icon: <AnalyticsIcon className="size-full" aria-hidden="true" />,
  },
  argTypes: {
    icon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native navigation link. Hover and Focus use real browser states. The Analytics icon matches the Figma master.',
      },
    },
  },
} satisfies Meta<typeof SidebarItem>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Главная' })
    await expect(link).not.toHaveAttribute('aria-current')
  },
}

export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Move the pointer over the link to view its native CSS hover state.',
      },
    },
  },
}

export const Active: Story = {
  args: { active: true },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Главная' })
    await expect(link).toHaveAttribute('aria-current', 'page')
  },
}

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Главная' })
    link.focus()
  },
}
