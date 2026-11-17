import { expect, it } from 'vitest'

import { formatRecordedDateTime } from './formatRecordedDateTime'

it.each([
  ['2026-11-01T10:24:00+03:00', '01.11.2026 10:24'],
  ['2026-11-01T07:24:00Z', '01.11.2026 07:24'],
  ['2026-10-31T23:24:00-08:00', '31.10.2026 23:24'],
])(
  'displays the recorded wall time of %s without an implicit timezone conversion',
  (value, expected) => {
    expect(formatRecordedDateTime(value)).toBe(expected)
  },
)

it.each(['', 'not-a-timestamp', '2026-11-01T10:24:00'])(
  'uses an honest fallback for invalid or offset-free metadata: %s',
  (value) => {
    expect(formatRecordedDateTime(value)).toBe('—')
  },
)
