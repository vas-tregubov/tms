import { expect, it } from 'vitest'

import { getRouteFormChanges } from './getRouteFormChanges'

const points = [
  { id: 'north', name: 'РЦ Северный', address: 'Складская, 1' },
  { id: 'central', name: 'Пункт Центральный', address: 'Складская, 2' },
]
const draft = {
  date: '2026-11-10',
  startPointId: 'north',
  endPointId: 'central',
  startTime: '09:00',
  endTime: '10:30',
  comment: '',
  status: 'assigned',
}

it('maps selected IDs to API point values and excludes form-only fields', () => {
  expect(getRouteFormChanges(draft, points)).toEqual({
    date: draft.date,
    startPoint: points[0],
    endPoint: points[1],
    startTime: draft.startTime,
    endTime: draft.endTime,
    comment: undefined,
  })
})

it.each(['startPointId', 'endPointId'] as const)(
  'does not construct an incomplete payload when %s cannot be resolved',
  (field) =>
    expect(
      getRouteFormChanges({ ...draft, [field]: 'missing' }, points),
    ).toBeUndefined(),
)
