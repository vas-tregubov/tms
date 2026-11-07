import { configureStore } from '@reduxjs/toolkit'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { useGetRouteByIdQuery } from '@/entities/route'
import { baseApi } from '@/shared/api'

import RouteDetailsPage from './RouteDetailsPage'

vi.mock('@/entities/route', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/route')>()
  return { ...actual, useGetRouteByIdQuery: vi.fn(actual.useGetRouteByIdQuery) }
})

const actual =
  await vi.importActual<typeof import('@/entities/route')>('@/entities/route')
const store = configureStore({
  reducer: { [baseApi.reducerPath]: baseApi.reducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

const CurrentLocation = () => (
  <output aria-label="Текущий URL">{useLocation().pathname}</output>
)

const renderDetails = (id = 'route-001') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/routes/${id}`]}>
        <CurrentLocation />
        <Routes>
          <Route path="/routes/:routeId" element={<RouteDetailsPage />} />
          <Route path="*" element={null} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

beforeEach(() => {
  store.dispatch(baseApi.util.resetApiState())
  vi.mocked(useGetRouteByIdQuery).mockImplementation(
    actual.useGetRouteByIdQuery,
  )
})
afterEach(() => vi.clearAllMocks())

it('loads the selected technical ID and displays its business number and information', async () => {
  renderDetails()
  expect(screen.getByText('Загрузка маршрута')).toBeTruthy()
  const heading = await screen.findByRole('heading', {
    name: 'Маршрут MR-000123',
  })
  expect(within(heading.parentElement!).getByText('Назначен')).toBeTruthy()
  expect(
    screen.getByText('РЦ Северный → Логистический пункт Центральный'),
  ).toBeTruthy()
  const info = within(screen.getByRole('region', { name: 'Общая информация' }))
  for (const value of [
    'MR-000123',
    '02.11.2026',
    'РЦ Северный',
    'Логистический пункт Центральный',
    '09:00',
    '10:30',
    'Температурный режим +2…+6 °C',
  ]) {
    expect(info.getByText(value)).toBeTruthy()
  }
  const breadcrumbs = within(
    screen.getByRole('navigation', { name: 'Хлебные крошки' }),
  )
  expect(breadcrumbs.queryByRole('link', { name: 'MR-000123' })).toBeNull()
  expect(breadcrumbs.getByText('MR-000123').getAttribute('aria-current')).toBe(
    'page',
  )
})

it('renders completed status read-only and explicit mock timeline values', async () => {
  renderDetails('route-003')
  const heading = await screen.findByRole('heading', {
    name: 'Маршрут MR-000121',
  })
  expect(within(heading.parentElement!).getByText('Завершён')).toBeTruthy()
  const status = within(screen.getByRole('region', { name: 'Статус маршрута' }))
  const select = status.getByRole('combobox', { name: 'Изменить статус' })
  expect(select.hasAttribute('disabled')).toBe(true)
  expect((select as HTMLSelectElement).value).toBe('completed')
  expect(
    status.getByText('Маршрут завершён. Изменение статуса недоступно.'),
  ).toBeTruthy()
  // Explicit event fixture time; it is not Route.date or a planned start/end time.
  expect(await status.findByText('31.10.2026 10:24')).toBeTruthy()
  expect(status.getByText('01.11.2026 10:35')).toBeTruthy()
  expect(status.getAllByText('Алексей Петров')).toHaveLength(4)
})

it('uses an honest fallback when the selected route has no comment', async () => {
  renderDetails('route-002')
  await screen.findByRole('heading', { name: 'Маршрут MR-000122' })
  expect(
    within(screen.getByRole('region', { name: 'Общая информация' })).getByText(
      '—',
    ),
  ).toBeTruthy()
  const status = within(screen.getByRole('region', { name: 'Статус маршрута' }))
  await status.findByText('01.11.2026 16:10')
  const items = within(status.getByRole('list')).getAllByRole('listitem')
  expect(items.map((item) => item.textContent)).toEqual([
    'Создан01.11.2026 16:10Алексей Петров',
    'Назначен',
    'В пути',
    'Завершён',
  ])
})

it('shows not found for an unknown technical ID', async () => {
  renderDetails('missing-route')
  expect(await screen.findByText('Маршрут не найден')).toBeTruthy()
  expect(screen.queryByText('Не удалось загрузить маршрут')).toBeNull()
})

it('shows a generic query error and delegates retry to refetch', () => {
  const refetch = vi.fn()
  vi.mocked(useGetRouteByIdQuery).mockReturnValue({
    currentData: undefined,
    isLoading: false,
    isFetching: false,
    isError: true,
    error: { status: 503, message: 'Источник недоступен' },
    refetch,
  } as ReturnType<typeof useGetRouteByIdQuery>)
  renderDetails()
  expect(screen.getByText('Не удалось загрузить маршрут')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }))
  expect(refetch).toHaveBeenCalledTimes(1)
})

it.each([
  ['Главная', '/'],
  ['Маршруты', '/routes'],
  ['Редактировать', '/routes/route-001/edit'],
])(
  'navigates through %s using the existing URL contract',
  async (label, url) => {
    renderDetails()
    await screen.findByRole('heading', { name: 'Маршрут MR-000123' })
    const control =
      label === 'Редактировать'
        ? screen.getByRole('button', { name: label })
        : within(
            screen.getByRole('navigation', { name: 'Хлебные крошки' }),
          ).getByRole('link', { name: label })
    fireEvent.click(control)
    expect(screen.getByLabelText('Текущий URL').textContent).toBe(url)
  },
)
