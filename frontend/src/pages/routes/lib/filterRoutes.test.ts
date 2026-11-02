import { expect, it } from 'vitest'

import type { Route } from '@/entities/route'

import { filterRoutes, type RouteFilters } from './filterRoutes'

const firstRoute: Route = {
  id: 'opaque-alpha',
  number: 'MR-000123',
  date: '2026-11-01',
  startPoint: { id: 'dc-north', name: 'РЦ Северный', address: 'Складская, 1' },
  endPoint: { id: 'dc-east', name: 'РЦ Восточный', address: 'Складская, 2' },
  startTime: '09:00',
  endTime: '10:00',
  status: 'assigned',
}

const routes: Route[] = [
  firstRoute,
  {
    ...firstRoute,
    id: 'opaque-beta',
    number: 'MR-000122',
    date: '2026-11-02',
    startPoint: { id: 'dc-south', name: 'РЦ Южный', address: 'Складская, 3' },
    endPoint: { id: 'dc-west', name: 'РЦ Западный', address: 'Складская, 4' },
  },
  {
    ...firstRoute,
    id: 'opaque-gamma',
    number: 'MR-000121',
    date: '2026-11-02',
    status: 'completed',
  },
  {
    ...firstRoute,
    id: 'opaque-delta',
    number: 'MR-000120',
    date: '2026-11-03',
  },
]

const noFilters: RouteFilters = {
  search: '',
  startDate: '',
  endDate: '',
  status: '',
}

it('returns the complete ordered result without filters', () => {
  expect(filterRoutes(routes, noFilters)).toEqual(routes)
})

it.each(['  mr-000122  ', 'юЖнЫй', 'ЗАПАДНЫЙ'])(
  'matches business number or point names for %s',
  (search) => {
    expect(
      filterRoutes(routes, { ...noFilters, search }).map((route) => route.id),
    ).toEqual(['opaque-beta'])
  },
)

it('combines inclusive date bounds and status', () => {
  const result = filterRoutes(routes, {
    ...noFilters,
    startDate: '2026-11-01',
    endDate: '2026-11-02',
    status: 'assigned',
  })

  expect(result.map((route) => route.id)).toEqual([
    'opaque-alpha',
    'opaque-beta',
  ])
})

it('ignores inverted date bounds while retaining search and status filters', () => {
  const result = filterRoutes(routes, {
    search: 'MR-000121',
    startDate: '2026-11-03',
    endDate: '2026-11-01',
    status: 'completed',
  })

  expect(result.map((route) => route.id)).toEqual(['opaque-gamma'])
})
