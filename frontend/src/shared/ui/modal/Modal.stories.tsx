import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  expect,
  fireEvent,
  fn,
  userEvent,
  waitFor,
  within,
} from 'storybook/test'

import CheckIcon from '@/shared/assets/icons/check.svg?react'
import InfoIcon from '@/shared/assets/icons/info.svg?react'
import LinkIcon from '@/shared/assets/icons/link.svg?react'
import Button from '@/shared/ui/button'
import Modal from '@/shared/ui/modal'

const ModalExample = (args: ComponentProps<typeof Modal>) => {
  const [isOpen, setIsOpen] = useState(args.isOpen)
  const close = () => {
    args.onClose()
    setIsOpen(false)
  }
  return (
    <div className="min-h-[110vh] bg-background p-8 text-foreground">
      <h1 className="mb-4 text-xl font-semibold">Modal playground</h1>
      <p className="mb-4">
        The background stays in place while the dialog is open.
      </p>
      <Button onClick={() => setIsOpen(true)}>Открыть диалог</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={close}
        actions={
          args.actions ?? (
            <>
              <Button variant="secondary" onClick={close}>
                Отмена
              </Button>
              <Button onClick={close}>Подтвердить</Button>
            </>
          )
        }
      />
    </div>
  )
}

const meta = {
  title: 'Shared/UI/Modal',
  component: Modal,
  tags: ['autodocs'],
  render: (args) => <ModalExample {...args} />,
  args: {
    isOpen: false,
    onClose: fn(),
    title: 'Подтвердите действие',
    description: 'Вы уверены, что хотите продолжить?',
    layout: 'default',
    showClose: true,
    closeLabel: 'Закрыть',
  },
  argTypes: {
    children: { control: false },
    actions: { control: false },
    icon: { control: false },
    isOpen: { control: false },
    layout: { control: 'select', options: ['default', 'centered'] },
  },
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    docs: {
      description: {
        component:
          'Controlled native dialog. Open from the trigger to inspect backdrop blur, Escape, keyboard focus, and focus restoration. Pass ready-made Button actions and any decorative icon. The centered layout represents result compositions, without business state. The playground owns isOpen; consumers synchronize isOpen in onClose. SuccessIndicator is intentionally not a dependency.',
      },
    },
  },
} satisfies Meta<typeof Modal>
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Открыть диалог' })
    await userEvent.click(trigger)
    const dialog = canvas.getByRole('dialog', { name: args.title })
    await expect(dialog).toHaveAccessibleDescription(args.description)
    await expect(
      within(dialog).getByRole('button', { name: 'Закрыть' }),
    ).toHaveFocus()
    await userEvent.click(
      within(dialog).getByRole('button', { name: 'Закрыть' }),
    )
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

export const CancelRequest: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Открыть диалог' })
    await userEvent.click(trigger)
    const dialog = canvas.getByRole('dialog')
    // Exercise the controlled handler for the native Escape/cancel request.
    // Native keyboard navigation itself requires real browser key input.
    const event = new Event('cancel', { cancelable: true })
    fireEvent(dialog, event)
    await expect(event.defaultPrevented).toBe(true)
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

export const BackdropAndDrag: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Открыть диалог' })
    await userEvent.click(trigger)
    const dialog = canvas.getByRole('dialog')
    const title = within(dialog).getByRole('heading')
    await userEvent.click(title)
    await expect(args.onClose).not.toHaveBeenCalled()
    await userEvent.pointer([
      { keys: '[MouseLeft>]', target: title },
      { target: dialog, coords: { clientX: 1, clientY: 1 } },
      {
        keys: '[/MouseLeft]',
        target: dialog,
        coords: { clientX: 1, clientY: 1 },
      },
    ])
    await expect(args.onClose).not.toHaveBeenCalled()
    await userEvent.pointer([
      {
        keys: '[MouseLeft>]',
        target: dialog,
        coords: { clientX: 1, clientY: 1 },
      },
      {
        keys: '[/MouseLeft]',
        target: dialog,
        coords: { clientX: 1, clientY: 1 },
      },
    ])
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(args.onClose).toHaveBeenCalledTimes(1)
  },
}

export const Centered: Story = {
  args: {
    layout: 'centered',
    title: 'Действие завершено',
    description: 'Изменения успешно сохранены',
    // Story-only composition demonstrating the generic icon slot.
    icon: (
      <span className="flex size-18 items-center justify-center rounded-full bg-status-completed text-surface">
        <CheckIcon className="size-9" />
      </span>
    ),
    actions: (
      <>
        <Button icon={<LinkIcon className="size-4" />}>
          Открыть результат
        </Button>
        <Button variant="secondary">Вернуться к списку</Button>
      </>
    ),
  },
}

export const OneAction: Story = {
  render: function OneActionExample(args) {
    const [isOpen, setIsOpen] = useState(false)
    const close = () => {
      args.onClose()
      setIsOpen(false)
    }
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть диалог</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={close}
          actions={<Button onClick={close}>Продолжить</Button>}
        />
      </>
    )
  },
  args: {
    layout: 'centered',
    title: 'Операция завершена',
    description: 'Можно продолжить работу',
    showClose: false,
    icon: <InfoIcon className="size-18 text-primary" />,
    actions: <Button>Продолжить</Button>,
  },
}

export const LongContent: Story = {
  args: {
    children: (
      <div className="space-y-4 text-sm leading-5">
        {Array.from({ length: 24 }, (_, index) => (
          <p key={index}>
            Раздел {index + 1}. Длинное содержимое прокручивается внутри окна.
            Заголовок, кнопка закрытия и действия остаются доступными.
          </p>
        ))}
      </div>
    ),
  },
}

export const WithoutDescription: Story = { args: { description: undefined } }

export const Controlled: Story = {
  render: function ControlledExample(args) {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Открыть диалог</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => {
            args.onClose()
            setIsOpen(false)
          }}
          actions={<Button onClick={() => setIsOpen(false)}>Готово</Button>}
        />
      </>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Открыть диалог' })
    for (let index = 0; index < 2; index += 1) {
      await userEvent.click(trigger)
      await userEvent.click(canvas.getByRole('button', { name: 'Готово' }))
      await waitFor(() => expect(trigger).toHaveFocus())
    }
    await expect(args.onClose).not.toHaveBeenCalled()
  },
}
