import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { useState } from 'react'
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
import {
  useCreateRouteMutation,
  type CreateRouteInput,
  type Route,
} from '@/entities/route'
import {
  getMockRoutes,
  resetMockRouteSource,
} from '@/entities/route/api/mockRouteSource'
import { resetCreateRoute } from '@/features/create-route'
import { baseApi } from '@/shared/api'

vi.mock('@/entities/route', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/entities/route')>()
  return {
    ...actual,
    useCreateRouteMutation: vi.fn(actual.useCreateRouteMutation),
  }
})
const actual =
  await vi.importActual<typeof import('@/entities/route')>('@/entities/route')

// Browser top-layer methods are outside jsdom's DOM implementation.
// These local stubs let the integration test exercise our success composition.
const dialogMethods = ['showModal', 'close'] as const
const originalMethods = dialogMethods.map((name) =>
  Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name),
)
beforeAll(() => {
  for (const name of dialogMethods)
    Object.defineProperty(HTMLDialogElement.prototype, name, {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = name === 'showModal'
      },
    })
})
afterAll(() => {
  dialogMethods.forEach((name, index) => {
    const descriptor = originalMethods[index]
    if (descriptor)
      Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
  })
})

beforeEach(() => {
  vi.mocked(useCreateRouteMutation).mockImplementation(
    actual.useCreateRouteMutation,
  )
})
afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
  store.dispatch(resetCreateRoute())
  resetMockRouteSource()
  vi.clearAllMocks()
})
const LocationProbe = () => {
  const location = useLocation()
  return <output aria-label="Текущий URL">{location.pathname}</output>
}
const renderFlow = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/routes/new']}>
        <LocationProbe />
        <AppRouter />
      </MemoryRouter>
    </Provider>,
  )
const next = () =>
  fireEvent.click(screen.getByRole('button', { name: 'Далее' }))
const fillBasics = () => {
  fireEvent.change(screen.getByLabelText('Дата'), {
    target: { value: '2026-11-10' },
  })
  fireEvent.change(screen.getByRole('combobox', { name: 'Статус' }), {
    target: { value: 'created' },
  })
}
const fillPoints = async () => {
  const start = await screen.findByRole('combobox', {
    name: 'Точка отправления',
  })
  fireEvent.change(start, { target: { value: 'СЕВ' } })
  fireEvent.click(screen.getByRole('option', { name: 'РЦ Северный' }))
  fireEvent.click(screen.getByRole('combobox', { name: 'Точка назначения' }))
  fireEvent.click(
    screen.getByRole('option', { name: 'Логистический пункт Центральный' }),
  )
}
const goToReview = async () => {
  fillBasics()
  next()
  await fillPoints()
  next()
  expect(
    screen.getByRole('button', { name: 'О временном интервале маршрута' }),
  ).toBeTruthy()
  fireEvent.change(screen.getByLabelText('Приёмка с'), {
    target: { value: '23:59' },
  })
  fireEvent.change(screen.getByLabelText('Приёмка до'), {
    target: { value: '00:00' },
  })
  fireEvent.change(screen.getByLabelText('Комментарий / особые условия'), {
    target: { value: 'Обычный <текст>' },
  })
  next()
  expect(
    screen.getByRole('heading', { name: 'Проверка данных маршрута' }),
  ).toBeTruthy()
}

it('validates only the current step, retains fields on Back, and restores draft/step after Sidebar navigation', async () => {
  renderFlow()
  expect(screen.getByRole('heading', { name: 'Основные данные' })).toBeTruthy()
  expect(screen.queryByText('Выберите дату отправки')).toBeNull()
  next()
  expect(screen.getByText('Выберите дату отправки')).toBeTruthy()
  expect(screen.queryByText('Выберите точку отправления')).toBeNull()
  fillBasics()
  next()
  await screen.findByRole('combobox', { name: 'Точка отправления' })
  fireEvent.click(screen.getByRole('button', { name: 'Назад' }))
  expect((screen.getByLabelText('Дата') as HTMLInputElement).value).toBe(
    '2026-11-10',
  )
  next()
  await fillPoints()
  const nav = within(
    screen.getByRole('navigation', { name: 'Основная навигация' }),
  )
  fireEvent.click(nav.getByRole('link', { name: 'Рейсы' }))
  expect(await screen.findByRole('heading', { name: 'Рейсы' })).toBeTruthy()
  fireEvent.click(nav.getByRole('link', { name: 'Маршруты' }))
  fireEvent.click(
    await screen.findByRole('button', { name: 'Создать маршрут' }),
  )
  expect(screen.getByRole('heading', { name: 'Точки маршрута' })).toBeTruthy()
  expect(
    (
      screen.getByRole('combobox', {
        name: 'Точка отправления',
      }) as HTMLInputElement
    ).value,
  ).toBe('РЦ Северный')
  next()
  next()
  expect(screen.getByText('Введите корректное время отправления')).toBeTruthy()
  expect(screen.getByRole('heading', { name: 'Время и условия' })).toBeTruthy()
})

it('cancel on step one clears the draft and returns to the list', () => {
  renderFlow()
  fillBasics()
  fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))
  expect(screen.getByRole('heading', { name: 'Маршруты' })).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: 'Создать маршрут' }))
  expect((screen.getByLabelText('Дата') as HTMLInputElement).value).toBe('')
  expect(
    (screen.getByRole('combobox', { name: 'Статус' }) as HTMLSelectElement)
      .value,
  ).toBe('')
})

it.each(['Открыть маршрут', 'К списку маршрутов'])(
  'creates through RTK Query, prevents double submit, clears draft and handles %s',
  async (action) => {
    const originalIds = new Set(getMockRoutes().map((route) => route.id))
    renderFlow()
    await goToReview()
    expect(screen.getByText('10.11.2026')).toBeTruthy()
    expect(screen.getByText('Обычный <текст>')).toBeTruthy()
    const save = screen.getByRole('button', { name: 'Сохранить маршрут' })
    fireEvent.click(save)
    fireEvent.click(save)
    expect(save.hasAttribute('disabled')).toBe(true)
    const modal = await screen.findByRole('dialog', {
      name: 'Маршрут сохранён',
    })
    expect(getMockRoutes()).toHaveLength(originalIds.size + 1)
    const createdRoutes = getMockRoutes().filter(
      (route) => !originalIds.has(route.id),
    )
    expect(createdRoutes).toHaveLength(1)
    const created = createdRoutes[0]
    expect(created.number).toMatch(/^MR-\d+$/)
    expect(created.id).not.toBe(created.number)
    expect(created).toMatchObject({
      date: '2026-11-10',
      status: 'created',
      startTime: '23:59',
      endTime: '00:00',
      comment: 'Обычный <текст>',
    })
    expect(
      within(modal).getByText(`Маршрут ${created.number} успешно создан`),
    ).toBeTruthy()
    expect(store.getState().createRoute.currentStep).toBe(1)
    expect(store.getState().createRoute.draft.date).toBe('')
    fireEvent.click(within(modal).getByRole('button', { name: action }))
    if (action === 'Открыть маршрут') {
      const heading = await screen.findByRole('heading', {
        name: `Маршрут ${created.number}`,
      })
      expect(heading).toBeTruthy()
      expect(screen.getByLabelText('Текущий URL').textContent).toBe(
        `/routes/${encodeURIComponent(created.id)}`,
      )
      expect(screen.getByRole('button', { name: 'Редактировать' })).toBeTruthy()
    } else {
      const table = await screen.findByRole('table', { name: 'Маршруты' })
      const link = within(table).getByRole('link', { name: created.number })
      expect(link.getAttribute('href')).toBe(
        `/routes/${encodeURIComponent(created.id)}`,
      )
      expect(within(link.closest('tr')!).getByText('10.11.2026')).toBeTruthy()
    }
    expect(getMockRoutes()).toHaveLength(originalIds.size + 1)
  },
)

it('keeps draft on mutation failure and retries with the entered data and returned technical identity', async () => {
  const created: Route = {
    id: 'opaque-new-route',
    number: 'MR-900999',
    date: '2026-11-10',
    status: 'created',
    startTime: '23:59',
    endTime: '00:00',
    startPoint: { id: 'dc-001', name: 'РЦ Северный', address: 'Москва' },
    endPoint: {
      id: 'point-001',
      name: 'Логистический пункт Центральный',
      address: 'Москва',
    },
  }
  const unwrap = vi
    .fn()
    .mockRejectedValueOnce(new Error('Unavailable'))
    .mockResolvedValueOnce(created)
  const trigger = vi.fn()
  vi.mocked(useCreateRouteMutation).mockImplementation(
    function useMockMutation() {
      const [result, setResult] = useState<{
        data?: Route
        isLoading: boolean
        isError: boolean
      }>({ isLoading: false, isError: false })
      return [
        (input: CreateRouteInput) => {
          trigger(input)
          setResult({ isLoading: true, isError: false })
          const promise = unwrap().then(
            (data: Route) => {
              setResult({ data, isLoading: false, isError: false })
              return data
            },
            (error: Error) => {
              setResult({ isLoading: false, isError: true })
              throw error
            },
          )
          return { unwrap: () => promise }
        },
        {
          ...result,
          reset: () => setResult({ isLoading: false, isError: false }),
        },
      ] as unknown as ReturnType<typeof useCreateRouteMutation>
    },
  )
  renderFlow()
  await goToReview()
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить маршрут' }))
  expect(await screen.findByRole('alert')).toHaveProperty(
    'textContent',
    'Не удалось сохранить маршрут. Попробуйте ещё раз.',
  )
  expect(store.getState().createRoute.draft.comment).toBe('Обычный <текст>')
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить маршрут' }))
  const modal = await screen.findByRole('dialog', { name: 'Маршрут сохранён' })
  expect(trigger).toHaveBeenCalledTimes(2)
  expect(trigger).toHaveBeenLastCalledWith(
    expect.objectContaining({
      date: '2026-11-10',
      startTime: '23:59',
      endTime: '00:00',
      comment: 'Обычный <текст>',
      startPoint: expect.objectContaining({ id: 'dc-001' }),
      endPoint: expect.objectContaining({ id: 'point-001' }),
    }),
  )
  expect(
    within(modal).getByText('Маршрут MR-900999 успешно создан'),
  ).toBeTruthy()
  fireEvent.click(
    within(modal).getByRole('button', { name: 'Открыть маршрут' }),
  )
  await waitFor(() =>
    expect(
      screen.getByRole('heading', { name: 'Маршрут не найден' }),
    ).toBeTruthy(),
  )
  expect(screen.getByLabelText('Текущий URL').textContent).toBe(
    '/routes/opaque-new-route',
  )
  // The mock response's opaque ID is used verbatim even though no fixture exists for it.
})

it('keeps a pending create request disabled across Sidebar navigation and shows its result after return', async () => {
  renderFlow()
  await goToReview()
  vi.useFakeTimers()
  try {
    fireEvent.click(screen.getByRole('button', { name: 'Сохранить маршрут' }))
    const nav = within(
      screen.getByRole('navigation', { name: 'Основная навигация' }),
    )
    fireEvent.click(nav.getByRole('link', { name: 'Рейсы' }))
    fireEvent.click(nav.getByRole('link', { name: 'Маршруты' }))
    fireEvent.click(screen.getByRole('button', { name: 'Создать маршрут' }))
    expect(
      screen.getByRole('heading', { name: 'Проверка данных маршрута' }),
    ).toBeTruthy()
    expect(
      screen
        .getByRole('button', { name: /Сохранение/ })
        .hasAttribute('disabled'),
    ).toBe(true)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(200)
    })
  } finally {
    vi.useRealTimers()
  }
  expect(
    await screen.findByRole('dialog', { name: 'Маршрут сохранён' }),
  ).toBeTruthy()
})
