import { useState } from 'react'

import {
  ROUTE_STATUS_OPTIONS,
  getRouteStatusOption,
  useGetRoutesQuery,
} from '@/entities/route'
import Button from '@/shared/ui/button'
import DateRange from '@/shared/ui/date-range'
import Loader from '@/shared/ui/loader'
import Modal from '@/shared/ui/modal'
import SearchInput from '@/shared/ui/search-input'
import Select from '@/shared/ui/select'
import StatusBadge from '@/shared/ui/status-badge'
import Table, { TableCell, TableRow } from '@/shared/ui/table'

type RouteSelectorProps = {
  addedIds: string[]
  onClose: () => void
  onAdd: (ids: string[]) => void
}
const RouteSelector = ({ addedIds, onClose, onAdd }: RouteSelectorProps) => {
  const query = useGetRoutesQuery()
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [dateRangeResetKey, setDateRangeResetKey] = useState(0)
  const text = search.trim().toLocaleLowerCase('ru-RU')
  const invalidRange = Boolean(startDate && endDate && startDate > endDate)
  const routes = (query.data ?? []).filter(
    (route) =>
      (route.status === 'created' || addedIds.includes(route.id)) &&
      (!text ||
        [route.number, route.startPoint.name, route.endPoint.name].some(
          (value) => value.toLocaleLowerCase('ru-RU').includes(text),
        )) &&
      (!status || route.status === status) &&
      (invalidRange || !startDate || route.date >= startDate) &&
      (invalidRange || !endDate || route.date <= endDate),
  )
  const available = routes.filter(
    (route) => route.status === 'created' && !addedIds.includes(route.id),
  )
  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Добавить маршруты в рейс"
      size="wide"
      actions={
        <div className="flex w-full items-center justify-between gap-3">
          <p className="text-xs text-muted">Выбрано: {selected.length}</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>
              Отмена
            </Button>
            <Button
              disabled={!selected.length || query.isFetching || query.isError}
              onClick={() => {
                if (
                  selected.some(
                    (id) =>
                      !query.data?.some(
                        (route) =>
                          route.id === id && route.status === 'created',
                      ) || addedIds.includes(id),
                  )
                ) {
                  setError('Выбранный маршрут уже недоступен. Проверьте выбор.')
                  return
                }
                onAdd(selected)
              }}
            >
              Добавить в рейс
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-3">
          <fieldset className="min-w-0 flex-1">
            <legend className="mb-1 text-xs text-muted">Дата</legend>
            <DateRange
              key={dateRangeResetKey}
              startInputProps={{
                value: startDate,
                onChange: (event) => setStartDate(event.target.value),
              }}
              endInputProps={{
                value: endDate,
                onChange: (event) => setEndDate(event.target.value),
              }}
            />
          </fieldset>
          <div className="w-56">
            <Select
              label="Статус"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="">Все статусы</option>
              {ROUTE_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="min-w-48 flex-1">
            <label
              htmlFor="route-selector-search"
              className="mb-1 block text-sm font-medium"
            >
              Поиск
            </label>
            <SearchInput
              id="route-selector-search"
              placeholder="Поиск по номеру маршрута или точке"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onClear={() => setSearch('')}
            />
          </div>
        </div>
        {Boolean(search || startDate || endDate || status) && (
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setSearch('')
                setStartDate('')
                setEndDate('')
                setStatus('')
                setDateRangeResetKey((key) => key + 1)
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        )}
        {invalidRange && (
          <p role="alert" className="text-sm text-danger">
            Начальная дата должна быть не позже конечной.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        {query.isLoading ? (
          <Loader label="Загрузка маршрутов" />
        ) : query.isError ? (
          <div role="alert">
            Не удалось загрузить маршруты.{' '}
            <Button onClick={() => query.refetch()}>Повторить</Button>
          </div>
        ) : (
          <>
            <Table aria-label="Выбор маршрутов" className="min-w-[900px]">
              <thead>
                <TableRow>
                  <TableCell header>
                    <input
                      type="checkbox"
                      aria-label="Выбрать все доступные маршруты"
                      checked={
                        available.length > 0 &&
                        available.every((route) => selected.includes(route.id))
                      }
                      disabled={!available.length}
                      onChange={(event) =>
                        setSelected((previous) =>
                          event.target.checked
                            ? [
                                ...new Set([
                                  ...previous,
                                  ...available.map((route) => route.id),
                                ]),
                              ]
                            : previous.filter(
                                (id) =>
                                  !available.some((route) => route.id === id),
                              ),
                        )
                      }
                    />
                  </TableCell>
                  {[
                    '№ маршрута',
                    'Дата',
                    'Точка отправления',
                    'Точка назначения',
                    'Время',
                    'Статус',
                    'Доступность',
                  ].map((label) => (
                    <TableCell header key={label}>
                      <span className="text-xs">{label}</span>
                    </TableCell>
                  ))}
                </TableRow>
              </thead>
              <tbody>
                {routes.map((route) => {
                  const added = addedIds.includes(route.id)
                  const option = getRouteStatusOption(route.status)
                  return (
                    <TableRow key={route.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Выбрать ${route.number}`}
                          disabled={added || route.status !== 'created'}
                          checked={selected.includes(route.id)}
                          onChange={(event) =>
                            setSelected((previous) =>
                              event.target.checked
                                ? [...previous, route.id]
                                : previous.filter((id) => id !== route.id),
                            )
                          }
                          className="size-4 accent-primary"
                        />
                      </TableCell>
                      {[
                        route.number,
                        route.date.split('-').reverse().join('.'),
                        route.startPoint.name,
                        route.endPoint.name,
                        `${route.startTime}–${route.endTime}`,
                      ].map((value, index) => (
                        <TableCell key={index}>
                          <span className="text-xs">{value}</span>
                        </TableCell>
                      ))}
                      <TableCell>
                        {option ? (
                          <StatusBadge status={option.value}>
                            {option.label}
                          </StatusBadge>
                        ) : (
                          route.status
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted">
                          {added ? 'Уже добавлен' : ''}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </tbody>
            </Table>
            {!routes.length && (
              <p role="status" className="text-sm text-muted">
                Маршруты не найдены.
              </p>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
export default RouteSelector
