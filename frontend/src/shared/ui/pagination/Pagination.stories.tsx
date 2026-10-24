import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import ChevronLeftIcon from '@/shared/assets/icons/chevron-left.svg?react'
import ChevronRightIcon from '@/shared/assets/icons/chevron-right.svg?react'
import Pagination from '@/shared/ui/pagination'

const meta = {
  title: 'Shared/UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    currentPage: 1,
    pageCount: 3,
    onPageChange: fn(),
    previousIcon: <ChevronLeftIcon className="size-5" aria-hidden="true" />,
    nextIcon: <ChevronRightIcon className="size-5" aria-hidden="true" />,
  },
  argTypes: {
    previousIcon: { control: false },
    nextIcon: { control: false },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Controlled pagination for a small number of pages. Update currentPage in response to onPageChange. Invalid page counts or current pages render nothing. Chevron icons use the project Icons Library.',
      },
    },
  },
} satisfies Meta<typeof Pagination>

export default meta

type Story = StoryObj<typeof meta>

export const CurrentPage1: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const previous = canvas.getByRole('button', { name: 'Previous page' })

    await expect(canvas.getByRole('button', { name: '1' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(previous).toBeDisabled()
    await userEvent.click(previous)
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}

export const CurrentPage2: Story = {
  args: { currentPage: 2 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByRole('button', { name: '2' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await userEvent.click(canvas.getByRole('button', { name: '3' }))
    await expect(args.onPageChange).toHaveBeenNthCalledWith(1, 3)
    await userEvent.click(canvas.getByRole('button', { name: 'Previous page' }))
    await expect(args.onPageChange).toHaveBeenNthCalledWith(2, 1)
    await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
    await expect(args.onPageChange).toHaveBeenNthCalledWith(3, 3)
  },
}

export const CurrentPage3: Story = {
  args: { currentPage: 3 },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const next = canvas.getByRole('button', { name: 'Next page' })

    await expect(canvas.getByRole('button', { name: '3' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(next).toBeDisabled()
    await userEvent.click(next)
    await expect(args.onPageChange).not.toHaveBeenCalled()
  },
}
