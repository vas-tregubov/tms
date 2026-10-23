import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import TextLink from '@/shared/ui/text-link'

const meta = {
  title: 'Shared/UI/TextLink',
  component: TextLink,
  tags: ['autodocs'],
  args: {
    children: 'Войти',
    href: '#sign-in',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A native navigation link. Hover to inspect the underline and use Tab to inspect focus. Disabled links have no href, are excluded from the Tab order and do not call onClick.',
      },
    },
  },
} satisfies Meta<typeof TextLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hover: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Move the pointer over the link to inspect its real hover state.',
      },
    },
  },
}

export const Focus: Story = {
  play: async () => {
    await userEvent.tab()
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    tabIndex: 0,
    'aria-disabled': false,
    onClick: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const link = canvas.getByRole('link', { name: 'Войти' })

    await expect(link).not.toHaveAttribute('href')
    await expect(link).toHaveAttribute('aria-disabled', 'true')
    await expect(link).toHaveAttribute('tabindex', '-1')
    await userEvent.click(link)
    await expect(args.onClick).not.toHaveBeenCalled()
  },
}
