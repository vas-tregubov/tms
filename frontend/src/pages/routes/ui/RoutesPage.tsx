import { useState } from 'react'
import { Link, useNavigate } from 'react-router'

import { useGetRoutesQuery } from '@/entities/route'
import AddIcon from '@/shared/assets/icons/add.svg?react'
import ChevronLeftIcon from '@/shared/assets/icons/chevron-left.svg?react'
import ChevronRightIcon from '@/shared/assets/icons/chevron-right.svg?react'
import Breadcrumbs from '@/shared/ui/breadcrumbs'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import Pagination from '@/shared/ui/pagination'

import { filterRoutes } from '../lib/filterRoutes'
import RoutesFilters from './RoutesFilters'
import RoutesTable from './RoutesTable'

const PAGE_SIZE = 5

const RoutesPage = () => {
  const navigate = useNavigate()
  const { data: routes = [], isLoading, isError, refetch } = useGetRoutesQuery()
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRangeResetKey, setDateRangeResetKey] = useState(0)
  const filters = { search, startDate, endDate, status }
  const filteredRoutes = filterRoutes(routes, filters)
  const pageCount = Math.ceil(filteredRoutes.length / PAGE_SIZE)
  const page = Math.min(currentPage, Math.max(1, pageCount))
  const offset = (page - 1) * PAGE_SIZE
  const visibleRoutes = filteredRoutes.slice(offset, offset + PAGE_SIZE)

  return (
    <section
      aria-labelledby="routes-title"
      className="flex min-w-0 flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          aria-label="Хлебные крошки"
          items={[
            { id: 'home', label: 'Главная', href: '/' },
            { id: 'routes', label: 'Маршруты' },
          ]}
          renderLink={({ href, ...props }) => <Link {...props} to={href} />}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 id="routes-title" className="text-2xl leading-8 font-semibold">
              Маршруты
            </h1>
            <p className="mt-1 text-sm leading-5 text-muted">
              Реестр маршрутов и их текущее состояние
            </p>
          </div>
          <Button
            icon={<AddIcon className="size-4" />}
            onClick={() => navigate('/routes/new')}
          >
            Создать маршрут
          </Button>
        </div>
      </div>

      <RoutesFilters
        filters={filters}
        dateRangeResetKey={dateRangeResetKey}
        onSearchChange={(value) => {
          setSearch(value)
          setCurrentPage(1)
        }}
        onStartDateChange={(value) => {
          setStartDate(value)
          setCurrentPage(1)
        }}
        onEndDateChange={(value) => {
          setEndDate(value)
          setCurrentPage(1)
        }}
        onStatusChange={(value) => {
          setStatus(value)
          setCurrentPage(1)
        }}
        onReset={() => {
          setSearch('')
          setStartDate('')
          setEndDate('')
          setStatus('')
          setCurrentPage(1)
          // Remount only on reset to clear DateInput's internal validity messages.
          setDateRangeResetKey((key) => key + 1)
        }}
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader label="Загрузка маршрутов" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-start gap-3">
          <p role="alert">Не удалось загрузить маршруты.</p>
          <Button onClick={() => refetch()}>Попробовать ещё раз</Button>
        </div>
      ) : filteredRoutes.length === 0 ? (
        <p role="status" className="py-10 text-center text-sm text-muted">
          {routes.length === 0
            ? 'Маршрутов пока нет.'
            : 'По выбранным условиям маршруты не найдены.'}
        </p>
      ) : (
        <>
          <RoutesTable routes={visibleRoutes} />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs leading-4 text-muted">
              Показано {offset + 1}–
              {Math.min(offset + PAGE_SIZE, filteredRoutes.length)} из{' '}
              {filteredRoutes.length} маршрутов
            </p>
            <Pagination
              aria-label="Страницы маршрутов"
              currentPage={page}
              pageCount={pageCount}
              onPageChange={setCurrentPage}
              previousIcon={<ChevronLeftIcon className="size-5" />}
              nextIcon={<ChevronRightIcon className="size-5" />}
            />
          </div>
        </>
      )}
    </section>
  )
}

export default RoutesPage
