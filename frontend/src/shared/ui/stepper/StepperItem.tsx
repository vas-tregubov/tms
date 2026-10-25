import CheckIcon from '@/shared/assets/icons/check.svg?react'

type StepperItemState = 'completed' | 'active' | 'upcoming'

type StepperItemProps = {
  state: StepperItemState
  stepNumber: number
  label: string
  showLeftConnector: boolean
  showRightConnector: boolean
  isLeftConnectorHighlighted: boolean
  isRightConnectorHighlighted: boolean
}

const stateConfig: Record<
  StepperItemState,
  { circleClassName: string; labelClassName: string }
> = {
  completed: {
    circleClassName: 'bg-primary text-surface',
    labelClassName: 'font-normal text-foreground',
  },
  active: {
    circleClassName: 'bg-primary text-surface',
    labelClassName: 'font-medium text-foreground',
  },
  upcoming: {
    circleClassName: 'border border-border bg-surface text-muted',
    labelClassName: 'font-normal text-muted',
  },
}

const getConnectorClassName = (isVisible: boolean, isHighlighted: boolean) => {
  if (!isVisible) {
    return ''
  }

  return isHighlighted ? 'bg-primary' : 'bg-border'
}

const StepperItem = ({
  state,
  stepNumber,
  label,
  showLeftConnector,
  showRightConnector,
  isLeftConnectorHighlighted,
  isRightConnectorHighlighted,
}: StepperItemProps) => {
  const { circleClassName, labelClassName } = stateConfig[state]

  return (
    <li
      aria-current={state === 'active' ? 'step' : undefined}
      className="flex min-w-0 flex-1 flex-col items-center gap-2"
    >
      <div className="flex h-6 w-full items-center" aria-hidden="true">
        <span
          className={`h-0.5 min-w-px flex-1 rounded-[1px] ${getConnectorClassName(showLeftConnector, isLeftConnectorHighlighted)}`}
        />
        <span
          className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs leading-4 font-normal ${circleClassName}`}
        >
          {state === 'completed' ? (
            <CheckIcon className="size-6 shrink-0" />
          ) : (
            stepNumber
          )}
        </span>
        <span
          className={`h-0.5 min-w-px flex-1 rounded-[1px] ${getConnectorClassName(showRightConnector, isRightConnectorHighlighted)}`}
        />
      </div>
      <span
        className={`text-center text-sm leading-5 whitespace-nowrap ${labelClassName}`}
      >
        {label}
      </span>
    </li>
  )
}

export default StepperItem
