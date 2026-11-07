import { expect, it } from 'vitest'

import { getTripTimelineProgress } from './getTripTimelineProgress'

it('shows a newly assigned Trip as two completed and two pending stages without fake event metadata', () => {
  const result = getTripTimelineProgress('assigned', [])
  expect(result.map((item) => item.status)).toEqual([
    'created',
    'assigned',
    'intransit',
    'completed',
  ])
  expect(result.map((item) => item.state)).toEqual([
    'completed',
    'completed',
    'pending',
    'pending',
  ])
  expect(
    result.every((item) => item.dateTime === '' && item.author === ''),
  ).toBe(true)
})
it('preserves real event metadata and safely handles unknown status', () => {
  const records = [
    {
      status: 'created',
      dateTime: '01.11.2026 10:24',
      author: 'Алексей Петров',
      comment: '',
    },
  ]
  expect(getTripTimelineProgress('assigned', records)[0]).toMatchObject({
    dateTime: records[0].dateTime,
    author: records[0].author,
  })
  expect(
    getTripTimelineProgress('custom', records).every(
      (item) => item.state === 'pending',
    ),
  ).toBe(true)
})
