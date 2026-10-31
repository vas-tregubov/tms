import { useEffect, useId, useRef, type ReactNode } from 'react'

import CloseIcon from '@/shared/assets/icons/close.svg?react'
import IconButton from '@/shared/ui/icon-button'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  children?: ReactNode
  actions?: ReactNode
  icon?: ReactNode
  layout?: 'default' | 'centered'
  showClose?: boolean
  closeLabel?: string
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  icon,
  layout = 'default',
  showClose = true,
  closeLabel = 'Закрыть',
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const pointerStartedOutside = useRef(false)
  const titleId = useId()
  const descriptionId = useId()
  const isCentered = layout === 'centered'

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !isOpen) return

    const opener = document.activeElement
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    const previousPadding = root.style.paddingRight
    const scrollbarWidth = window.innerWidth - root.clientWidth

    root.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      root.style.paddingRight = `${parseFloat(getComputedStyle(root).paddingRight) + scrollbarWidth}px`
    }
    dialog.showModal()

    return () => {
      dialog.close()
      root.style.overflow = previousOverflow
      root.style.paddingRight = previousPadding
      pointerStartedOutside.current = false
      if (
        opener instanceof HTMLElement &&
        opener.isConnected &&
        (document.activeElement === document.body ||
          dialog.contains(document.activeElement))
      ) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [isOpen])

  const isOutside = (clientX: number, clientY: number) => {
    const rect = dialogRef.current?.getBoundingClientRect()
    return Boolean(
      rect &&
      (clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom),
    )
  }

  const closeButton = showClose ? (
    <IconButton
      aria-label={closeLabel}
      icon={<CloseIcon className="size-5" />}
      onClick={onClose}
    />
  ) : null

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[480px] max-w-[calc(100%-2rem)] overflow-hidden rounded-card border border-border bg-surface p-0 text-foreground shadow-card backdrop:bg-foreground/40 backdrop:backdrop-blur-sm open:flex open:flex-col"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={() => {
        // Also synchronize native closures, e.g. a composed method="dialog" form.
        if (isOpen && !dialogRef.current?.open) onClose()
      }}
      onPointerDown={(event) => {
        pointerStartedOutside.current =
          event.button === 0 &&
          event.target === event.currentTarget &&
          isOutside(event.clientX, event.clientY)
      }}
      onPointerCancel={() => {
        pointerStartedOutside.current = false
      }}
      onClick={(event) => {
        const shouldClose =
          pointerStartedOutside.current &&
          event.target === event.currentTarget &&
          isOutside(event.clientX, event.clientY)
        pointerStartedOutside.current = false
        if (shouldClose) onClose()
      }}
    >
      <div className="relative flex min-h-0 flex-col gap-5 p-6">
        {isCentered ? (
          showClose && (
            <div className="absolute top-6 right-6">{closeButton}</div>
          )
        ) : (
          <header className="flex min-h-9 shrink-0 items-center gap-3">
            <h2
              id={titleId}
              className="min-w-0 flex-1 text-base leading-6 font-semibold break-words"
            >
              {title}
            </h2>
            {closeButton}
          </header>
        )}
        <div
          className={`min-h-0 overflow-y-auto overscroll-contain ${isCentered ? 'text-center' : ''}`}
        >
          {icon && (
            <div
              aria-hidden="true"
              className={`mb-5 flex ${isCentered ? 'justify-center' : ''}`}
            >
              {icon}
            </div>
          )}
          {isCentered && (
            <h2
              id={titleId}
              className={`text-xl leading-7 font-semibold break-words ${showClose && !icon ? 'px-9' : ''}`}
            >
              {title}
            </h2>
          )}
          {description && (
            <p
              id={descriptionId}
              className={`text-sm leading-5 break-words ${isCentered ? 'mt-2 text-muted' : ''}`}
            >
              {description}
            </p>
          )}
          {children && (
            <div className={description || isCentered ? 'mt-3' : ''}>
              {children}
            </div>
          )}
        </div>
        {actions && (
          <footer
            className={`flex shrink-0 gap-2 ${isCentered ? 'flex-col [&>button]:h-11 [&>button]:w-full' : 'flex-wrap justify-end pt-1'}`}
          >
            {actions}
          </footer>
        )}
      </div>
    </dialog>
  )
}

export default Modal
