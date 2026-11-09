import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import AppLayout from '@/app/layouts/app-layout'

import ErrorBoundary from './ErrorBoundary'
import ErrorFallback from './ErrorFallback'

const BrokenChild = () => {
  throw new Error('PRIVATE_ERROR: internal payload')
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => vi.restoreAllMocks())

it('renders healthy children', () => {
  render(
    <ErrorBoundary fallback={<ErrorFallback />}>
      <p>Рабочая страница</p>
    </ErrorBoundary>,
  )
  expect(screen.getByText('Рабочая страница')).toBeTruthy()
  expect(screen.queryByRole('alert')).toBeNull()
})

it('contains a shell exception without Router or Redux and hides technical details', () => {
  render(
    <ErrorBoundary fallback={<ErrorFallback />}>
      <AppLayout
        sidebar={{
          renderLink: () => <BrokenChild />,
          hrefs: {
            home: '/',
            routes: '/routes',
            trips: '/trips',
            directories: '/directories',
            reports: '/reports',
            settings: '/settings',
          },
        }}
        header={{
          notifications: { onClick: () => {} },
          userMenu: {
            initials: 'АП',
            name: 'Алексей Петров',
            role: 'Диспетчер',
            onClick: () => {},
          },
        }}
      >
        <p>Page</p>
      </AppLayout>
    </ErrorBoundary>,
  )
  expect(screen.getByRole('alert')).toBeTruthy()
  expect(
    screen.getByRole('heading', { name: 'Произошла непредвиденная ошибка' }),
  ).toBeTruthy()
  expect(screen.queryByRole('banner')).toBeNull()
  expect(screen.queryByText('Page')).toBeNull()
})

it('shows the standalone fallback for a descendant exception and delegates reload', () => {
  const reload = vi.fn()
  render(
    <ErrorBoundary fallback={<ErrorFallback onReload={reload} />}>
      <BrokenChild />
    </ErrorBoundary>,
  )
  expect(screen.getByRole('main')).toBeTruthy()
  expect(
    screen.getByRole('heading', { name: 'Произошла непредвиденная ошибка' }),
  ).toBeTruthy()
  expect(screen.queryByText(/PRIVATE_ERROR|BrokenChild/)).toBeNull()
  expect(screen.queryByRole('button', { name: 'На главную' })).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Обновить страницу' }))
  expect(reload).toHaveBeenCalledOnce()
})
