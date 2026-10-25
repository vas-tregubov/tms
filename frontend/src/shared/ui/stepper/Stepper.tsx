import StepperItem from './StepperItem'

type StepperProps = {
  currentStep: number
  items: string[]
}

const Stepper = ({ currentStep, items }: StepperProps) => (
  <ol className="flex w-full items-start">
    {items.map((label, index) => {
      const stepNumber = index + 1
      const state =
        stepNumber < currentStep
          ? 'completed'
          : stepNumber === currentStep
            ? 'active'
            : 'upcoming'

      return (
        <StepperItem
          key={index}
          state={state}
          stepNumber={stepNumber}
          label={label}
          showLeftConnector={index > 0}
          showRightConnector={index < items.length - 1}
          isLeftConnectorHighlighted={stepNumber <= currentStep}
          isRightConnectorHighlighted={stepNumber < currentStep}
        />
      )
    })}
  </ol>
)

export default Stepper
