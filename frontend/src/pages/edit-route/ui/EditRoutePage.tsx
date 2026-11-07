import { useState } from 'react'

import { skipToken } from '@reduxjs/toolkit/query'
import { Link, useLocation, useNavigate, useParams } from 'react-router'

import { useGetRouteByIdQuery, type Route } from '@/entities/route'
import LinkIcon from '@/shared/assets/icons/link.svg?react'
import Modal from '@/shared/ui/modal'
import ResultIndicator from '@/shared/ui/result-indicator'
import EditRouteForm from '@/features/edit-route'
import Breadcrumbs from '@/shared/ui/breadcrumbs'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'

const EditRoutePage = () => {
  const { routeId } = useParams<{ routeId: string }>()
  const navigate = useNavigate()
  const { state } = useLocation()
  const routesSearch: unknown = state?.routesSearch
  const routesUrl = `/routes${typeof routesSearch === 'string' && routesSearch.startsWith('?') ? routesSearch : ''}`
  const [saved, setSaved] = useState<Route | null>(null)
  const query = useGetRouteByIdQuery(routeId ?? skipToken)
  const route = query.currentData
  if (!route) {
    if (query.isLoading || query.isFetching)
      return <Loader label="Загрузка маршрута" />
    const notFound =
      !routeId ||
      (query.error && 'status' in query.error && query.error.status === 404)
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
          <Button onClick={() => query.refetch()}>Попробовать ещё раз</Button>
        )}
      </div>
    )
  }
  if (route.status === 'completed')
    return (
      <div className="flex flex-col items-start gap-3">
        <h1 className="text-2xl leading-8 font-semibold">
          Завершённый маршрут нельзя редактировать
        </h1>
        <Button
          variant="secondary"
          onClick={() =>
            navigate(`/routes/${encodeURIComponent(route.id)}`, {
              state: { routesSearch },
            })
          }
        >
          Открыть маршрут
        </Button>
      </div>
    )
  const detailsUrl = `/routes/${encodeURIComponent(route.id)}`
  return (
    <section
      aria-labelledby="edit-route-title"
      className="flex min-w-0 flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          aria-label="Хлебные крошки"
          items={[
            { id: 'home', label: 'Главная', href: '/' },
            { id: 'routes', label: 'Маршруты', href: routesUrl },
            { id: route.id, label: route.number, href: detailsUrl },
            { id: 'edit', label: 'Редактирование маршрута' },
          ]}
          renderLink={({ href, ...props }) => (
            <Link {...props} to={href} state={{ routesSearch }} />
          )}
        />
        <h1 id="edit-route-title" className="text-2xl leading-8 font-semibold">
          Редактирование маршрута {route.number}
        </h1>
      </div>
      {query.isError && (
        <p role="alert" className="text-sm text-danger">
          Не удалось обновить данные маршрута. Ваши изменения остались в форме.{' '}
          <Button onClick={() => query.refetch()}>Повторить загрузку</Button>
        </p>
      )}
      <EditRouteForm
        key={route.id}
        route={route}
        onCancel={() => navigate(detailsUrl, { state: { routesSearch } })}
        onSaved={setSaved}
      />
      <Modal
        isOpen={Boolean(saved)}
        onClose={() => navigate(routesUrl)}
        title="Изменения сохранены"
        description={`Маршрут ${saved?.number ?? ''} успешно обновлён.`}
        icon={<ResultIndicator />}
        layout="centered"
        actions={
          <>
            <Button
              icon={<LinkIcon className="size-4" />}
              onClick={() => navigate(detailsUrl, { state: { routesSearch } })}
            >
              Открыть маршрут
            </Button>
            <Button variant="secondary" onClick={() => navigate(routesUrl)}>
              К списку маршрутов
            </Button>
          </>
        }
      />
    </section>
  )
}
export default EditRoutePage
