import type { Driver } from '../model/types'

export const formatDriverName = (
  driver: Pick<Driver, 'firstName' | 'lastName' | 'middleName'>,
  format: 'full' | 'first-last' | 'initials' = 'first-last',
): string => {
  const { firstName, lastName, middleName } = driver
  if (format === 'first-last') return `${firstName} ${lastName}`
  if (format === 'initials')
    return `${lastName} ${Array.from(firstName)[0]}.${middleName ? ` ${Array.from(middleName)[0]}.` : ''}`
  return [lastName, firstName, middleName].filter(Boolean).join(' ')
}
