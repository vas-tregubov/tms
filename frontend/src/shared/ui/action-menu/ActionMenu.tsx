import { useEffect, useId, useRef, useState, type ReactNode } from 'react'

import MoreVerticalIcon from '@/shared/assets/icons/more-vertical.svg?react'
import IconButton from '@/shared/ui/icon-button'

type ActionMenuProps = {
  children: ReactNode
  label: string
}

const ActionMenu = ({ children, label }: ActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLSpanElement>(null)
  const focusLastOnOpen = useRef(false)
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const triggerId = useId()

  const getTrigger = () => triggerRef.current?.querySelector('button')
  const getItems = () =>
    Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitem"]:not(:disabled)',
      ) ?? [],
    )

  const close = (restoreFocus = false) => {
    menuRef.current?.hidePopover()
    setIsOpen(false)
    if (restoreFocus) getTrigger()?.focus()
  }

  const positionAndFocus = () => {
    const menu = menuRef.current
    const trigger = getTrigger()
    if (!menu || !trigger) return

    // Position in the top layer so a scrollable table cannot clip the menu.
    const rect = trigger.getBoundingClientRect()
    const { width, height } = menu.getBoundingClientRect()
    const left = Math.max(
      8,
      Math.min(rect.right - width, window.innerWidth - width - 8),
    )
    const below = rect.bottom + 4
    const top =
      below + height <= window.innerHeight - 8
        ? below
        : Math.max(8, rect.top - height - 4)
    menu.style.left = `${left}px`
    menu.style.top = `${top}px`
    const items = getItems()
    const initialItem = focusLastOnOpen.current ? items.at(-1) : items[0]
    focusLastOnOpen.current = false
    initialItem?.focus()
    if (!items.length) menu.focus()
  }

  useEffect(() => {
    if (!isOpen) return
    const menu = menuRef.current
    const dismiss = () => {
      const restoreFocus = menu?.contains(document.activeElement)
      menu?.hidePopover()
      setIsOpen(false)
      if (restoreFocus) {
        triggerRef.current
          ?.querySelector('button')
          ?.focus({ preventScroll: true })
      }
    }
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && menu?.contains(event.target)) return
      dismiss()
    }
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return
      if (
        !menu?.contains(event.target) &&
        !triggerRef.current?.contains(event.target)
      )
        dismiss()
    }
    window.addEventListener('resize', dismiss)
    window.addEventListener('scroll', onScroll, true)
    document.addEventListener('focusin', onFocus)
    return () => {
      window.removeEventListener('resize', dismiss)
      window.removeEventListener('scroll', onScroll, true)
      document.removeEventListener('focusin', onFocus)
    }
  }, [isOpen])

  return (
    <div className="inline-flex">
      <span ref={triggerRef} className="inline-flex">
        <IconButton
          id={triggerId}
          aria-label={label}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          aria-controls={menuId}
          popoverTarget={menuId}
          icon={<MoreVerticalIcon className="size-5" />}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault()
              focusLastOnOpen.current = event.key === 'ArrowUp'
              if (menuRef.current?.matches(':popover-open')) positionAndFocus()
              else menuRef.current?.showPopover()
            }
          }}
        />
      </span>
      <div
        ref={menuRef}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        tabIndex={-1}
        popover="auto"
        className="fixed inset-auto m-0 max-h-[calc(100dvh-1rem)] w-[180px] max-w-[calc(100vw-1rem)] overflow-y-auto overscroll-contain rounded-control border border-border bg-surface p-1 text-foreground shadow-card focus:outline-none"
        onToggle={(event) => {
          const opened = event.currentTarget.matches(':popover-open')
          setIsOpen(opened)
          if (opened) positionAndFocus()
        }}
        onClick={(event) => {
          if (!(event.target instanceof Element)) return
          const item =
            event.target.closest<HTMLButtonElement>('[role="menuitem"]')
          if (item && !item.disabled) close(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            close(true)
            return
          }
          if (event.key === 'Tab') {
            // Let the browser move to the next/previous control from the trigger.
            close(true)
            return
          }
          const items = getItems()
          if (!items.length) return
          const index = items.indexOf(
            document.activeElement as HTMLButtonElement,
          )
          let next: HTMLButtonElement | undefined
          switch (event.key) {
            case 'ArrowDown':
              next = items[(index + 1) % items.length]
              break
            case 'ArrowUp':
              next = items[(index - 1 + items.length) % items.length]
              break
            case 'Home':
              next = items[0]
              break
            case 'End':
              next = items.at(-1)
              break
            default:
              return
          }
          event.preventDefault()
          next?.focus()
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default ActionMenu
