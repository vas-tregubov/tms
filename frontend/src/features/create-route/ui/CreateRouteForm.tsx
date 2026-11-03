import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  useCreateRouteMutation,
  useGetRoutePointsQuery,
  type Route,
} from '@/entities/route'
import ArrowLeftIcon from '@/shared/assets/icons/arrow-left.svg?react'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right.svg?react'
import SaveIcon from '@/shared/assets/icons/save.svg?react'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import Stepper from '@/shared/ui/stepper'

import { validateStep, type DraftErrors } from '../lib/validation'
import {
  resetCreateRoute,
  setStep,
  updateDraft,
  type CreateRouteState,
  type RouteDraft,
} from '../model/createRouteSlice'
import RouteFormFields from './RouteFormFields'

const steps = [
  'Основные данные',
  'Точки маршрута',
  'Время и условия',
  'Проверка и сохранение',
]
const descriptions = [
  'Заполните основные данные маршрута',
  'Укажите точку отправления и точку назначения маршрута',
  'Укажите время выполнения маршрута и особые условия',
  'Проверьте введённые данные и сохраните маршрут',
]
type CreateRouteFormProps = {
  onCancel: () => void
  onCreated: (route: Route) => void
}

const CreateRouteForm = ({ onCancel, onCreated }: CreateRouteFormProps) => {
  const dispatch = useDispatch()
  const { draft, currentStep } = useSelector(
    (state: { createRoute: CreateRouteState }) => state.createRoute,
  )
  const points = useGetRoutePointsQuery()
  const [createRoute, mutation] = useCreateRouteMutation({
    fixedCacheKey: 'create-route',
  })
  const [errors, setErrors] = useState<DraftErrors>({})
  const [submitError, setSubmitError] = useState('')
  const { data: createdRoute, reset: resetMutation } = mutation
  const isSubmitting = mutation.isLoading
  const pending = useRef(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const form = useRef<HTMLFormElement>(null)
  const shouldFocusError = useRef(false)
  useEffect(() => {
    if (shouldFocusError.current) {
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      shouldFocusError.current = false
    }
  }, [errors])

  useEffect(() => {
    if (createdRoute) {
      dispatch(resetCreateRoute())
      onCreated(createdRoute)
      resetMutation()
    }
  }, [createdRoute, resetMutation, dispatch, onCreated])

  const goToStep = (step: number) => {
    dispatch(setStep(step))
    setErrors({})
    setSubmitError('')
    heading.current?.focus()
  }
  const submit = async () => {
    if (pending.current || isSubmitting) return
    const nextErrors = validateStep(draft, currentStep)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      shouldFocusError.current = true
      return
    }
    if (currentStep < 4) {
      goToStep(currentStep + 1)
      return
    }
    for (let step = 1; step <= 3; step++) {
      const invalid = validateStep(draft, step)
      if (Object.keys(invalid).length) {
        shouldFocusError.current = true
        dispatch(setStep(step))
        setErrors(invalid)
        return
      }
    }
    const startPoint = points.data?.find(
      (point) => point.id === draft.startPointId,
    )
    const endPoint = points.data?.find((point) => point.id === draft.endPointId)
    if (!startPoint || !endPoint) {
      goToStep(2)
      setSubmitError('Не удалось найти выбранные точки. Выберите их ещё раз.')
      return
    }
    pending.current = true
    setSubmitError('')
    try {
      await createRoute({
        date: draft.date,
        startPoint,
        endPoint,
        startTime: draft.startTime,
        endTime: draft.endTime,
        comment: draft.comment || undefined,
      }).unwrap()
    } catch {
      // The shared mutation result renders errors even after remounting.
    } finally {
      pending.current = false
    }
  }
  return (
    <>
      <p className="-mt-4 text-sm leading-5 text-muted">
        {descriptions[currentStep - 1]}
      </p>
      <div className="rounded-card border border-border bg-surface p-5">
        <Stepper items={steps} currentStep={currentStep} />
      </div>
      <form
        ref={form}
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
          void submit()
        }}
        className="rounded-card border border-border bg-surface shadow-card"
      >
        <h2
          ref={heading}
          tabIndex={-1}
          className="p-5 text-base leading-6 font-semibold focus:outline-none"
        >
          {currentStep === 4
            ? 'Проверка данных маршрута'
            : steps[currentStep - 1]}
        </h2>
        <div className="flex flex-col gap-5 px-5 pb-5">
          {points.isLoading && currentStep === 2 ? (
            <Loader label="Загрузка точек" />
          ) : (
            <RouteFormFields
              step={currentStep}
              draft={draft}
              errors={errors}
              points={(points.data ?? []).map((point) => ({
                value: point.id,
                label: point.name,
              }))}
              disabled={isSubmitting}
              onChange={(field: keyof RouteDraft, value: string) => {
                dispatch(updateDraft({ [field]: value }))
                setErrors((previous) => ({ ...previous, [field]: undefined }))
              }}
              onBlur={(field) =>
                setErrors((previous) => ({
                  ...previous,
                  [field]: validateStep(draft, currentStep)[field],
                }))
              }
            />
          )}
          {points.isError && currentStep === 2 && (
            <div role="alert">
              Не удалось загрузить точки.{' '}
              <Button onClick={() => points.refetch()}>Повторить</Button>
            </div>
          )}
          {(submitError || mutation.isError) && (
            <p role="alert" className="text-sm text-danger">
              {submitError ||
                'Не удалось сохранить маршрут. Попробуйте ещё раз.'}
            </p>
          )}
          <div className="flex justify-between border-t border-border pt-5">
            <Button
              variant="secondary"
              disabled={isSubmitting}
              icon={
                currentStep > 1 ? (
                  <ArrowLeftIcon className="size-4" />
                ) : undefined
              }
              onClick={() => {
                if (currentStep === 1) {
                  dispatch(resetCreateRoute())
                  onCancel()
                } else goToStep(currentStep - 1)
              }}
            >
              {currentStep === 1 ? 'Отмена' : 'Назад'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (currentStep === 2 && !points.data)}
              icon={
                isSubmitting ? undefined : currentStep === 4 ? (
                  <SaveIcon className="size-4" />
                ) : (
                  <ArrowRightIcon className="size-4" />
                )
              }
              iconPosition={currentStep === 4 ? 'left' : 'right'}
            >
              {isSubmitting ? (
                <>
                  <Loader size="sm" label="Сохранение маршрута" />
                  Сохранение…
                </>
              ) : currentStep === 4 ? (
                'Сохранить маршрут'
              ) : (
                'Далее'
              )}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
export default CreateRouteForm
