import { skipToken } from '@reduxjs/toolkit/query'
import { Link, useLocation, useNavigate, useParams } from 'react-router'

import {
  ROUTE_STATUS_OPTIONS,
  useGetRouteByIdQuery,
  useGetRouteTimelineQuery,
} from '@/entities/route'
import EditIcon from '@/shared/assets/icons/edit.svg?react'
import Breadcrumbs from '@/shared/ui/breadcrumbs'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import Select from '@/shared/ui/select'
import StatusBadge from '@/shared/ui/status-badge'
import StatusTimeline, { TimelineItem } from '@/shared/ui/status-timeline'

const RouteDetailsPage = () => {
  const { routeId } = useParams<{ routeId: string }>()
  const navigate = useNavigate()
  const { state } = useLocation()
  const routesSearch: unknown = state?.routesSearch
  const routesUrl = `/routes${typeof routesSearch === 'string' && routesSearch.startsWith('?') ? routesSearch : ''}`
  const {
    currentData: route,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetRouteByIdQuery(routeId ?? skipToken)
  const timeline = useGetRouteTimelineQuery(route?.id ?? skipToken)

  if (isLoading || (!route && isFetching)) {
    return (
      <div className="flex justify-center py-10">
        <Loader label="Загрузка маршрута" />
      </div>
    )
  }

  if (isError || !routeId) {
    const notFound =
      !routeId || (error && 'status' in error && error.status === 404)
    return (
      <div className="flex flex-col items-start gap-3">
        <div role="alert">
          <h1 className="text-2xl leading-8 font-semibold">
            {notFound ? 'Маршрут не найден' : 'Не удалось загрузить маршрут'}
          </h1>
        </div>
        {notFound ? (
          <Button variant="secondary" onClick={() => navigate(routesUrl)}>
            К маршрутам
          </Button>
        ) : (
          <Button onClick={() => refetch()}>Попробовать ещё раз</Button>
        )}
      </div>
    )
  }

  if (!route) return null

  const status = ROUTE_STATUS_OPTIONS.find(
    (option) => option.value === route.status,
  )
  const information = [
    ['№ маршрута', route.number],
    ['Дата', route.date.split('-').reverse().join('.')],
    ['Точка отправления', route.startPoint.name],
    ['Точка назначения', route.endPoint.name],
    ['Время отправления', route.startTime],
    ['Время прибытия', route.endTime],
    ['Комментарий / особые условия', route.comment || '—'],
  ]

  return (
    <section
      aria-labelledby="route-details-title"
      className="flex min-w-0 flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          aria-label="Хлебные крошки"
          items={[
            { id: 'home', label: 'Главная', href: '/' },
            { id: 'routes', label: 'Маршруты', href: routesUrl },
            { id: route.id, label: route.number },
          ]}
          renderLink={({ href, ...props }) => <Link {...props} to={href} />}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h1
                id="route-details-title"
                className="text-2xl leading-8 font-semibold break-words"
              >
                Маршрут {route.number}
              </h1>
              {status ? (
                <StatusBadge status={status.value}>{status.label}</StatusBadge>
              ) : (
                <span className="text-sm">{route.status}</span>
              )}
            </div>
            <p className="mt-1 text-sm leading-5 text-muted">
              {route.startPoint.name} → {route.endPoint.name}
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<EditIcon className="size-4" />}
            onClick={() =>
              navigate(`/routes/${encodeURIComponent(route.id)}/edit`)
            }
          >
            Редактировать
          </Button>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-2 items-start gap-5">
        <section
          aria-labelledby="route-information-title"
          className="min-h-[352px] min-w-0 self-stretch rounded-card border border-border bg-surface shadow-card"
        >
          <h2
            id="route-information-title"
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

        <section
          aria-labelledby="route-status-title"
          className="min-h-[352px] min-w-0 self-stretch rounded-card border border-border bg-surface shadow-card"
        >
          <h2
            id="route-status-title"
            className="p-4 text-base leading-6 font-semibold"
          >
            Статус маршрута
          </h2>
          <div className="flex flex-col gap-4 px-4 pb-4">
            {timeline.isLoading ||
            (!timeline.currentData && timeline.isFetching) ? (
              <Loader label="Загрузка статусов маршрута" />
            ) : timeline.isError ? (
              <div className="flex flex-col items-start gap-2">
                <p role="alert" className="text-sm">
                  Не удалось загрузить статусы маршрута.
                </p>
                <Button variant="secondary" onClick={() => timeline.refetch()}>
                  Повторить загрузку статусов
                </Button>
              </div>
            ) : timeline.currentData?.length ? (
              <StatusTimeline>
                {timeline.currentData.map((item, index, items) => (
                  <TimelineItem
                    key={`${item.status}-${item.dateTime}`}
                    status={
                      ROUTE_STATUS_OPTIONS.find(
                        (option) => option.value === item.status,
                      )?.label ?? item.status
                    }
                    dateTime={item.dateTime}
                    author={item.author}
                    state={item.state}
                    showConnector={index < items.length - 1}
                  />
                ))}
              </StatusTimeline>
            ) : (
              <p className="text-sm text-muted">
                События статуса пока отсутствуют.
              </p>
            )}
            <div className="pt-2">
              <Select
                label="Изменить статус"
                value={route.status}
                disabled
                helper={
                  route.status === 'completed'
                    ? 'Маршрут завершён. Изменение статуса недоступно.'
                    : 'Изменение статуса пока недоступно.'
                }
              >
                <option value={route.status}>
                  {status?.label ?? route.status}
                </option>
              </Select>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

export default RouteDetailsPage
