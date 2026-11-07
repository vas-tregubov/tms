import { useId, useState } from 'react'

const RouteTimeHelp = () => {
  const id = useId()
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const isOpen = (isHovered || isFocused) && !isDismissed
  return (
    <div
      className="relative self-start"
      onMouseEnter={() => {
        setIsHovered(true)
        setIsDismissed(false)
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type="button"
        aria-label="О временном интервале маршрута"
        aria-describedby={isOpen ? id : undefined}
        className="inline-flex size-6 cursor-help items-center justify-center rounded-full border border-border text-sm text-muted focus-visible:outline-2 focus-visible:outline-primary"
        onFocus={() => {
          setIsFocused(true)
          setIsDismissed(false)
        }}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault()
            setIsDismissed(true)
          }
        }}
      >
        ?
      </button>
      {isOpen && (
        <div
          id={id}
          role="tooltip"
          className="absolute top-full left-0 z-10 w-72 max-w-[calc(100vw-3rem)] rounded-control border border-border bg-surface p-3 text-sm text-foreground shadow-card"
        >
          Временной интервал, в который конечная точка маршрута может принять
          автомобиль.
        </div>
      )}
    </div>
  )
}
export default RouteTimeHelp
