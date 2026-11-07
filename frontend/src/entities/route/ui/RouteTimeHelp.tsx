import { useEffect, useId, useRef, useState } from 'react'

import { createPortal } from 'react-dom'

import InfoIcon from '@/shared/assets/icons/info.svg?react'

const RouteTimeHelp = () => {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const tooltip = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const placeTooltip = () => {
    const rect = trigger.current?.getBoundingClientRect()
    if (rect)
      setPosition({
        top: rect.bottom,
        left: Math.max(12, Math.min(rect.left, window.innerWidth - 300)),
      })
  }
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const isOpen = (isHovered || isFocused) && !isDismissed
  useEffect(() => {
    if (!isOpen) return
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDismissed(true)
    }
    const dismissOnMove = () => setIsDismissed(true)
    document.addEventListener('keydown', dismiss)
    document.addEventListener('scroll', dismissOnMove, true)
    window.addEventListener('resize', dismissOnMove)
    return () => {
      document.removeEventListener('keydown', dismiss)
      document.removeEventListener('scroll', dismissOnMove, true)
      window.removeEventListener('resize', dismissOnMove)
    }
  }, [isOpen])
  return (
    <div
      className="relative inline-flex shrink-0 items-center leading-none"
      onMouseEnter={() => {
        placeTooltip()
        setIsHovered(true)
        setIsDismissed(false)
      }}
      onMouseLeave={(event) => {
        if (
          event.relatedTarget instanceof Node &&
          tooltip.current?.contains(event.relatedTarget)
        )
          return
        setIsHovered(false)
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-label="О временном интервале маршрута"
        aria-describedby={isOpen ? id : undefined}
        className="inline-flex size-6 cursor-help items-center justify-center rounded-full leading-none text-muted focus-visible:outline-2 focus-visible:outline-primary"
        onFocus={() => {
          placeTooltip()
          setIsFocused(true)
          setIsDismissed(false)
        }}
        onBlur={() => setIsFocused(false)}
        onPointerDown={(event) => {
          // Pointer activation must not turn hover into persistent focus.
          if (event.button === 0) event.preventDefault()
        }}
      >
        <InfoIcon aria-hidden="true" className="size-4 shrink-0" />
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={tooltip}
            style={position}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={(event) => {
              if (
                event.relatedTarget instanceof Node &&
                trigger.current?.contains(event.relatedTarget)
              )
                return
              setIsHovered(false)
            }}
            id={id}
            role="tooltip"
            className="fixed z-50 w-72 max-w-[calc(100vw-3rem)] rounded-control border border-border bg-surface p-3 text-sm font-normal whitespace-normal text-foreground shadow-card"
          >
            Временной интервал, в который конечная точка маршрута может принять
            автомобиль.
          </div>,
          document.body,
        )}
    </div>
  )
}
export default RouteTimeHelp
