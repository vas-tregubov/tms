import { expect, it } from 'vitest'

import type { RouteTimelineItem } from '../api/types'
import { getRouteTimelineProgress } from './getRouteTimelineProgress'

const timeline: RouteTimelineItem[] = [
  'created',
  'assigned',
  'intransit',
  'completed',
].map((status) => ({
  status,
  dateTime: '01.11.2026 10:24',
  author: 'Алексей Петров',
  state: 'current',
}))

it.each([
  ['created', 1],
  ['assigned', 2],
  ['in_progress', 3],
  ['intransit', 3],
  ['completed', 4],
] as const)(
  'derives progress from %s while preserving event data',
  (status, count) => {
    const result = getRouteTimelineProgress(status, timeline)
    expect(result.filter((item) => item.state === 'completed')).toHaveLength(
      count,
    )
    expect(result.filter((item) => item.state === 'current')).toHaveLength(
      4 - count,
    )
    expect(
      result.map(({ status, dateTime, author }) => ({
        status,
        dateTime,
        author,
      })),
    ).toEqual(
      timeline.map(({ status, dateTime, author }) => ({
        status,
        dateTime,
        author,
      })),
    )
    expect(timeline.every((item) => item.state === 'current')).toBe(true)
  },
)

it.each([
  ['created', 1],
  ['assigned', 2],
  ['intransit', 3],
  ['in_progress', 3],
  ['completed', 4],
] as const)(
  'always returns the complete lifecycle for %s with incomplete history',
  (status, count) => {
    const history = [timeline[0]]
    const result = getRouteTimelineProgress(status, history)
    expect(result.map((item) => item.status)).toEqual([
      'created',
      'assigned',
      'intransit',
      'completed',
    ])
    expect(result.map((item) => item.state)).toEqual(
      Array.from({ length: 4 }, (_, index) =>
        index < count ? 'completed' : 'current',
      ),
    )
    expect(result[0].dateTime).toBe(history[0].dateTime)
    expect(result[0].author).toBe(history[0].author)
    expect(
      result
        .slice(1)
        .every((item) => item.dateTime === '' && item.author === ''),
    ).toBe(true)
  },
)

it('renders the lifecycle without fabricated event data for empty or unknown history', () => {
  const result = getRouteTimelineProgress('assigned', [])
  expect(result).toHaveLength(4)
  expect(result.filter((item) => item.state === 'completed')).toHaveLength(2)
  expect(
    result.every((item) => item.dateTime === '' && item.author === ''),
  ).toBe(true)
  const unknown = getRouteTimelineProgress('custom', [
    { ...timeline[0], status: 'custom' },
  ])
  expect(unknown).toHaveLength(4)
  expect(
    unknown.every(
      (item) =>
        item.state === 'current' && item.dateTime === '' && item.author === '',
    ),
  ).toBe(true)
})
