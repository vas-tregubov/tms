import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { useGetTripReferencesQuery, type Trip } from '@/entities/trip'
import CreateTripForm from '@/features/create-trip'
import LinkIcon from '@/shared/assets/icons/link.svg?react'
import Breadcrumbs from '@/shared/ui/breadcrumbs'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import Modal from '@/shared/ui/modal'
import ResultIndicator from '@/shared/ui/result-indicator'

const CreateTripPage = () => {
  const navigate = useNavigate()
  const [created, setCreated] = useState<Trip | null>(null)
  const references = useGetTripReferencesQuery()
  return (
    <section
      aria-labelledby="create-trip-title"
      className="flex min-w-0 flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          aria-label="Хлебные крошки"
          items={[
            { id: 'home', label: 'Главная', href: '/' },
            { id: 'trips', label: 'Рейсы', href: '/trips' },
            { id: 'create', label: 'Создание рейса' },
          ]}
          renderLink={({ href, ...props }) => <Link {...props} to={href} />}
        />
        <div>
          <h1
            id="create-trip-title"
            className="text-2xl leading-8 font-semibold"
          >
            Создание рейса
          </h1>
          <p className="mt-1 text-sm text-muted">
            Соберите рейс из маршрутов и назначьте водителя и ТС
          </p>
        </div>
      </div>
      {references.isLoading ? (
        <Loader label="Загрузка данных для создания рейса" />
      ) : references.isError || !references.data ? (
        <div role="alert">
          Не удалось загрузить водителей и транспорт.{' '}
          <Button onClick={() => references.refetch()}>Повторить</Button>
        </div>
      ) : (
        <CreateTripForm
          drivers={references.data.drivers}
          vehicles={references.data.vehicles}
          onCreated={setCreated}
          onCancel={() => navigate('/trips')}
          onViewRoute={(id) => {
            window.open(
              `/routes/${encodeURIComponent(id)}`,
              '_blank',
              'noopener,noreferrer',
            )
          }}
        />
      )}
      <Modal
        isOpen={Boolean(created)}
        onClose={() => navigate('/trips')}
        title="Рейс сохранён"
        description={`Рейс ${created?.number ?? ''} успешно создан`}
        layout="centered"
        icon={<ResultIndicator />}
        actions={
          <>
            <Button
              icon={<LinkIcon className="size-4" />}
              onClick={() => {
                if (created)
                  navigate(`/trips/${encodeURIComponent(created.id)}`)
              }}
            >
              Открыть рейс
            </Button>
            <Button variant="secondary" onClick={() => navigate('/trips')}>
              К списку рейсов
            </Button>
          </>
        }
      />
    </section>
  )
}
export default CreateTripPage
