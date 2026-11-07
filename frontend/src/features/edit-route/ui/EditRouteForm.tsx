import { useEffect, useRef, useState } from 'react'

import {
  ROUTE_FORM_STEPS,
  getRouteFormChanges,
  ROUTE_STATUS_OPTIONS,
  RouteFormFields,
  useGetRoutePointsQuery,
  useUpdateRouteMutation,
  validateRouteFormStep,
  type Route,
  type RouteFormErrors,
  type RouteFormValues,
} from '@/entities/route'
import ArrowLeftIcon from '@/shared/assets/icons/arrow-left.svg?react'
import ArrowRightIcon from '@/shared/assets/icons/arrow-right.svg?react'
import SaveIcon from '@/shared/assets/icons/save.svg?react'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import Select from '@/shared/ui/select'
import StatusBadge from '@/shared/ui/status-badge'
import Stepper from '@/shared/ui/stepper'

type EditRouteFormProps = {
  route: Route
  onCancel: () => void
  onSaved: (route: Route) => void
}
const descriptions = [
  'Измените основные данные маршрута',
  'Укажите точку отправления и точку назначения маршрута',
  'Укажите время выполнения маршрута и особые условия',
  'Проверьте изменения и сохраните маршрут',
]

const EditRouteForm = ({ route, onCancel, onSaved }: EditRouteFormProps) => {
  const [draft, setDraft] = useState<RouteFormValues>(() => ({
    date: route.date,
    startPointId: route.startPoint.id,
    endPointId: route.endPoint.id,
    startTime: route.startTime,
    endTime: route.endTime,
    comment: route.comment ?? '',
  }))
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<RouteFormErrors>({})
  const [selectionError, setSelectionError] = useState('')
  const pointsQuery = useGetRoutePointsQuery()
  const [updateRoute, mutation] = useUpdateRouteMutation()
  const pending = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const focusError = useRef(false)
  const points = Array.from(
    new Map(
      [route.startPoint, route.endPoint, ...(pointsQuery.data ?? [])].map(
        (point) => [point.id, point],
      ),
    ).values(),
  )
  const status = ROUTE_STATUS_OPTIONS.find(
    (option) => option.value === route.status,
  )

  useEffect(() => {
    if (focusError.current) {
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      focusError.current = false
    }
  }, [errors])
  useEffect(() => {
    if (mutation.data) onSaved(mutation.data)
  }, [mutation.data, onSaved])

  const goToStep = (next: number) => {
    setStep(next)
    setErrors({})
    setSelectionError('')
    heading.current?.focus()
  }
  const submit = async () => {
    if (pending.current || mutation.isLoading) return
    const invalid = validateRouteFormStep(draft, step)
    if (Object.keys(invalid).length) {
      focusError.current = true
      setErrors(invalid)
      return
    }
    if (step < ROUTE_FORM_STEPS.length) {
      goToStep(step + 1)
      return
    }
    for (let previous = 1; previous < ROUTE_FORM_STEPS.length; previous++) {
      const invalid = validateRouteFormStep(draft, previous)
      if (Object.keys(invalid).length) {
        focusError.current = true
        setStep(previous)
        setErrors(invalid)
        return
      }
    }
    const changes = getRouteFormChanges(draft, points)
    if (!changes) {
      goToStep(2)
      setSelectionError(
        'Не удалось найти выбранные точки. Выберите их ещё раз.',
      )
      return
    }
    pending.current = true
    try {
      await updateRoute({ id: route.id, changes }).unwrap()
    } catch {
      // Render the mutation error below, retaining this session's draft.
    } finally {
      pending.current = false
    }
  }
  return (
    <>
      <p className="-mt-4 text-sm leading-5 text-muted">
        {descriptions[step - 1]}
      </p>
      <div className="rounded-card border border-border bg-surface p-5">
        <Stepper items={ROUTE_FORM_STEPS} currentStep={step} />
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
          {step === ROUTE_FORM_STEPS.length
            ? 'Проверка изменений'
            : ROUTE_FORM_STEPS[step - 1]}
        </h2>
        <div className="flex flex-col gap-5 px-5 pb-5">
          <RouteFormFields
            step={step}
            draft={draft}
            errors={errors}
            points={points.map((point) => ({
              value: point.id,
              label: point.name,
            }))}
            disabled={mutation.isLoading}
            onChange={(field, value) => {
              if (mutation.isError) mutation.reset()
              setDraft((previous) => ({ ...previous, [field]: value }))
              setErrors((previous) => ({ ...previous, [field]: undefined }))
            }}
            onBlur={(field) =>
              setErrors((previous) => ({
                ...previous,
                [field]: validateRouteFormStep(draft, step)[field],
              }))
            }
            statusControl={
              <Select label="Статус" value={route.status} disabled>
                <option value={route.status}>
                  {status?.label ?? route.status}
                </option>
              </Select>
            }
            statusContent={
              status ? (
                <StatusBadge status={status.value}>{status.label}</StatusBadge>
              ) : (
                route.status
              )
            }
          />
          {pointsQuery.isLoading && step === 2 && (
            <Loader label="Загрузка точек" />
          )}
          {pointsQuery.isError && step === 2 && (
            <div role="alert">
              Не удалось загрузить список точек.{' '}
              <Button onClick={() => pointsQuery.refetch()}>Повторить</Button>
            </div>
          )}
          {(selectionError || mutation.isError) && (
            <p role="alert" className="text-sm text-danger">
              {selectionError ||
                'Не удалось сохранить изменения. Попробуйте ещё раз.'}
            </p>
          )}
          <div className="flex justify-between border-t border-border pt-5">
            <Button
              variant="secondary"
              disabled={mutation.isLoading}
              icon={step > 1 ? <ArrowLeftIcon className="size-4" /> : undefined}
              onClick={() => {
                if (step === 1) onCancel()
                else goToStep(step - 1)
              }}
            >
              {step === 1 ? 'Отмена' : 'Назад'}
            </Button>
            <Button
              type="submit"
              disabled={mutation.isLoading}
              icon={
                mutation.isLoading ? undefined : step ===
                  ROUTE_FORM_STEPS.length ? (
                  <SaveIcon className="size-4" />
                ) : (
                  <ArrowRightIcon className="size-4" />
                )
              }
              iconPosition={step === ROUTE_FORM_STEPS.length ? 'left' : 'right'}
            >
              {mutation.isLoading ? (
                <>
                  <Loader size="sm" label="Сохранение изменений" />
                  Сохранение…
                </>
              ) : step === ROUTE_FORM_STEPS.length ? (
                'Сохранить изменения'
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
export default EditRouteForm
