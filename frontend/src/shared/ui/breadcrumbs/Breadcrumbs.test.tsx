import { render, screen, within } from '@testing-library/react'
import { expect, it } from 'vitest'

import Breadcrumbs from './Breadcrumbs'

it('renders earlier linked items as links and the last item as current-page text', () => {
  render(
    <Breadcrumbs
      items={[
        { id: 'home', label: 'Главная', href: '/' },
        { id: 'routes', label: 'Маршруты', href: '/routes' },
        { id: 'route', label: 'MR-000123', href: '/routes/opaque-id' },
      ]}
    />,
  )

  const navigation = within(
    screen.getByRole('navigation', { name: 'Breadcrumbs' }),
  )
  expect(
    navigation.getByRole('link', { name: 'Главная' }).getAttribute('href'),
  ).toBe('/')
  expect(
    navigation.getByRole('link', { name: 'Маршруты' }).getAttribute('href'),
  ).toBe('/routes')
  expect(navigation.queryByRole('link', { name: 'MR-000123' })).toBeNull()
  expect(navigation.getByText('MR-000123').getAttribute('aria-current')).toBe(
    'page',
  )
})
