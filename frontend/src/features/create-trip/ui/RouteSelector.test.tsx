import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterAll, beforeAll, beforeEach, expect, it, vi } from 'vitest'

import { useGetRoutesQuery, type Route } from '@/entities/route'

import RouteSelector from './RouteSelector'

vi.mock('@/entities/route', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/entities/route')>()),
  useGetRoutesQuery: vi.fn(),
}))
const methods = ['showModal', 'close'] as const
const originals = methods.map((name) =>
  Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, name),
)
beforeAll(() =>
  methods.forEach((name) =>
    Object.defineProperty(HTMLDialogElement.prototype, name, {
      configurable: true,
      value: function (this: HTMLDialogElement) {
        this.open = name === 'showModal'
      },
    }),
  ),
)
afterAll(() =>
  methods.forEach((name, index) => {
    const descriptor = originals[index]
    if (descriptor)
      Object.defineProperty(HTMLDialogElement.prototype, name, descriptor)
    else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
  }),
)
const data: Route[] = [
  'created',
  'created',
  'assigned',
  'intransit',
  'completed',
].map((status, index) => ({
  id: `route-${index}`,
  number: `MR-90000${index}`,
  date: '2026-11-02',
  startPoint: { id: 'start', name: 'РЦ', address: '' },
  endPoint: { id: 'end', name: 'Склад', address: '' },
  startTime: '08:00',
  endTime: '18:00',
  status,
}))
beforeEach(() =>
  vi.mocked(useGetRoutesQuery).mockReturnValue({
    data,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  } as ReturnType<typeof useGetRoutesQuery>),
)
it('hides unrelated assigned/intransit/completed Routes and keeps added created Routes disabled', () => {
  render(
    <RouteSelector addedIds={['route-1']} onClose={vi.fn()} onAdd={vi.fn()} />,
  )
  expect(screen.queryByRole('combobox', { name: 'Статус' })).toBeNull()
  const table = within(screen.getByRole('table', { name: 'Выбор маршрутов' }))
  for (const number of ['MR-900002', 'MR-900003', 'MR-900004'])
    expect(table.queryByText(number)).toBeNull()
  expect(
    table
      .getByRole('checkbox', { name: 'Выбрать MR-900001' })
      .hasAttribute('disabled'),
  ).toBe(true)
  expect(table.getByText('Уже добавлен')).toBeTruthy()
  expect(
    table
      .getByRole('checkbox', { name: 'Выбрать MR-900000' })
      .hasAttribute('disabled'),
  ).toBe(false)
  expect(
    screen
      .getByRole('button', { name: 'Добавить в рейс' })
      .hasAttribute('disabled'),
  ).toBe(true)
})
it('resets all filters while preserving checkbox selection and existing draft Routes', () => {
  const onAdd = vi.fn()
  render(
    <RouteSelector addedIds={['route-1']} onClose={vi.fn()} onAdd={onAdd} />,
  )
  fireEvent.click(screen.getByRole('checkbox', { name: 'Выбрать MR-900000' }))
  expect(data[0].status).toBe('created')
  fireEvent.change(screen.getByRole('searchbox', { name: 'Поиск' }), {
    target: { value: 'missing' },
  })
  fireEvent.change(screen.getByLabelText('Начальная дата'), {
    target: { value: '2030-01-01' },
  })
  fireEvent.change(screen.getByLabelText('Конечная дата'), {
    target: { value: '2030-02-01' },
  })
  fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтры' }))
  for (const name of ['Начальная дата', 'Конечная дата'])
    expect((screen.getByLabelText(name) as HTMLInputElement).value).toBe('')
  expect(
    (screen.getByRole('searchbox', { name: 'Поиск' }) as HTMLInputElement)
      .value,
  ).toBe('')
  expect(
    (
      screen.getByRole('checkbox', {
        name: 'Выбрать MR-900000',
      }) as HTMLInputElement
    ).checked,
  ).toBe(true)
  expect(screen.getByText('Выбрано: 1')).toBeTruthy()
  expect(
    screen
      .getByRole('checkbox', { name: 'Выбрать MR-900001' })
      .hasAttribute('disabled'),
  ).toBe(true)
  expect(onAdd).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole('button', { name: 'Добавить в рейс' }))
  expect(onAdd).toHaveBeenCalledWith(['route-0'])
})
