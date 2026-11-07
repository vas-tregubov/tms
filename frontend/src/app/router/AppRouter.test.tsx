import type { ReactNode } from 'react'
import {
  fireEvent,
  render as renderView,
  screen,
  within,
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { beforeEach, expect, it } from 'vitest'

import AppRouter from '@/app/router'
import { store } from '@/app/store'
import { baseApi } from '@/shared/api'

beforeEach(() => {
  store.dispatch(baseApi.util.resetApiState())
})

const render = (ui: ReactNode) =>
  renderView(<Provider store={store}>{ui}</Provider>)

it('opens Home as the application entry point', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRouter />
    </MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: 'Главная' })).toBeTruthy()
  expect(
    screen.getByRole('link', { name: 'Главная' }).getAttribute('aria-current'),
  ).toBe('page')
  expect(
    screen.getByRole('link', { name: 'Маршруты' }).hasAttribute('aria-current'),
  ).toBe(false)
})

it('keeps Trip Details inside the shell with Trips active', async () => {
  render(
    <MemoryRouter initialEntries={['/trips/trip-001']}>
      <AppRouter />
    </MemoryRouter>,
  )
  expect(
    await screen.findByRole('heading', { name: 'Рейс TR-000123' }),
  ).toBeTruthy()
  expect(screen.getByRole('banner')).toBeTruthy()
  expect(
    within(screen.getByRole('navigation', { name: 'Основная навигация' }))
      .getByRole('link', { name: 'Рейсы' })
      .getAttribute('aria-current'),
  ).toBe('page')
})

it('renders route creation rather than treating new as a route ID', () => {
  render(
    <MemoryRouter initialEntries={['/routes/new']}>
      <AppRouter />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', { name: 'Создание маршрута' }),
  ).toBeTruthy()
  expect(screen.queryByText('ID: new')).toBeNull()
  expect(
    within(screen.getByRole('navigation', { name: 'Основная навигация' }))
      .getByRole('link', { name: 'Маршруты' })
      .getAttribute('aria-current'),
  ).toBe('page')
})

it('keeps login outside the application shell', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AppRouter />
    </MemoryRouter>,
  )

  expect(screen.getByRole('heading', { name: 'Вход' })).toBeTruthy()
  expect(screen.queryByRole('banner')).toBeNull()
  expect(
    screen.queryByRole('navigation', { name: 'Основная навигация' }),
  ).toBeNull()
})

it('navigates through both Sidebar groups while preserving the shell', async () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <AppRouter />
    </MemoryRouter>,
  )

  const header = screen.getByRole('banner')
  const home = screen.getByRole('link', { name: 'Главная' })
  const routes = screen.getByRole('link', { name: 'Маршруты' })
  expect(home.getAttribute('aria-current')).toBe('page')

  fireEvent.click(routes)

  expect(await screen.findByRole('heading', { name: 'Маршруты' })).toBeTruthy()
  expect(routes.getAttribute('aria-current')).toBe('page')
  expect(home.hasAttribute('aria-current')).toBe(false)
  const trips = screen.getByRole('link', { name: 'Рейсы' })
  expect(trips.getAttribute('href')).toBe('/trips')
  fireEvent.click(trips)

  expect(await screen.findByRole('heading', { name: 'Рейсы' })).toBeTruthy()
  expect(trips.getAttribute('aria-current')).toBe('page')
  expect(
    screen.getByRole('link', { name: 'Маршруты' }).hasAttribute('aria-current'),
  ).toBe(false)

  fireEvent.click(screen.getByRole('link', { name: 'Настройки' }))

  expect(await screen.findByRole('heading', { name: 'Настройки' })).toBeTruthy()
  expect(
    screen
      .getByRole('link', { name: 'Настройки' })
      .getAttribute('aria-current'),
  ).toBe('page')
  expect(trips.hasAttribute('aria-current')).toBe(false)
  fireEvent.click(home)

  expect(await screen.findByRole('heading', { name: 'Главная' })).toBeTruthy()
  expect(home.getAttribute('aria-current')).toBe('page')
  const navigation = within(
    screen.getByRole('navigation', { name: 'Основная навигация' }),
  )
  expect(navigation.getAllByRole('link', { current: 'page' })).toHaveLength(1)
  expect(screen.getByRole('banner')).toBe(header)
})

it('shows a not-found placeholder for an unknown URL', () => {
  render(
    <MemoryRouter initialEntries={['/missing']}>
      <AppRouter />
    </MemoryRouter>,
  )

  expect(
    screen.getByRole('heading', { name: 'Страница не найдена' }),
  ).toBeTruthy()
})
