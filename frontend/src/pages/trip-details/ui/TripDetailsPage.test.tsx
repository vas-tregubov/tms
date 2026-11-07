import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import AppRouter from '@/app/router'
import { store } from '@/app/store'
import { useGetTripByIdQuery, useGetTripTimelineQuery } from '@/entities/trip'
import { baseApi } from '@/shared/api'

vi.mock('@/entities/trip', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/trip')>()
  return {
    ...actual,
    useGetTripByIdQuery: vi.fn(actual.useGetTripByIdQuery),
    useGetTripTimelineQuery: vi.fn(actual.useGetTripTimelineQuery),
  }
})
const actual =
  await vi.importActual<typeof import('@/entities/trip')>('@/entities/trip')
beforeEach(() => {
  store.dispatch(baseApi.util.resetApiState())
  vi.mocked(useGetTripByIdQuery).mockImplementation(actual.useGetTripByIdQuery)
  vi.mocked(useGetTripTimelineQuery).mockImplementation(
    actual.useGetTripTimelineQuery,
  )
})
afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
})
const Location = () => (
  <output aria-label="Текущий URL">{useLocation().pathname}</output>
)
const renderDetails = (id = 'trip-001') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[`/trips/${id}`]}>
        <Location />
        <AppRouter />
      </MemoryRouter>
    </Provider>,
  )

it('loads Trip information, related Routes, status lifecycle and real history metadata', async () => {
  renderDetails()
  expect(screen.getByText('Загрузка рейса')).toBeTruthy()
  await screen.findByRole('heading', { name: 'Рейс TR-000123' })
  const info = within(screen.getByRole('region', { name: 'Общая информация' }))
  for (const text of [
    'TR-000123',
    '02.11.2026',
    '08:30',
    '13:00',
    'Алексей Петров',
    'А001АА777 · Грузовой фургон',
  ])
    expect(info.getByText(text)).toBeTruthy()
  expect(
    screen
      .getByRole('button', { name: 'Редактировать' })
      .hasAttribute('disabled'),
  ).toBe(true)
  const routes = within(screen.getByRole('table', { name: 'Маршруты в рейсе' }))
  expect(routes.getAllByRole('row')).toHaveLength(3)
  expect(
    routes.getByRole('link', { name: 'MR-000123' }).getAttribute('href'),
  ).toBe('/routes/route-001')
  const status = within(screen.getByRole('region', { name: 'Статус рейса' }))
  await status.findByText('01.11.2026 10:24')
  expect(status.getAllByRole('listitem')).toHaveLength(4)
  expect(
    status
      .getByRole('combobox', { name: 'Изменить статус' })
      .hasAttribute('disabled'),
  ).toBe(true)
  expect(status.getAllByText('Алексей Петров')).toHaveLength(1)
  const history = within(
    screen.getByRole('table', { name: 'История изменений рейса' }),
  )
  expect(history.getAllByRole('row')).toHaveLength(3)
  expect(history.getByText('Назначены водитель и ТС')).toBeTruthy()
  fireEvent.click(routes.getByRole('link', { name: 'MR-000123' }))
  expect(
    await screen.findByRole('heading', { name: 'Маршрут MR-000123' }),
  ).toBeTruthy()
  expect(screen.getByLabelText('Текущий URL').textContent).toBe(
    '/routes/route-001',
  )
})

it('shows completed history in reverse chronological order', async () => {
  renderDetails('trip-002')
  await screen.findByRole('heading', { name: 'Рейс TR-000124' })
  const history = within(
    await screen.findByRole('table', { name: 'История изменений рейса' }),
  )
  expect(history.getAllByRole('row')).toHaveLength(5)
  expect(history.getAllByRole('row')[1].textContent).toContain('Рейс выполнен')
  expect(
    screen.getByText('Рейс завершён. Изменение статуса недоступно.'),
  ).toBeTruthy()
})

it('keeps unknown technical IDs not found', async () => {
  renderDetails('unknown-trip')
  expect(
    await screen.findByRole('heading', { name: 'Рейс не найден' }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'К рейсам' }))
  expect(await screen.findByRole('heading', { name: 'Рейсы' })).toBeTruthy()
})

it('shows an honest empty projection without inventing timeline authors or history', async () => {
  vi.mocked(useGetTripTimelineQuery).mockReturnValue({
    currentData: [],
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  } as ReturnType<typeof useGetTripTimelineQuery>)
  renderDetails()
  await screen.findByRole('heading', { name: 'Рейс TR-000123' })
  expect(screen.getByText('История изменений пока отсутствует.')).toBeTruthy()
  const status = within(screen.getByRole('region', { name: 'Статус рейса' }))
  expect(status.getAllByRole('listitem')).toHaveLength(4)
  expect(status.queryByText('Алексей Петров')).toBeNull()
})

it('delegates failed Trip query retry', () => {
  const refetch = vi.fn()
  vi.mocked(useGetTripByIdQuery).mockReturnValue({
    isLoading: false,
    isError: true,
    isFetching: false,
    error: { status: 503, message: 'Недоступно' },
    refetch,
  } as ReturnType<typeof useGetTripByIdQuery>)
  renderDetails()
  expect(
    screen.getByRole('heading', { name: 'Не удалось загрузить рейс' }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }))
  expect(refetch).toHaveBeenCalledTimes(1)
})

it('shows projection errors without hiding Trip information', async () => {
  const refetch = vi.fn()
  vi.mocked(useGetTripTimelineQuery).mockReturnValue({
    isLoading: false,
    isFetching: false,
    isError: true,
    refetch,
  } as ReturnType<typeof useGetTripTimelineQuery>)
  renderDetails()
  await screen.findByRole('heading', { name: 'Рейс TR-000123' })
  expect(screen.getByRole('region', { name: 'Общая информация' })).toBeTruthy()
  fireEvent.click(
    screen.getByRole('button', { name: 'Повторить загрузку истории' }),
  )
  expect(refetch).toHaveBeenCalledTimes(1)
})
