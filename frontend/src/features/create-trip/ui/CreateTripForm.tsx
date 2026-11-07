import { useEffect, useRef, useState } from 'react'

import type { Driver } from '@/entities/driver'
import { useGetRoutesQuery } from '@/entities/route'
import { getTripStatusOption, type Trip } from '@/entities/trip'
import type { Vehicle } from '@/entities/vehicle'
import SaveIcon from '@/shared/assets/icons/save.svg?react'
import Button from '@/shared/ui/button'
import DateInput from '@/shared/ui/date-input'
import Input from '@/shared/ui/input'
import Loader from '@/shared/ui/loader'
import Select from '@/shared/ui/select'

import { useCreateTripMutation } from '../api/createTripApi'
import {
  validateTripDraft,
  type TripDraft,
  type TripDraftErrors,
} from '../lib/validation'
import DraftRoutes from './DraftRoutes'
import RouteSelector from './RouteSelector'

type CreateTripFormProps = {
  drivers: Driver[]
  vehicles: Vehicle[]
  onCreated: (trip: Trip) => void
  onCancel: () => void
  onViewRoute: (id: string) => void
}
const emptyDraft: TripDraft = {
  date: '',
  startTime: '',
  endTime: '',
  routeIds: [],
  driverId: '',
  vehicleId: '',
  comment: '',
}
const CreateTripForm = ({
  drivers,
  vehicles,
  onCreated,
  onCancel,
  onViewRoute,
}: CreateTripFormProps) => {
  const [draft, setDraft] = useState<TripDraft>(emptyDraft)
  const [errors, setErrors] = useState<TripDraftErrors>({})
  const [isSelectorOpen, setIsSelectorOpen] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const routes = useGetRoutesQuery()
  const [createTrip, mutation] = useCreateTripMutation()
  const pending = useRef(false)
  const focusError = useRef(false)
  const form = useRef<HTMLFormElement>(null)
  const initialStatus = getTripStatusOption('assigned')!
  const disabled = mutation.isLoading || isSaved
  const selectedRoutes = draft.routeIds.flatMap(
    (id) => routes.data?.find((route) => route.id === id) ?? [],
  )
  useEffect(() => {
    if (focusError.current) {
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      focusError.current = false
    }
  }, [errors])
  const change = (field: keyof TripDraft, value: string) => {
    if (mutation.isError) mutation.reset()
    setDraft((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
  }
  return (
    <>
      <form
        ref={form}
        noValidate
        className="flex min-w-0 flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault()
          if (pending.current || disabled) return
          const invalid = validateTripDraft(draft)
          focusError.current = Object.keys(invalid).length > 0
          setErrors(invalid)
          if (focusError.current) return
          pending.current = true
          void createTrip({ ...draft, comment: draft.comment || undefined })
            .unwrap()
            .then((trip) => {
              setIsSaved(true)
              onCreated(trip)
            })
            .catch(() => {
              /* Mutation error is rendered below; draft remains intact. */
            })
            .finally(() => {
              pending.current = false
            })
        }}
      >
        <section
          aria-labelledby="trip-basics-title"
          className="rounded-card border border-border bg-surface p-4 shadow-card"
        >
          <h2 id="trip-basics-title" className="mb-4 text-base font-semibold">
            Основные данные
          </h2>
          <div className="grid grid-cols-4 items-start gap-4">
            <DateInput
              label="Дата рейса"
              value={draft.date}
              disabled={disabled}
              error={errors.date}
              onChange={(event) => change('date', event.target.value)}
            />
            <Input
              type="time"
              label="Время начала"
              value={draft.startTime}
              disabled={disabled}
              error={errors.startTime}
              onChange={(event) => change('startTime', event.target.value)}
            />
            <Input
              type="time"
              label="Время окончания"
              value={draft.endTime}
              disabled={disabled}
              error={errors.endTime}
              onChange={(event) => change('endTime', event.target.value)}
            />
            <Select label="Статус" value={initialStatus.value} disabled>
              <option value={initialStatus.value}>{initialStatus.label}</option>
            </Select>
          </div>
        </section>
        <section
          aria-labelledby="draft-routes-title"
          className="min-w-0 rounded-card border border-border bg-surface p-4 shadow-card"
        >
          <h2 id="draft-routes-title" className="mb-4 text-base font-semibold">
            Маршруты в рейсе
          </h2>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Маршрутов: {draft.routeIds.length} · порядок выполнения
            </p>
            <Button
              variant="secondary"
              disabled={disabled}
              onClick={() => setIsSelectorOpen(true)}
              aria-invalid={Boolean(errors.routeIds) || undefined}
              aria-describedby={
                errors.routeIds ? 'trip-routes-error' : undefined
              }
            >
              Добавить маршрут
            </Button>
          </div>
          {routes.isLoading ? (
            <Loader label="Загрузка маршрутов" />
          ) : routes.isError ? (
            <div role="alert">
              Не удалось загрузить маршруты.{' '}
              <Button onClick={() => routes.refetch()}>Повторить</Button>
            </div>
          ) : (
            <DraftRoutes
              routes={selectedRoutes}
              disabled={disabled}
              onView={onViewRoute}
              onRemove={(id) => {
                setDraft((previous) => ({
                  ...previous,
                  routeIds: previous.routeIds.filter((value) => value !== id),
                }))
                if (mutation.isError) mutation.reset()
              }}
            />
          )}
          {errors.routeIds && (
            <p
              id="trip-routes-error"
              role="alert"
              className="mt-2 text-sm text-danger"
            >
              {errors.routeIds}
            </p>
          )}
        </section>
        <section
          aria-labelledby="trip-assignment-title"
          className="rounded-card border border-border bg-surface p-4 shadow-card"
        >
          <h2
            id="trip-assignment-title"
            className="mb-4 text-base font-semibold"
          >
            Назначение
          </h2>
          <div className="grid grid-cols-2 items-start gap-5">
            <Select
              label="Водитель"
              value={draft.driverId}
              disabled={disabled}
              error={errors.driverId}
              onChange={(event) => change('driverId', event.target.value)}
            >
              <option value="">Выберите водителя</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.fullName}
                </option>
              ))}
            </Select>
            <Select
              label="Транспортное средство"
              value={draft.vehicleId}
              disabled={disabled}
              error={errors.vehicleId}
              onChange={(event) => change('vehicleId', event.target.value)}
            >
              <option value="">Выберите транспортное средство</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registrationNumber} · {vehicle.type}
                </option>
              ))}
            </Select>
          </div>
        </section>
        <section className="rounded-card border border-border bg-surface p-4 shadow-card">
          <label
            htmlFor="trip-comment"
            className="mb-4 block text-base font-semibold"
          >
            Комментарий / особые условия
          </label>
          <textarea
            id="trip-comment"
            value={draft.comment}
            disabled={disabled}
            onChange={(event) => change('comment', event.target.value)}
            className="min-h-18 w-full rounded-control border border-border bg-surface p-3 text-sm focus-visible:outline-2 focus-visible:outline-primary disabled:bg-surface-muted"
          />
        </section>
        {mutation.isError && (
          <p role="alert" className="text-sm text-danger">
            {mutation.error && 'message' in mutation.error
              ? mutation.error.message
              : 'Не удалось сохранить рейс. Попробуйте ещё раз.'}
          </p>
        )}
        <div className="flex justify-between border-t border-border pt-4">
          <Button variant="secondary" disabled={disabled} onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="submit"
            disabled={disabled}
            icon={
              mutation.isLoading ? undefined : <SaveIcon className="size-4" />
            }
          >
            {mutation.isLoading ? (
              <>
                <Loader size="sm" label="Сохранение рейса" />
                Сохранение…
              </>
            ) : (
              'Сохранить рейс'
            )}
          </Button>
        </div>
      </form>
      {isSelectorOpen && (
        <RouteSelector
          addedIds={draft.routeIds}
          onClose={() => setIsSelectorOpen(false)}
          onAdd={(ids) => {
            setDraft((previous) => ({
              ...previous,
              routeIds: [...new Set([...previous.routeIds, ...ids])],
            }))
            setErrors((previous) => ({ ...previous, routeIds: undefined }))
            setIsSelectorOpen(false)
          }}
        />
      )}
    </>
  )
}
export default CreateTripForm
