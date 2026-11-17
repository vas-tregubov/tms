import { expect, it } from 'vitest'

import { formatDriverName } from './formatDriverName'

const driver = {
  firstName: 'Алексей',
  lastName: 'Петров',
  middleName: 'Иванович',
}

it('formats each supported Driver display without storing a duplicate name', () => {
  expect(formatDriverName(driver, 'full')).toBe('Петров Алексей Иванович')
  expect(formatDriverName(driver, 'first-last')).toBe('Алексей Петров')
  expect(formatDriverName(driver, 'initials')).toBe('Петров А. И.')
})

it.each([null, undefined])(
  'omits absent patronymics (%s) without placeholder text',
  (middleName) => {
    expect(formatDriverName({ ...driver, middleName }, 'full')).toBe(
      'Петров Алексей',
    )
    expect(formatDriverName({ ...driver, middleName }, 'initials')).toBe(
      'Петров А.',
    )
  },
)
