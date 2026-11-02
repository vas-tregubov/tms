import { fireEvent, render, screen, within } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import { beforeEach, expect, it, vi } from 'vitest'

import AppRouter from '@/app/router'
import { store } from '@/app/store'
import { baseApi } from '@/shared/api'
import { useGetRoutesQuery, type Route } from '@/entities/route'

vi.mock('@/entities/route', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/route')>()
  return { ...actual, useGetRoutesQuery: vi.fn(actual.useGetRoutesQuery) }
})
const actual =
  await vi.importActual<typeof import('@/entities/route')>('@/entities/route')

beforeEach(() => {
  store.dispatch(baseApi.util.resetApiState())
  vi.mocked(useGetRoutesQuery).mockImplementation(actual.useGetRoutesQuery)
})

const NavigationProbe = () => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <output aria-label="Текущий URL">
        {location.pathname}
        {location.search}
      </output>
      <button onClick={() => navigate(-1)}>Назад в браузере</button>
    </>
  )
}

const renderApp = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/routes']}>
        <NavigationProbe />
        <AppRouter />
      </MemoryRouter>
    </Provider>,
  )

it('opens the selected list record by technical ID and retains its business number in Details', async () => {
  renderApp()
  const table = await screen.findByRole('table', { name: 'Маршруты' })
  const link = within(table).getByRole('link', { name: 'MR-000123' })
  expect(link.getAttribute('href')).toBe('/routes/route-001')
  fireEvent.click(link)
  expect(
    await screen.findByRole('heading', { name: 'Маршрут MR-000123' }),
  ).toBeTruthy()
  expect(
    within(screen.getByRole('navigation', { name: 'Основная навигация' }))
      .getByRole('link', { name: 'Маршруты' })
      .getAttribute('aria-current'),
  ).toBe('page')
})

it.each(['browser Back', 'breadcrumb'])(
  'restores URL-owned filters and page two after returning via %s',
  async (returnMethod) => {
    const selected: Route = {
      id: 'route-001',
      number: 'MR-000123',
      date: '2026-11-02',
      startPoint: {
        id: 'test-start',
        name: 'РЦ Северный',
        address: 'Складская, 1',
      },
      endPoint: {
        id: 'test-end',
        name: 'Логистический пункт Центральный',
        address: 'Складская, 2',
      },
      startTime: '09:00',
      endTime: '10:30',
      status: 'assigned',
    }
    const data: Route[] = Array.from({ length: 7 }, (_, index) =>
      index === 5
        ? selected
        : { ...selected, id: `list-only-${index}`, number: `MR-80000${index}` },
    )
    vi.mocked(useGetRoutesQuery).mockReturnValue({
      data,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetRoutesQuery>)
    renderApp()

    fireEvent.change(screen.getByRole('searchbox', { name: 'Поиск' }), {
      target: { value: 'Северный' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Статус' }), {
      target: { value: 'assigned' },
    })
    fireEvent.change(screen.getByLabelText('Начальная дата'), {
      target: { value: '2026-11-02' },
    })
    fireEvent.change(screen.getByLabelText('Конечная дата'), {
      target: { value: '2026-11-02' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText('Показано 6–7 из 7 маршрутов')).toBeTruthy()
    const listUrl = screen.getByLabelText('Текущий URL').textContent!
    const params = new URLSearchParams(listUrl.split('?')[1])
    expect(Object.fromEntries(params)).toEqual({
      search: 'Северный',
      status: 'assigned',
      startDate: '2026-11-02',
      endDate: '2026-11-02',
      page: '2',
    })

    const link = within(
      screen.getByRole('table', { name: 'Маршруты' }),
    ).getByRole('link', { name: 'MR-000123' })
    expect(link.getAttribute('href')).toBe('/routes/route-001')
    fireEvent.click(link)
    expect(
      await screen.findByRole('heading', { name: 'Маршрут MR-000123' }),
    ).toBeTruthy()
    expect(screen.getByLabelText('Текущий URL').textContent).toBe(
      '/routes/route-001',
    )
    const breadcrumb = within(
      screen.getByRole('navigation', { name: 'Хлебные крошки' }),
    ).getByRole('link', { name: 'Маршруты' })
    expect(breadcrumb.getAttribute('href')).toBe(listUrl)

    fireEvent.click(
      returnMethod === 'browser Back'
        ? screen.getByRole('button', { name: 'Назад в браузере' })
        : breadcrumb,
    )

    expect(
      await screen.findByRole('heading', { name: 'Маршруты' }),
    ).toBeTruthy()
    expect(screen.getByLabelText('Текущий URL').textContent).toBe(listUrl)
    expect(
      (screen.getByRole('searchbox', { name: 'Поиск' }) as HTMLInputElement)
        .value,
    ).toBe('Северный')
    expect(
      (screen.getByRole('combobox', { name: 'Статус' }) as HTMLSelectElement)
        .value,
    ).toBe('assigned')
    expect(
      (screen.getByLabelText('Начальная дата') as HTMLInputElement).value,
    ).toBe('2026-11-02')
    expect(
      (screen.getByLabelText('Конечная дата') as HTMLInputElement).value,
    ).toBe('2026-11-02')
    expect(screen.getByText('Показано 6–7 из 7 маршрутов')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: '2' }).getAttribute('aria-current'),
    ).toBe('page')
  },
)
