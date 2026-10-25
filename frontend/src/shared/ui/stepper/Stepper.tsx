import StepperItem from './StepperItem'

type StepperCurrentStep = 1 | 2 | 3 | 4

type StepperProps = {
  currentStep: StepperCurrentStep
}

const STEPPER_LABELS = [
  'Основные данные',
  'Назначение',
  'Водитель и ТС',
  'Проверка и сохранение',
]

const Stepper = ({ currentStep }: StepperProps) => (
  <ol className="flex w-full items-start">
    {STEPPER_LABELS.map((label, index) => {
      const stepNumber = index + 1
      const state =
        stepNumber < currentStep
          ? 'completed'
          : stepNumber === currentStep
            ? 'active'
            : 'upcoming'

      return (
        <StepperItem
          key={label}
          state={state}
          stepNumber={stepNumber}
          label={label}
          showLeftConnector={index > 0}
          showRightConnector={index < STEPPER_LABELS.length - 1}
          isLeftConnectorHighlighted={stepNumber <= currentStep}
          isRightConnectorHighlighted={stepNumber < currentStep}
        />
      )
    })}
  </ol>
)

export default Stepper
