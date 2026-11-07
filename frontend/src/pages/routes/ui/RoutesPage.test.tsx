import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { useGetRoutesQuery, type Route } from '@/entities/route'
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

const paginationRoutes: Route[] = Array.from({ length: 7 }, (_, index) => ({
  id: `pagination-route-${index + 1}`,
  number: `MR-90000${index + 1}`,
  date: index < 2 ? '2026-11-01' : '2026-11-02',
  startPoint: {
    id: 'test-start',
    name: 'Тестовый РЦ',
    address: 'Складская, 1',
  },
  endPoint: { id: 'test-end', name: 'Тестовая точка', address: 'Складская, 2' },
  startTime: '09:00',
  endTime: '10:00',
  status: index < 2 ? 'assigned' : 'created',
}))

const renderPaginationRoutes = () => {
  vi.mocked(useGetRoutesQuery).mockReturnValue({
    data: paginationRoutes,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as ReturnType<typeof useGetRoutesQuery>)
  return renderRoutes()
}

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

it('renders Home as a router link and keeps Routes as the current breadcrumb', () => {
  renderPaginationRoutes()
  const breadcrumbs = within(
    screen.getByRole('navigation', { name: 'Хлебные крошки' }),
  )
  const home = breadcrumbs.getByRole('link', { name: 'Главная' })
  expect(home.getAttribute('href')).toBe('/')
  expect(breadcrumbs.queryByRole('link', { name: 'Маршруты' })).toBeNull()
  expect(breadcrumbs.getByText('Маршруты').getAttribute('aria-current')).toBe(
    'page',
  )

  fireEvent.click(home)

  expect(screen.getByLabelText('Текущий URL').textContent).toBe('/')
})

it('shows five routes on page one and the remaining two on page two', () => {
  renderPaginationRoutes()
  const table = within(screen.getByRole('table', { name: 'Маршруты' }))
  const pagination = within(
    screen.getByRole('navigation', { name: 'Страницы маршрутов' }),
  )
  const next = pagination.getByRole('button', { name: 'Next page' })
  const previous = pagination.getByRole('button', { name: 'Previous page' })

  expect(table.getAllByRole('row')).toHaveLength(6)
  expect(table.getAllByRole('link').map((link) => link.textContent)).toEqual([
    'MR-900001',
    'MR-900002',
    'MR-900003',
    'MR-900004',
    'MR-900005',
  ])
  expect(screen.getByText('Показано 1–5 из 7 маршрутов')).toBeTruthy()
  expect(next.hasAttribute('disabled')).toBe(false)
  expect(previous.hasAttribute('disabled')).toBe(true)

  fireEvent.click(next)

  expect(table.getAllByRole('row')).toHaveLength(3)
  expect(table.getAllByRole('link').map((link) => link.textContent)).toEqual([
    'MR-900006',
    'MR-900007',
  ])
  for (const route of paginationRoutes.slice(0, 5)) {
    expect(table.queryByRole('link', { name: route.number })).toBeNull()
  }
  expect(screen.getByText('Показано 6–7 из 7 маршрутов')).toBeTruthy()
  expect(
    pagination.getByRole('button', { name: '2' }).getAttribute('aria-current'),
  ).toBe('page')
  expect(previous.hasAttribute('disabled')).toBe(false)
  expect(next.hasAttribute('disabled')).toBe(true)

  fireEvent.click(previous)

  expect(screen.getByText('Показано 1–5 из 7 маршрутов')).toBeTruthy()
  expect(table.getAllByRole('link').map((link) => link.textContent)).toEqual([
    'MR-900001',
    'MR-900002',
    'MR-900003',
    'MR-900004',
    'MR-900005',
  ])
})

it.each([
  {
    filter: 'search',
    label: 'Поиск',
    value: 'MR-900001',
    expected: ['MR-900001'],
  },
  {
    filter: 'status',
    label: 'Статус',
    value: 'assigned',
    expected: ['MR-900001', 'MR-900002'],
  },
  {
    filter: 'start date',
    label: 'Начальная дата',
    value: '2026-11-02',
    expected: ['MR-900003', 'MR-900004', 'MR-900005', 'MR-900006', 'MR-900007'],
  },
  {
    filter: 'end date',
    label: 'Конечная дата',
    value: '2026-11-01',
    expected: ['MR-900001', 'MR-900002'],
  },
])(
  'returns to page one when the $filter narrows the result',
  ({ label, value, expected }) => {
    renderPaginationRoutes()
    const pagination = within(
      screen.getByRole('navigation', { name: 'Страницы маршрутов' }),
    )
    fireEvent.click(pagination.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText('Показано 6–7 из 7 маршрутов')).toBeTruthy()

    fireEvent.change(screen.getByLabelText(label), { target: { value } })

    const table = within(screen.getByRole('table', { name: 'Маршруты' }))
    expect(table.getAllByRole('link').map((link) => link.textContent)).toEqual(
      expected,
    )
    expect(table.getAllByRole('row')).toHaveLength(expected.length + 1)
    expect(
      screen.getByText(
        `Показано 1–${expected.length} из ${expected.length} маршрутов`,
      ),
    ).toBeTruthy()
    expect(
      pagination
        .getByRole('button', { name: '1' })
        .getAttribute('aria-current'),
    ).toBe('page')
    expect(
      pagination
        .getByRole('button', { name: 'Previous page' })
        .hasAttribute('disabled'),
    ).toBe(true)
    expect(
      pagination
        .getByRole('button', { name: 'Next page' })
        .hasAttribute('disabled'),
    ).toBe(true)
  },
)

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

it('explains the time interval once in the table header', async () => {
  renderRoutes()
  const table = await screen.findByRole('table', { name: 'Маршруты' })
  const trigger = within(table).getByRole('button', {
    name: 'О временном интервале маршрута',
  })
  expect(trigger.closest('th')?.textContent).toContain('Время')
  fireEvent.focus(trigger)
  expect(screen.getByRole('tooltip').textContent).toBe(
    'Временной интервал, в который конечная точка маршрута может принять автомобиль.',
  )
})
