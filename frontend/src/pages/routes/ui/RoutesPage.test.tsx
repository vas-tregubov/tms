import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { useGetRoutesQuery } from '@/entities/route'
import { baseApi } from '@/shared/api'

import RoutesPage from './RoutesPage'

vi.mock('@/entities/route', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/route')>()
  return { ...actual, useGetRoutesQuery: vi.fn(actual.useGetRoutesQuery) }
})

const actual =
  await vi.importActual<typeof import('@/entities/route')>('@/entities/route')

const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

const CurrentLocation = () => {
  const { pathname } = useLocation()
  return <output aria-label="Текущий URL">{pathname}</output>
}

const renderRoutes = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/routes']}>
        <RoutesPage />
        <CurrentLocation />
      </MemoryRouter>
    </Provider>,
  )

beforeEach(() => {
  store.dispatch(baseApi.util.resetApiState())
  vi.mocked(useGetRoutesQuery).mockImplementation(actual.useGetRoutesQuery)
})

afterEach(() => {
  vi.clearAllMocks()
})

it('loads route data and displays business numbers', async () => {
  renderRoutes()

  expect(screen.getByText('Загрузка маршрутов')).toBeTruthy()

  const table = await screen.findByRole('table', { name: 'Маршруты' })
  expect(
    within(table).getByRole('columnheader', { name: '№ маршрута' }),
  ).toBeTruthy()
  expect(within(table).getByRole('link', { name: 'MR-000123' })).toBeTruthy()
  const row = within(table).getByRole('row', { name: /MR-000123/ })
  expect(within(row).getByText('РЦ Северный')).toBeTruthy()
  expect(screen.getByText('Показано 1–3 из 3 маршрутов')).toBeTruthy()
  expect(
    screen.getByRole('button', { name: 'Next page' }).hasAttribute('disabled'),
  ).toBe(true)
})

it('searches by business number or point, clears the search and distinguishes no results', async () => {
  renderRoutes()
  await screen.findByRole('table', { name: 'Маршруты' })
  const search = screen.getByRole('searchbox', { name: 'Поиск' })

  fireEvent.change(search, { target: { value: 'mr-000122' } })
  expect(screen.getByRole('link', { name: 'MR-000122' })).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'MR-000123' })).toBeNull()

  fireEvent.click(screen.getByRole('button', { name: 'Очистить поиск' }))
  expect(screen.getByRole('link', { name: 'MR-000123' })).toBeTruthy()

  fireEvent.change(search, { target: { value: 'центральный' } })
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4)

  fireEvent.change(search, { target: { value: 'несуществующая точка' } })
  expect(
    screen.getByText('По выбранным условиям маршруты не найдены.').textContent,
  ).toBe('По выбранным условиям маршруты не найдены.')
  expect(screen.queryByRole('table')).toBeNull()
})

it('combines inclusive date boundaries and the selected status', async () => {
  renderRoutes()
  await screen.findByRole('table', { name: 'Маршруты' })

  fireEvent.change(screen.getByLabelText('Начальная дата'), {
    target: { value: '2026-11-02' },
  })
  fireEvent.change(screen.getByLabelText('Конечная дата'), {
    target: { value: '2026-11-02' },
  })
  expect(screen.getByRole('link', { name: 'MR-000123' })).toBeTruthy()
  expect(screen.getByRole('link', { name: 'MR-000122' })).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'MR-000121' })).toBeNull()

  fireEvent.change(screen.getByRole('combobox', { name: 'Статус' }), {
    target: { value: 'assigned' },
  })
  expect(screen.getByRole('link', { name: 'MR-000123' })).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'MR-000122' })).toBeNull()

  fireEvent.change(screen.getByLabelText('Конечная дата'), {
    target: { value: '2026-11-01' },
  })
  expect(screen.getByRole('alert').textContent).toContain('Начальная дата')
  // An inverted range is ignored; the independent status filter still applies.
  expect(screen.getByRole('link', { name: 'MR-000123' })).toBeTruthy()
})

it('resets all filters, restores the complete result and clears date errors without navigation', async () => {
  renderRoutes()
  await screen.findByRole('table', { name: 'Маршруты' })
  expect(screen.queryByRole('button', { name: 'Сбросить фильтры' })).toBeNull()

  const search = screen.getByRole('searchbox', { name: 'Поиск' })
  fireEvent.change(search, { target: { value: 'mr-000123' } })
  expect(screen.getByRole('button', { name: 'Сбросить фильтры' })).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Начальная дата'), {
    target: { value: '2026-11-02' },
  })
  fireEvent.change(screen.getByLabelText('Конечная дата'), {
    target: { value: '2026-11-01' },
  })
  fireEvent.change(screen.getByRole('combobox', { name: 'Статус' }), {
    target: { value: 'assigned' },
  })
  expect(screen.getByRole('alert')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))

  expect((search as HTMLInputElement).value).toBe('')
  expect(
    (screen.getByLabelText('Начальная дата') as HTMLInputElement).value,
  ).toBe('')
  expect(
    (screen.getByLabelText('Конечная дата') as HTMLInputElement).value,
  ).toBe('')
  expect(
    (screen.getByRole('combobox', { name: 'Статус' }) as HTMLSelectElement)
      .value,
  ).toBe('')
  expect(screen.queryByRole('alert')).toBeNull()
  expect(screen.queryByRole('button', { name: 'Сбросить фильтры' })).toBeNull()
  expect(screen.getByText('Показано 1–3 из 3 маршрутов')).toBeTruthy()
  expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(4)
  expect(screen.getByLabelText('Текущий URL').textContent).toBe('/routes')
})

it('clears DateInput validity messages when resetting filters', async () => {
  renderRoutes()
  await screen.findByRole('table', { name: 'Маршруты' })
  const startDate = screen.getByLabelText('Начальная дата')
  fireEvent.change(startDate, { target: { value: '1900-01-01' } })
  fireEvent.blur(startDate)
  expect(screen.getByText('Введите корректную дату')).toBeTruthy()

  fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))

  expect(screen.queryByText('Введите корректную дату')).toBeNull()
  expect(screen.getByText('Показано 1–3 из 3 маршрутов')).toBeTruthy()
})

it('opens Route Details using the technical ID rather than the displayed number', async () => {
  renderRoutes()
  const link = await screen.findByRole('link', { name: 'MR-000123' })
  expect(link.getAttribute('href')).toBe('/routes/route-001')

  fireEvent.click(link)

  expect(screen.getByLabelText('Текущий URL').textContent).toBe(
    '/routes/route-001',
  )
})

it('shows a retry action when the data-access boundary returns an error', () => {
  const refetch = vi.fn()
  vi.mocked(useGetRoutesQuery).mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: true,
    error: { status: 503, message: 'Источник данных недоступен' },
    refetch,
  } as ReturnType<typeof useGetRoutesQuery>)
  renderRoutes()

  expect(screen.getByRole('alert').textContent).toBe(
    'Не удалось загрузить маршруты.',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }))
  expect(refetch).toHaveBeenCalledTimes(1)
  expect(screen.getByRole('heading', { name: 'Маршруты' })).toBeTruthy()
})

it('shows the initial empty state when the data source returns no routes', () => {
  vi.mocked(useGetRoutesQuery).mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as ReturnType<typeof useGetRoutesQuery>)
  renderRoutes()

  expect(screen.getByText('Маршрутов пока нет.')).toBeTruthy()
  expect(screen.queryByRole('table')).toBeNull()
})
