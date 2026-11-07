import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'

import { useGetTripsQuery } from '@/entities/trip'
import AddIcon from '@/shared/assets/icons/add.svg?react'
import ChevronLeftIcon from '@/shared/assets/icons/chevron-left.svg?react'
import ChevronRightIcon from '@/shared/assets/icons/chevron-right.svg?react'
import Breadcrumbs from '@/shared/ui/breadcrumbs'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import Pagination from '@/shared/ui/pagination'

import { filterTrips } from '../lib/filterTrips'
import TripsFilters from './TripsFilters'
import TripsTable from './TripsTable'

const PAGE_SIZE = 5

const TripsPage = () => {
  const navigate = useNavigate()
  const { data: trips = [], isLoading, isError, refetch } = useGetTripsQuery()
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') ?? ''
  const startDate = searchParams.get('startDate') ?? ''
  const endDate = searchParams.get('endDate') ?? ''
  const status = searchParams.get('status') ?? ''
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const currentPage =
    Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
  const [dateRangeResetKey, setDateRangeResetKey] = useState(0)
  const filters = { search, startDate, endDate, status }
  const filteredTrips = filterTrips(trips, filters)
  const pageCount = Math.ceil(filteredTrips.length / PAGE_SIZE)
  const page = Math.min(currentPage, Math.max(1, pageCount))
  const offset = (page - 1) * PAGE_SIZE
  const visibleTrips = filteredTrips.slice(offset, offset + PAGE_SIZE)

  const updateFilter = (
    name: 'search' | 'startDate' | 'endDate' | 'status',
    value: string,
  ) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (value) next.set(name, value)
        else next.delete(name)
        next.delete('page')
        return next
      },
      { replace: true },
    )
  }

  return (
    <section
      aria-labelledby="trips-title"
      className="flex min-w-0 flex-col gap-5"
    >
      <div className="flex flex-col gap-3">
        <Breadcrumbs
          aria-label="Хлебные крошки"
          items={[
            { id: 'home', label: 'Главная', href: '/' },
            { id: 'trips', label: 'Рейсы' },
          ]}
          renderLink={({ href, ...props }) => <Link {...props} to={href} />}
        />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 id="trips-title" className="text-2xl leading-8 font-semibold">
              Рейсы
            </h1>
            <p className="mt-1 text-sm leading-5 text-muted">
              Реестр рейсов и их текущее состояние
            </p>
          </div>
          <Button
            icon={<AddIcon className="size-5 shrink-0" />}
            onClick={() => navigate('/trips/new')}
          >
            Создать рейс
          </Button>
        </div>
      </div>

      <TripsFilters
        filters={filters}
        dateRangeResetKey={dateRangeResetKey}
        onSearchChange={(value) => updateFilter('search', value)}
        onStartDateChange={(value) => updateFilter('startDate', value)}
        onEndDateChange={(value) => updateFilter('endDate', value)}
        onStatusChange={(value) => updateFilter('status', value)}
        onReset={() => {
          setSearchParams(
            (previous) => {
              const next = new URLSearchParams(previous)
              for (const name of [
                'search',
                'startDate',
                'endDate',
                'status',
                'page',
              ])
                next.delete(name)
              return next
            },
            { replace: true },
          )
          // Remount only on reset to clear DateInput's internal validity messages.
          setDateRangeResetKey((key) => key + 1)
        }}
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <Loader label="Загрузка рейсов" />
        </div>
      ) : isError ? (
        <div className="flex flex-col items-start gap-3">
          <p role="alert">Не удалось загрузить рейсы.</p>
          <Button onClick={() => refetch()}>Попробовать ещё раз</Button>
        </div>
      ) : filteredTrips.length === 0 ? (
        <p role="status" className="py-10 text-center text-sm text-muted">
          {trips.length === 0
            ? 'Рейсов пока нет.'
            : 'По выбранным условиям рейсы не найдены.'}
        </p>
      ) : (
        <>
          <TripsTable trips={visibleTrips} />
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs leading-4 text-muted">
              Показано {offset + 1}–
              {Math.min(offset + PAGE_SIZE, filteredTrips.length)} из{' '}
              {filteredTrips.length} рейсов
            </p>
            <Pagination
              aria-label="Страницы рейсов"
              currentPage={page}
              pageCount={pageCount}
              onPageChange={(nextPage) =>
                setSearchParams(
                  (previous) => {
                    const next = new URLSearchParams(previous)
                    if (nextPage === 1) next.delete('page')
                    else next.set('page', String(nextPage))
                    return next
                  },
                  { replace: true },
                )
              }
              previousIcon={<ChevronLeftIcon className="size-5" />}
              nextIcon={<ChevronRightIcon className="size-5" />}
            />
          </div>
        </>
      )}
    </section>
  )
}

export default TripsPage
