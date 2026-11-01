import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import Sidebar from '@/widgets/sidebar'

it('marks the selected navigation item as the current page', () => {
  render(
    <Sidebar
      activeItem="routes"
      hrefs={{
        home: '#home',
        routes: '#routes',
        trips: '#trips',
        directories: '#directories',
        reports: '#reports',
        settings: '#settings',
      }}
    />,
  )

  expect(
    screen.getByRole('link', { name: 'Маршруты' }).getAttribute('aria-current'),
  ).toBe('page')
  expect(
    screen.getByRole('link', { name: 'Главная' }).hasAttribute('aria-current'),
  ).toBe(false)
})
