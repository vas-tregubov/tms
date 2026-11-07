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
import {
  createMockRoute,
  getMockRoutes,
  resetMockRouteSource,
} from '@/entities/route/api/mockRouteSource'
import {
  getMockTrips,
  resetMockTripSource,
} from '@/entities/trip/api/mockTripSource'
import { baseApi } from '@/shared/api'
import { saveTripWithRoutes } from '@/features/create-trip/api/createTripApi'

const methods = ['showModal', 'close'] as const
const descriptors = methods.map((name) =>
  Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name),
)
const hidePopover = Object.getOwnPropertyDescriptor(
  HTMLElement.prototype,
  'hidePopover',
)
beforeAll(() => {
  methods.forEach((name) =>
    Object.defineProperty(HTMLDialogElement.prototype, name, {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = name === 'showModal'
      },
    }),
  )
  Object.defineProperty(HTMLElement.prototype, 'hidePopover', {
    configurable: true,
    value: () => {},
  })
})
afterAll(() => {
  methods.forEach((name, index) => {
    const descriptor = descriptors[index]
    if (descriptor)
      Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
  })
  if (hidePopover)
    Object.defineProperty(HTMLElement.prototype, 'hidePopover', hidePopover)
  else Reflect.deleteProperty(HTMLElement.prototype, 'hidePopover')
})
beforeEach(() => {
  resetMockRouteSource()
  resetMockTripSource()
  store.dispatch(baseApi.util.resetApiState())
})
afterEach(() => {
  cleanup()
  store.dispatch(baseApi.util.resetApiState())
  resetMockRouteSource()
  resetMockTripSource()
  vi.restoreAllMocks()
})
const Location = () => (
  <output aria-label="Текущий URL">{useLocation().pathname}</output>
)
const renderCreate = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/trips/new']}>
        <Location />
        <AppRouter />
      </MemoryRouter>
    </Provider>,
  )
const ready = async () => {
  await screen.findByLabelText('Дата рейса')
}
const fill = () => {
  for (const [label, value] of [
    ['Дата рейса', '2026-11-03'],
    ['Время начала', '08:00'],
    ['Время окончания', '20:00'],
    ['Водитель', 'driver-001'],
    ['Транспортное средство', 'vehicle-001'],
  ])
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  fireEvent.change(screen.getByLabelText('Комментарий / особые условия'), {
    target: { value: 'Условия доставки' },
  })
}
const openSelector = async () => {
  fireEvent.click(screen.getByRole('button', { name: 'Добавить маршрут' }))
  const dialog = screen.getByRole('dialog', {
    name: 'Добавить маршруты в рейс',
  })
  await within(dialog).findByRole('checkbox', { name: 'Выбрать MR-000122' })
  return within(dialog)
}
const addOne = async () => {
  const selector = await openSelector()
  fireEvent.click(selector.getByRole('checkbox', { name: 'Выбрать MR-000122' }))
  fireEvent.click(selector.getByRole('button', { name: 'Добавить в рейс' }))
}
const extraRoute = () => {
  const route = getMockRoutes()[1]
  return createMockRoute({
    date: route.date,
    startPoint: route.startPoint,
    endPoint: route.endPoint,
    startTime: route.startTime,
    endTime: route.endTime,
  })
}

it('validates required fields without changing data', async () => {
  renderCreate()
  await ready()
  expect(screen.getByLabelText('Статус').hasAttribute('disabled')).toBe(true)
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить рейс' }))
  for (const text of [
    'Выберите дату рейса',
    'Укажите время начала',
    'Укажите время окончания',
    'Добавьте хотя бы один маршрут',
    'Выберите водителя',
    'Выберите транспортное средство',
  ])
    expect(screen.getAllByText(text).length).toBeGreaterThan(0)
  expect(screen.getByLabelText('Водитель').getAttribute('aria-invalid')).toBe(
    'true',
  )
  expect(
    screen.getByLabelText('Транспортное средство').getAttribute('aria-invalid'),
  ).toBe('true')
  expect(document.activeElement).toBe(screen.getByLabelText('Дата рейса'))
  const driver = screen.getByLabelText('Водитель')
  driver.focus()
  fireEvent.change(driver, { target: { value: 'driver-001' } })
  expect(document.activeElement).toBe(driver)
  expect(getMockTrips()).toHaveLength(2)
  expect(getMockRoutes()[1].status).toBe('created')
})

it('filters selector, adds several Routes locally, prevents duplicates and discards modal cancellation', async () => {
  const extra = extraRoute()
  renderCreate()
  await ready()
  fill()
  let selector = await openSelector()
  expect(
    selector.queryByRole('checkbox', { name: 'Выбрать MR-000123' }),
  ).toBeNull()
  expect(
    selector.queryByRole('checkbox', { name: 'Выбрать MR-000121' }),
  ).toBeNull()
  expect(
    selector
      .getByRole('button', { name: 'Добавить в рейс' })
      .hasAttribute('disabled'),
  ).toBe(true)
  fireEvent.change(selector.getByRole('searchbox', { name: 'Поиск' }), {
    target: { value: 'MR-000122' },
  })
  expect(
    selector.queryByRole('checkbox', { name: `Выбрать ${extra.number}` }),
  ).toBeNull()
  fireEvent.change(selector.getByRole('searchbox', { name: 'Поиск' }), {
    target: { value: '' },
  })
  expect(
    selector.queryByRole('checkbox', { name: 'Выбрать MR-000121' }),
  ).toBeNull()
  fireEvent.change(selector.getByLabelText('Начальная дата'), {
    target: { value: '2026-11-03' },
  })
  expect(selector.getByText('Маршруты не найдены.')).toBeTruthy()
  fireEvent.change(selector.getByLabelText('Начальная дата'), {
    target: { value: '' },
  })
  fireEvent.click(
    selector.getByRole('checkbox', { name: 'Выбрать все доступные маршруты' }),
  )
  expect(selector.getByText('Выбрано: 2')).toBeTruthy()
  expect(getMockRoutes()[1].status).toBe('created')
  expect(getMockRoutes().find((route) => route.id === extra.id)?.status).toBe(
    'created',
  )
  fireEvent.click(selector.getByRole('button', { name: 'Отмена' }))
  expect(
    screen.queryByRole('table', { name: 'Маршруты в черновике' }),
  ).toBeNull()
  selector = await openSelector()
  expect(selector.getByText('Выбрано: 0')).toBeTruthy()
  fireEvent.click(
    selector.getByRole('checkbox', { name: 'Выбрать все доступные маршруты' }),
  )
  fireEvent.click(selector.getByRole('button', { name: 'Добавить в рейс' }))
  expect(
    screen.getByRole('table', { name: 'Маршруты в черновике' }),
  ).toBeTruthy()
  expect(getMockRoutes()[1].status).toBe('created')
  expect(getMockRoutes().find((route) => route.id === extra.id)?.status).toBe(
    'created',
  )
  selector = await openSelector()
  expect(
    selector
      .getByRole('checkbox', { name: 'Выбрать MR-000122' })
      .hasAttribute('disabled'),
  ).toBe(true)
  expect(selector.getAllByText('Уже добавлен')).toHaveLength(2)
  fireEvent.change(selector.getByRole('searchbox', { name: 'Поиск' }), {
    target: { value: 'missing' },
  })
  fireEvent.click(selector.getByRole('button', { name: 'Сбросить фильтры' }))
  expect(selector.getAllByText('Уже добавлен')).toHaveLength(2)
  fireEvent.click(selector.getByRole('button', { name: 'Отмена' }))
})

it('views Route in a new tab and removes only the local draft association', async () => {
  const open = vi.spyOn(window, 'open').mockReturnValue(null)
  renderCreate()
  await ready()
  fill()
  await addOne()
  const row = within(
    screen.getByRole('table', { name: 'Маршруты в черновике' }),
  ).getAllByRole('row')[1]
  fireEvent.click(
    within(row).getByRole('menuitem', { name: 'Посмотреть', hidden: true }),
  )
  expect(open).toHaveBeenCalledWith(
    '/routes/route-002',
    '_blank',
    'noopener,noreferrer',
  )
  expect((screen.getByLabelText('Дата рейса') as HTMLInputElement).value).toBe(
    '2026-11-03',
  )
  fireEvent.click(
    within(row).getByRole('menuitem', {
      name: 'Удалить из рейса',
      hidden: true,
    }),
  )
  expect(
    screen.queryByRole('table', { name: 'Маршруты в черновике' }),
  ).toBeNull()
  expect(getMockRoutes()[1].status).toBe('created')
  fireEvent.click(screen.getByRole('button', { name: 'Отмена' }))
  expect(await screen.findByRole('heading', { name: 'Рейсы' })).toBeTruthy()
  expect(getMockTrips()).toHaveLength(2)
})

it.each(['Открыть рейс', 'К списку рейсов'] as const)(
  'saves once, shows success and navigates through %s',
  async (action) => {
    renderCreate()
    await ready()
    fill()
    await addOne()
    const save = screen.getByRole('button', { name: 'Сохранить рейс' })
    fireEvent.click(save)
    fireEvent.click(save)
    expect(save.hasAttribute('disabled')).toBe(true)
    const modal = await screen.findByRole('dialog', { name: 'Рейс сохранён' })
    expect(
      within(modal).getByText('Рейс TR-000125 успешно создан'),
    ).toBeTruthy()
    expect(screen.getByLabelText('Текущий URL').textContent).toBe('/trips/new')
    expect(getMockTrips()).toHaveLength(3)
    expect(getMockRoutes()[1].status).toBe('assigned')
    fireEvent.click(within(modal).getByRole('button', { name: action }))
    if (action === 'Открыть рейс') {
      await screen.findByRole('heading', { name: 'Рейс TR-000125' })
      expect(screen.getByLabelText('Текущий URL').textContent).toBe(
        '/trips/created-trip-1',
      )
      const routes = within(
        screen.getByRole('table', { name: 'Маршруты в рейсе' }),
      )
      expect(
        routes.getByRole('link', { name: 'MR-000122' }).getAttribute('href'),
      ).toBe('/routes/route-002')
      expect(routes.getByText('Назначен')).toBeTruthy()
      const heading = screen.getByRole('heading', { name: 'Рейс TR-000125' })
      expect(within(heading.parentElement!).getByText('Назначен')).toBeTruthy()
      const status = within(
        screen.getByRole('region', { name: 'Статус рейса' }),
      )
      expect(
        (status.getByLabelText('Изменить статус') as HTMLSelectElement).value,
      ).toBe('assigned')
      await status.findByRole('list')
      expect(status.getAllByRole('listitem')).toHaveLength(4)
    } else {
      expect(
        await screen.findByRole('link', { name: 'TR-000125' }),
      ).toHaveProperty('href', expect.stringContaining('/trips/created-trip-1'))
      const row = screen.getByRole('link', { name: 'TR-000125' }).closest('tr')!
      expect(within(row).getByText('Назначен')).toBeTruthy()
      fireEvent.click(screen.getByRole('button', { name: 'Создать рейс' }))
      await ready()
      fireEvent.click(screen.getByRole('button', { name: 'Добавить маршрут' }))
      const selector = within(
        screen.getByRole('dialog', { name: 'Добавить маршруты в рейс' }),
      )
      await selector.findByText('Маршруты не найдены.')
      expect(
        selector.queryByRole('checkbox', { name: 'Выбрать MR-000122' }),
      ).toBeNull()
    }
  },
)

it('retains draft after a conflict and permits a corrected manual retry', async () => {
  const extra = extraRoute()
  renderCreate()
  await ready()
  fill()
  await addOne()
  // Another successful save takes the selected Route after our local selection.
  saveTripWithRoutes({
    date: '2026-11-04',
    startTime: '09:00',
    endTime: '18:00',
    routeIds: ['route-002'],
    driverId: 'driver-001',
    vehicleId: 'vehicle-001',
  })
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить рейс' }))
  expect(
    await screen.findByText('Маршрут MR-000122 уже недоступен для назначения.'),
  ).toBeTruthy()
  expect(
    (
      screen.getByLabelText(
        'Комментарий / особые условия',
      ) as HTMLTextAreaElement
    ).value,
  ).toBe('Условия доставки')
  const row = within(
    screen.getByRole('table', { name: 'Маршруты в черновике' }),
  ).getAllByRole('row')[1]
  fireEvent.click(
    within(row).getByRole('menuitem', {
      name: 'Удалить из рейса',
      hidden: true,
    }),
  )
  const selector = await openSelector()
  fireEvent.click(
    selector.getByRole('checkbox', { name: `Выбрать ${extra.number}` }),
  )
  fireEvent.click(selector.getByRole('button', { name: 'Добавить в рейс' }))
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить рейс' }))
  await screen.findByRole('dialog', { name: 'Рейс сохранён' })
  expect(getMockTrips()).toHaveLength(4)
})

it('focuses the route trigger for missing Routes without marking the button aria-invalid', async () => {
  renderCreate()
  await ready()
  fill()
  fireEvent.click(screen.getByRole('button', { name: 'Сохранить рейс' }))
  const trigger = screen.getByRole('button', { name: 'Добавить маршрут' })
  expect(document.activeElement).toBe(trigger)
  expect(trigger.hasAttribute('aria-invalid')).toBe(false)
  const error = screen.getByText('Добавьте хотя бы один маршрут')
  expect(trigger.getAttribute('aria-describedby')).toBe(error.id)
  expect(getMockTrips()).toHaveLength(2)
})
