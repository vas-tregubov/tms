import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import EditIcon from '@/shared/assets/icons/edit.svg?react'
import ActionMenu, { ActionMenuItem } from '@/shared/ui/action-menu'

const onSelect = fn()
const onDisabledSelect = fn()

const meta = {
  title: 'Shared/UI/ActionMenu',
  component: ActionMenu,
  tags: ['autodocs'],
  args: {
    label: 'Действия',
    children: (
      <>
        <ActionMenuItem onClick={onSelect}>Посмотреть</ActionMenuItem>
        <ActionMenuItem disabled onClick={onDisabledSelect}>
          Недоступное действие
        </ActionMenuItem>
        <ActionMenuItem
          icon={<EditIcon className="size-5" />}
          onClick={onSelect}
        >
          Редактировать
        </ActionMenuItem>
        <ActionMenuItem destructive onClick={onSelect}>
          Удалить
        </ActionMenuItem>
      </>
    ),
  },
  argTypes: { children: { control: false } },
  decorators: [
    (Story) => (
      <div className="min-h-72 w-[400px] max-w-full bg-background p-6">
        <div className="flex items-center justify-between rounded-control border border-border bg-surface p-3">
          <span className="text-sm text-foreground">Пример записи</span>
          <Story />
        </div>
        <button type="button" className="mt-4 text-sm text-foreground">
          Следующий элемент
        </button>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Generic menu button using the existing IconButton and MoreVertical icon. Native auto popover avoids clipping in scrollable containers. Enabled actions receive focus and support ArrowUp/Down, Home/End, Escape, and Tab. The menu closes on selection, outside click, focus leaving, parent scroll, or viewport resize. Supply ActionMenuItem children; action callbacks belong to the consumer.',
      },
    },
  },
  beforeEach: () => {
    onSelect.mockClear()
    onDisabledSelect.mockClear()
  },
} satisfies Meta<typeof ActionMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Actions: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Действия' })
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const menu = canvas.getByRole('menu', { name: 'Действия' })
    const first = within(menu).getByRole('menuitem', { name: 'Посмотреть' })
    const disabled = within(menu).getByRole('menuitem', {
      name: 'Недоступное действие',
    })
    await expect(first).toHaveFocus()
    await userEvent.click(disabled)
    await expect(onDisabledSelect).not.toHaveBeenCalled()
    await expect(menu).toBeVisible()
    await userEvent.click(first)
    await expect(onSelect).toHaveBeenCalledTimes(1)
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    )
    await expect(trigger).toHaveFocus()
    await userEvent.click(trigger)
    await userEvent.click(trigger)
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    )
  },
}

export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Действия' })
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    const menu = canvas.getByRole('menu')
    const first = within(menu).getByRole('menuitem', { name: 'Посмотреть' })
    const edit = within(menu).getByRole('menuitem', { name: 'Редактировать' })
    const last = within(menu).getByRole('menuitem', { name: 'Удалить' })
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(edit).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{End}')
    await expect(last).toHaveFocus()
    await userEvent.keyboard('{ArrowDown}')
    await expect(first).toHaveFocus()
    await userEvent.keyboard('{Home}{Escape}')
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    )
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{ArrowUp}')
    await expect(last).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(trigger).toHaveAttribute('aria-expanded', 'false'),
    )
  },
}
