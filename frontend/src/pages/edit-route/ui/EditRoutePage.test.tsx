import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
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
import { useGetRouteByIdQuery, useUpdateRouteMutation } from '@/entities/route'
import {
  resetMockRouteSource,
  updateMockRoute,
} from '@/entities/route/api/mockRouteSource'
import { baseApi } from '@/shared/api'

vi.mock('@/entities/route/api/mockRouteSource', async (importOriginal) => {
  const actual =
    await importOriginal<
      typeof import('@/entities/route/api/mockRouteSource')
    >()
  return { ...actual, updateMockRoute: vi.fn(actual.updateMockRoute) }
})
vi.mock('@/entities/route', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/route')>()
  return { ...actual, useGetRouteByIdQuery: vi.fn(actual.useGetRouteByIdQuery) }
})
const actual =
  await vi.importActual<typeof import('@/entities/route')>('@/entities/route')
const actualSource = await vi.importActual<
  typeof import('@/entities/route/api/mockRouteSource')
>('@/entities/route/api/mockRouteSource')
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
  resetMockRouteSource()
  store.dispatch(baseApi.util.resetApiState())
  vi.mocked(updateMockRoute)
    .mockReset()
    .mockImplementation(actualSource.updateMockRoute)
  vi.mocked(useGetRouteByIdQuery).mockImplementation(
    actual.useGetRouteByIdQuery,
  )
})
afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
  resetMockRouteSource()
})

const Probe = () => {
  const location = useLocation()
  const navigate = useNavigate()
  return (
    <>
      <output aria-label="Текущий URL">{location.pathname}</output>
      <button onClick={() => navigate('/routes/route-002/edit')}>
        Другой маршрут
      </button>
    </>
  )
}
const ServerRefresh = () => {
  const route = actual.useGetRouteByIdQuery('route-001')
  const [update] = useUpdateRouteMutation()
  return (
    <>
      <output aria-label="Дата на сервере">{route.data?.date}</output>
      <button
        onClick={() => {
          if (route.data)
            void update({
              id: route.data.id,
              changes: { ...route.data, date: '2026-11-20' },
            })
        }}
      >
        Внешнее обновление
      </button>
    </>
  )
}
const renderEdit = (url = '/routes/route-001/edit', refresh = false) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <Probe />
        {refresh && <ServerRefresh />}
        <AppRouter />
      </MemoryRouter>
    </Provider>,
  )
const loaded = () =>
  screen.findByRole('heading', { name: 'Редактирование маршрута MR-000123' })
const next = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Далее' }))
const back = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
const value = (label: string) =>
  (screen.getByLabelText(label) as HTMLInputElement).value
const goToReview = () => {
  next()
  next()
  next()
  expect(
    screen.getByRole('heading', { name: 'Проверка изменений' }),
  ).toBeTruthy()
}

it('hydrates all fields, preserves edits through four steps and keeps status read-only', async () => {
  renderEdit()
  expect(screen.getByText('Загрузка маршрута')).toBeTruthy()
  await loaded()
  expect(value('Дата')).toBe('2026-11-02')
  expect(value('Статус')).toBe('assigned')
  expect(screen.getByLabelText('Статус').hasAttribute('disabled')).toBe(true)
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-11-10' },
  })
  next()
  expect(value('Точка отправления')).toBe('РЦ Северный')
  expect(value('Точка назначения')).toBe('Логистический пункт Центральный')
  next()
  expect(value('Время отправления')).toBe('09:00')
  expect(value('Время прибытия')).toBe('10:30')
  expect(value('Комментарий / особые условия')).toBe(
    'Температурный режим +2…+6 °C',
  )
  fireEvent.change(screen.getByLabelText('Комментарий / особые условия'), {
    target: { value: 'Новые условия' },
  })
  next()
  expect(screen.getByText('10.11.2026')).toBeTruthy()
  expect(screen.getByText('Новые условия')).toBeTruthy()
  expect(screen.getByText('Назначен')).toBeTruthy()
  back()
  expect(value('Комментарий / особые условия')).toBe('Новые условия')
  back()
  back()
  expect(value('Дата')).toBe('2026-11-10')
})

it('blocks invalid progression at the current step', async () => {
  renderEdit()
  await loaded()
  fireEvent.change(screen.getByLabelText('Дата'), { target: { value: '' } })
  next()
  expect(screen.getByText('Выберите дату отправки')).toBeTruthy()
  expect(screen.queryByText('Введите корректное время отправления')).toBeNull()
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-11-10' },
  })
  next()
  fireEvent.change(
    screen.getByRole('combobox', { name: 'Точка отправления' }),
    {
      target: { value: 'неизвестно' },
    },
  )
  fireEvent.keyDown(
    screen.getByRole('combobox', { name: 'Точка отправления' }),
    {
      key: 'Escape',
    },
  )
  next()
  expect(screen.getByText('Выберите точку отправления')).toBeTruthy()
  fireEvent.click(screen.getByRole('combobox', { name: 'Точка отправления' }))
  fireEvent.click(screen.getByRole('option', { name: 'РЦ Северный' }))
  next()
  fireEvent.change(screen.getByLabelText('Время отправления'), {
    target: { value: '' },
  })
  next()
  expect(screen.getByText('Введите корректное время отправления')).toBeTruthy()
  expect(updateMockRoute).not.toHaveBeenCalled()
})

it('cancels without updating the Route or changing an unfinished Create draft', async () => {
  // Populate Create through its UI before entering a separate Edit session.
  renderEdit('/routes/new')
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-12-01' },
  })
  const createState = store.getState().createRoute
  fireEvent.click(
    within(
      screen.getByRole('navigation', { name: 'Основная навигация' }),
    ).getByRole('link', { name: 'Маршруты' }),
  )
  fireEvent.click(await screen.findByRole('link', { name: 'MR-000123' }))
  await screen.findByRole('heading', { name: 'Маршрут MR-000123' })
  fireEvent.click(screen.getByRole('button', { name: 'Редактировать' }))
  await loaded()
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-11-10' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))
  expect(
    await screen.findByRole('heading', { name: 'Маршрут MR-000123' }),
  ).toBeTruthy()
  expect(screen.getByText('02.11.2026')).toBeTruthy()
  expect(updateMockRoute).not.toHaveBeenCalled()
  expect(store.getState().createRoute).toEqual(createState)
})

it('updates cached Details and List after Save, preserving identity and status', async () => {
  renderEdit('/routes')
  const table = await screen.findByRole('table', { name: 'Маршруты' })
  fireEvent.click(within(table).getByRole('link', { name: 'MR-000123' }))
  await screen.findByRole('heading', { name: 'Маршрут MR-000123' })
  fireEvent.click(screen.getByRole('button', { name: 'Редактировать' }))
  await loaded()
  expect(screen.getByLabelText('Текущий URL').textContent).toBe(
    '/routes/route-001/edit',
  )
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-11-10' },
  })
  next()
  fireEvent.click(screen.getByRole('combobox', { name: 'Точка отправления' }))
  fireEvent.click(
    screen.getByRole('option', { name: 'Логистический пункт Центральный' }),
  )
  fireEvent.click(screen.getByRole('combobox', { name: 'Точка назначения' }))
  fireEvent.click(screen.getByRole('option', { name: 'РЦ Северный' }))
  next()
  fireEvent.change(screen.getByLabelText('Время отправления'), {
    target: { value: '23:59' },
  })
  fireEvent.change(screen.getByLabelText('Время прибытия'), {
    target: { value: '00:00' },
  })
  fireEvent.change(screen.getByLabelText('Комментарий / особые условия'), {
    target: { value: 'Обновлённые условия' },
  })
  next()
  const save = screen.getByRole('button', { name: 'Сохранить изменения' })
  fireEvent.click(save)
  fireEvent.click(save)
  expect(save.hasAttribute('disabled')).toBe(true)
  await screen.findByRole('heading', { name: 'Маршрут MR-000123' })
  await screen.findByText('Обновлённые условия')
  expect(screen.getByText('10.11.2026')).toBeTruthy()
  expect(screen.getByText('23:59')).toBeTruthy()
  expect(screen.getByText('00:00')).toBeTruthy()
  expect(screen.getByLabelText('Изменить статус')).toHaveProperty(
    'value',
    'assigned',
  )
  expect(updateMockRoute).toHaveBeenCalledTimes(1)
  expect(vi.mocked(updateMockRoute).mock.calls[0][0]).toEqual({
    id: 'route-001',
    changes: expect.objectContaining({
      date: '2026-11-10',
      startTime: '23:59',
      endTime: '00:00',
      startPoint: expect.objectContaining({ id: 'point-001' }),
      endPoint: expect.objectContaining({ id: 'dc-001' }),
    }),
  })
  fireEvent.click(
    within(
      screen.getByRole('navigation', { name: 'Хлебные крошки' }),
    ).getByRole('link', { name: 'Маршруты' }),
  )
  const updatedTable = await screen.findByRole('table', { name: 'Маршруты' })
  await waitFor(() =>
    expect(
      within(
        within(updatedTable)
          .getByRole('link', { name: 'MR-000123' })
          .closest('tr')!,
      ).getByText('10.11.2026'),
    ).toBeTruthy(),
  )
})

it('retains the draft on update error and permits retry', async () => {
  vi.mocked(updateMockRoute).mockReturnValueOnce(undefined)
  renderEdit()
  await loaded()
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-11-10' },
  })
  goToReview()
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить изменения' }))
  expect(await screen.findByRole('alert')).toHaveProperty(
    'textContent',
    'Не удалось сохранить изменения. Попробуйте ещё раз.',
  )
  back()
  back()
  back()
  expect(value('Дата')).toBe('2026-11-10')
  goToReview()
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить изменения' }))
  await screen.findByRole('heading', { name: 'Маршрут MR-000123' })
  expect(await screen.findByText('10.11.2026')).toBeTruthy()
  expect(updateMockRoute).toHaveBeenCalledTimes(2)
})

it('does not overwrite a dirty draft when RTK Query refetches newer data', async () => {
  renderEdit('/routes/route-001/edit', true)
  await loaded()
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-12-01' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Внешнее обновление' }))
  await waitFor(() =>
    expect(screen.getByLabelText('Дата на сервере').textContent).toBe(
      '2026-11-20',
    ),
  )
  expect(value('Дата')).toBe('2026-12-01')
})

it('starts a new session when the technical Route ID changes', async () => {
  renderEdit()
  await loaded()
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-12-01' },
  })
  next()
  fireEvent.click(screen.getByRole('button', { name: 'Другой маршрут' }))
  await screen.findByRole('heading', {
    name: 'Редактирование маршрута MR-000122',
  })
  expect(value('Дата')).toBe('2026-11-02')
  expect(value('Статус')).toBe('created')
})

it('shows not found for an unknown technical ID', async () => {
  renderEdit('/routes/unknown-route/edit')
  expect(
    await screen.findByRole('heading', { name: 'Маршрут не найден' }),
  ).toBeTruthy()
  expect(screen.queryByRole('button', { name: 'Далее' })).toBeNull()
})

it('delegates initial loading error retry without hydrating a form', () => {
  const refetch = vi.fn()
  vi.mocked(useGetRouteByIdQuery).mockReturnValue({
    currentData: undefined,
    isLoading: false,
    isFetching: false,
    isError: true,
    error: { status: 503, message: 'Недоступно' },
    refetch,
  } as ReturnType<typeof useGetRouteByIdQuery>)
  renderEdit()
  expect(
    screen.getByRole('heading', { name: 'Не удалось загрузить маршрут' }),
  ).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Попробовать ещё раз' }))
  expect(refetch).toHaveBeenCalledTimes(1)
})

it('opens Edit from the List action for the selected technical ID', async () => {
  renderEdit('/routes')
  const table = await screen.findByRole('table', { name: 'Маршруты' })
  const row = within(table)
    .getByRole('link', { name: 'MR-000122' })
    .closest('tr')!
  const action = within(row).getByRole('menuitem', {
    name: 'Редактировать',
    hidden: true,
  })
  expect(action.hasAttribute('disabled')).toBe(false)
  fireEvent.click(action)
  expect(
    await screen.findByRole('heading', {
      name: 'Редактирование маршрута MR-000122',
    }),
  ).toBeTruthy()
  expect(screen.getByLabelText('Текущий URL').textContent).toBe(
    '/routes/route-002/edit',
  )
})
