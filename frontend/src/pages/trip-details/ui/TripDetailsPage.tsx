import { skipToken } from '@reduxjs/toolkit/query'
import { Link, useLocation, useNavigate, useParams } from 'react-router'

import {
  getTripStatusOption,
  useGetTripByIdQuery,
  useGetTripTimelineQuery,
} from '@/entities/trip'
import EditIcon from '@/shared/assets/icons/edit.svg?react'
import Breadcrumbs from '@/shared/ui/breadcrumbs'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import StatusBadge from '@/shared/ui/status-badge'

import TripRoutes from './TripRoutes'
import TripTimeline from './TripTimeline'
import TripHistory from './TripHistory'

const TripDetailsPage = () => {
  const { tripId } = useParams<{ tripId: string }>()
  const { state } = useLocation()
  const tripsSearch: unknown = state?.tripsSearch
  const tripsUrl = `/trips${typeof tripsSearch === 'string' && tripsSearch.startsWith('?') ? tripsSearch : ''}`
  const navigate = useNavigate()
  const query = useGetTripByIdQuery(tripId ?? skipToken)
  const trip = query.currentData
  const timeline = useGetTripTimelineQuery(trip?.id ?? skipToken)
  if (query.isLoading || (!trip && query.isFetching))
    return <Loader label="Загрузка рейса" />
  if (query.isError || !tripId) {
    const notFound =
      !tripId ||
      (query.error && 'status' in query.error && query.error.status === 404)
    return (
      <div className="flex flex-col items-start gap-3">
        <div role="alert">
          <h1 className="text-2xl leading-8 font-semibold">
            {notFound ? 'Рейс не найден' : 'Не удалось загрузить рейс'}
          </h1>
        </div>
        {notFound ? (
          <Button variant="secondary" onClick={() => navigate(tripsUrl)}>
            К рейсам
          </Button>
        ) : (
          <Button onClick={() => query.refetch()}>Попробовать ещё раз</Button>
        )}
      </div>
    )
  }
  if (!trip) return null
  const status = getTripStatusOption(trip.status)
  const information = [
    ['№ рейса', trip.number],
    ['Дата', trip.date.split('-').reverse().join('.')],
    ['Время начала', trip.startTime],
    ['Время окончания', trip.endTime],
    ['Водитель', trip.driver.fullName],
    [
      'Транспортное средство',
      `${trip.vehicle.registrationNumber} · ${trip.vehicle.type}`,
    ],
    ['Комментарий / особые условия', trip.comment || '—'],
  ]
  return (
    <section
      aria-labelledby="trip-details-title"
      className="flex min-w-0 flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          aria-label="Хлебные крошки"
          items={[
            { id: 'home', label: 'Главная', href: '/' },
            { id: 'trips', label: 'Рейсы', href: tripsUrl },
            { id: trip.id, label: trip.number },
          ]}
          renderLink={({ href, ...props }) => <Link {...props} to={href} />}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1
                id="trip-details-title"
                className="text-2xl leading-8 font-semibold break-words"
              >
                Рейс {trip.number}
              </h1>
              {status ? (
                <StatusBadge status={status.value}>{status.label}</StatusBadge>
              ) : (
                <span className="text-sm">{trip.status}</span>
              )}
            </div>
            <p className="mt-1 text-sm leading-5 text-muted">
              {trip.date.split('-').reverse().join('.')} · Маршрутов:{' '}
              {trip.routes.length}
              {trip.routes.length
                ? ` · ${trip.routes[0].startPoint.name} → ${trip.routes.at(-1)!.endPoint.name}`
                : ''}
            </p>
          </div>
          <Button
            variant="secondary"
            disabled
            icon={<EditIcon className="size-5 shrink-0" />}
          >
            Редактировать
          </Button>
        </div>
      </div>
      <div className="grid min-w-0 grid-cols-2 items-start gap-5">
        <section
          aria-labelledby="trip-info-title"
          className="min-w-0 self-stretch rounded-card border border-border bg-surface shadow-card"
        >
          <h2
            id="trip-info-title"
            className="p-4 text-base leading-6 font-semibold"
          >
            Общая информация
          </h2>
          <dl className="flex flex-col gap-3 px-4 pb-4 text-sm leading-5">
            {information.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[minmax(0,190px)_minmax(0,1fr)] items-start gap-4"
              >
                <dt className="text-muted">{label}</dt>
                <dd className="min-w-0 break-words">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <TripTimeline status={trip.status} query={timeline} />
      </div>
      <section
        aria-labelledby="trip-routes-title"
        className="min-w-0 rounded-card border border-border bg-surface p-4 shadow-card"
      >
        <h2
          id="trip-routes-title"
          className="mb-4 text-base leading-6 font-semibold"
        >
          Маршруты в рейсе
        </h2>
        <TripRoutes routes={trip.routes} />
      </section>
      <section
        aria-labelledby="trip-history-title"
        className="min-w-0 rounded-card border border-border bg-surface p-4 shadow-card"
      >
        <h2
          id="trip-history-title"
          className="mb-4 text-base leading-6 font-semibold"
        >
          История изменений
        </h2>
        <TripHistory query={timeline} />
      </section>
    </section>
  )
}
export default TripDetailsPage
