import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import type { Route } from '@/entities/route'
import LinkIcon from '@/shared/assets/icons/link.svg?react'
import CreateRouteForm from '@/features/create-route'
import Breadcrumbs from '@/shared/ui/breadcrumbs'
import Button from '@/shared/ui/button'
import Modal from '@/shared/ui/modal'
import ResultIndicator from '@/shared/ui/result-indicator'

const CreateRoutePage = () => {
  const navigate = useNavigate()
  const [created, setCreated] = useState<Route | null>(null)
  return (
    <section
      aria-labelledby="create-route-title"
      className="flex min-w-0 flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          aria-label="Хлебные крошки"
          items={[
            { id: 'home', label: 'Главная', href: '/' },
            { id: 'routes', label: 'Маршруты', href: '/routes' },
            { id: 'create', label: 'Создание маршрута' },
          ]}
          renderLink={({ href, ...props }) => <Link {...props} to={href} />}
        />
        <h1
          id="create-route-title"
          className="text-2xl leading-8 font-semibold"
        >
          Создание маршрута
        </h1>
      </div>
      <CreateRouteForm
        onCancel={() => navigate('/routes')}
        onCreated={setCreated}
      />
      <Modal
        isOpen={Boolean(created)}
        onClose={() => navigate('/routes')}
        title="Маршрут сохранён"
        description={`Маршрут ${created?.number ?? ''} успешно создан`}
        icon={<ResultIndicator />}
        layout="centered"
        actions={
          <>
            <Button
              icon={<LinkIcon className="size-4" />}
              onClick={() => {
                if (created)
                  navigate(`/routes/${encodeURIComponent(created.id)}`)
              }}
            >
              Открыть маршрут
            </Button>
            <Button variant="secondary" onClick={() => navigate('/routes')}>
              К списку маршрутов
            </Button>
          </>
        }
      />
    </section>
  )
}
export default CreateRoutePage
