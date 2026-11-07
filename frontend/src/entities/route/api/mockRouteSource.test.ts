import { beforeEach, expect, it } from 'vitest'

import {
  getMockRoutes,
  resetMockRouteSource,
  updateMockRoute,
} from './mockRouteSource'

beforeEach(resetMockRouteSource)

it('immutably replaces editable values while preserving server-owned fields', () => {
  const before = getMockRoutes()
  const original = before[0]
  const changes = {
    date: '2026-11-10',
    startPoint: original.endPoint,
    endPoint: original.startPoint,
    startTime: '23:59',
    endTime: '00:00',
    comment: undefined,
    // Unexpected runtime properties must not overwrite server-owned values.
    id: 'untrusted-id',
    number: 'UNTRUSTED',
    status: 'completed',
  }
  const updated = updateMockRoute({ id: original.id, changes })
  expect(updated).toEqual({
    ...original,
    date: changes.date,
    startPoint: changes.startPoint,
    endPoint: changes.endPoint,
    startTime: changes.startTime,
    endTime: changes.endTime,
    comment: undefined,
  })
  expect(getMockRoutes()).not.toBe(before)
  expect(before[0]).toBe(original)
  expect(original.date).toBe('2026-11-02')
  expect(original.comment).toBe('Температурный режим +2…+6 °C')
  expect(getMockRoutes().find((route) => route.id === original.id)).toBe(
    updated,
  )
})
