import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  it,
  vi,
} from 'vitest'

import AppRouter from '@/app/router'
import { store } from '@/app/store'
import { useGetTripsQuery, type Trip } from '@/entities/trip'
import { baseApi } from '@/shared/api'

vi.mock('@/entities/trip', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/trip')>()
  return { ...actual, useGetTripsQuery: vi.fn(actual.useGetTripsQuery) }
})
const actual =
  await vi.importActual<typeof import('@/entities/trip')>('@/entities/trip')
const hidePopover = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'hidePopover',
)
beforeAll(() =>
  Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
    configurable: true,
    value: () => {},
  }),
)
afterAll(() => {
  if (hidePopover)
    Object.defineProperty(HTMLElement.prototype, 'hidePopover', hidePopover)
  else Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover')
})
beforeEach(() => {
  store.dispatch(baseApi.util.resetApiState())
  vi.mocked(useGetTripsQuery).mockImplementation(actual.useGetTripsQuery)
})
afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
})
const Location = () => {
  const { pathname, search } = useLocation()
  return (
    <output aria-label="Текущий URL">
      {pathname}
      {search}
    </output>
  )
}
const renderTrips = (url = '/trips') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <Location />
        <AppRouter />
      </MemoryRouter>
    </Provider>,
  )
const trips: Trip[] = Array.from({ length: 7 }, (_, index) => ({
  id: `opaque-trip-${index + 1}`,
  number: `TR-90000${index + 1}`,
  date: index < 2 ? '2026-11-01' : '2026-11-02',
  routes: [],
  driver: {
    id: 'driver-test',
    fullName: index < 2 ? 'Иванов Сергей' : 'Мария Петрова',
    contacts: 'test',
  },
  vehicle: {
    id: 'vehicle-test',
    registrationNumber: index < 2 ? 'А001АА77' : 'Б002ББ77',
    type: 'Фургон',
    maxWeight: 1000,
    maxVolume: 5,
    status: 'available',
  },
  startTime: '09:00',
  endTime: '18:00',
  status: index < 2 ? 'assigned' : 'created',
}))
const withTrips = () =>
  vi.mocked(useGetTripsQuery).mockReturnValue({
    data: trips,
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as ReturnType<typeof useGetTripsQuery>)

it('loads Trip rows through the query and displays business numbers', async () => {
  renderTrips()
  expect(screen.getByText('Загрузка рейсов')).toBeTruthy()
  const table = await screen.findByRole('table', { name: 'Рейсы' })
  expect(
    within(table).getByRole('link', { name: 'TR-000123' }).getAttribute('href'),
  ).toBe('/trips/trip-001')
  expect(within(table).getAllByRole('row')).toHaveLength(3)
  expect(within(table).getAllByText('Алексей Петров')).toHaveLength(2)
  fireEvent.click(screen.getByRole('button', { name: 'Создать рейс' }))
  expect(
    await screen.findByRole('heading', { name: 'Создание рейса' }),
  ).toBeTruthy()
})

it('filters by number, driver, vehicle, date and status using URL state and resets pagination', () => {
  withTrips()
  renderTrips('/trips?page=2')
  const search = screen.getByRole('searchbox', { name: 'Поиск' })
  for (const query of ['TR-900001', 'Иванов', 'А001АА77']) {
    fireEvent.change(search, { target: { value: query } })
    expect(screen.getByRole('link', { name: 'TR-900001' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'TR-900007' })).toBeNull()
    expect(screen.getByLabelText('Текущий URL').textContent).not.toContain(
      'page=2',
    )
  }
  fireEvent.change(search, { target: { value: '' } })
  fireEvent.change(screen.getByRole('combobox', { name: 'Статус' }), {
    target: { value: 'assigned' },
  })
  expect(
    within(screen.getByRole('table', { name: 'Рейсы' })).getAllByRole('row'),
  ).toHaveLength(3)
  fireEvent.change(screen.getByLabelText('Начальная дата'), {
    target: { value: '2026-11-02' },
  })
  expect(
    screen.getByText('По выбранным условиям рейсы не найдены.'),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))
  expect(screen.getByLabelText('Текущий URL').textContent).toBe('/trips')
  expect(screen.getByRole('table', { name: 'Рейсы' })).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Конечная дата'), {
    target: { value: '2026-11-01' },
  })
  expect(screen.getByText('Показано 1–2 из 2 рейсов')).toBeTruthy()
})

it('paginates seven test-specific rows and returns to page one after narrowing', () => {
  withTrips()
  renderTrips()
  expect(screen.getByText('Показано 1–5 из 7 рейсов')).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'TR-900006' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
  expect(screen.getByText('Показано 6–7 из 7 рейсов')).toBeTruthy()
  expect(screen.queryByRole('link', { name: 'TR-900001' })).toBeNull()
  expect(screen.getByRole('link', { name: 'TR-900006' })).toBeTruthy()
  expect(
    screen
      .getByRole('button', { name: 'Previous page' })
      .hasAttribute('disabled'),
  ).toBe(false)
  fireEvent.change(screen.getByRole('searchbox', { name: 'Поиск' }), {
    target: { value: 'TR-900001' },
  })
  expect(screen.getByText('Показано 1–1 из 1 рейсов')).toBeTruthy()
})

it.each(['link', 'menu'] as const)(
  'opens Details by technical ID via %s and preserves filtered List context',
  async (entry) => {
    const search = '?search=TR-000123&status=assigned&page=1'
    renderTrips('/trips' + search)
    const link = await screen.findByRole('link', { name: 'TR-000123' })
    if (entry === 'link') fireEvent.click(link)
    else {
      const row = within(link.closest('tr')!)
      expect(
        row
          .getByRole('menuitem', { name: 'Редактировать', hidden: true })
          .hasAttribute('disabled'),
      ).toBe(true)
      expect(
        row
          .getByRole('menuitem', { name: 'Удалить', hidden: true })
          .hasAttribute('disabled'),
      ).toBe(true)
      fireEvent.click(
        row.getByRole('menuitem', { name: 'Посмотреть', hidden: true }),
      )
    }
    await screen.findByRole('heading', { name: 'Рейс TR-000123' })
    expect(screen.getByLabelText('Текущий URL').textContent).toBe(
      '/trips/trip-001',
    )
    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Хлебные крошки' }),
    ).getByRole('link', { name: 'Рейсы' })
    expect(breadcrumb.getAttribute('href')).toBe('/trips' + search)
    fireEvent.click(breadcrumb)
    await screen.findByRole('table', { name: 'Рейсы' })
    expect(screen.getByLabelText('Текущий URL').textContent).toBe(
      '/trips' + search,
    )
  },
)

it('shows an initial empty list', () => {
  vi.mocked(useGetTripsQuery).mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  } as ReturnType<typeof useGetTripsQuery>)
  renderTrips()
  expect(screen.getByText('Рейсов пока нет.')).toBeTruthy()
})
it('shows query errors and delegates retry', () => {
  const refetch = vi.fn()
  vi.mocked(useGetTripsQuery).mockReturnValue({
    isLoading: false,
    isError: true,
    refetch,
  } as ReturnType<typeof useGetTripsQuery>)
  renderTrips()
  expect(screen.getByRole('alert').textContent).toBe(
    'Не удалось загрузить рейсы.',
  )
  fireEvent.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }))
  expect(refetch).toHaveBeenCalledTimes(1)
})
