import { expect, it } from 'vitest'

import { emptyDraft } from '../model/createRouteSlice'
import { validateStep } from './validation'

it('validates only the requested step and treats comment as optional', () => {
  expect(Object.keys(validateStep(emptyDraft, 1))).toEqual(['date', 'status'])
  expect(Object.keys(validateStep(emptyDraft, 2))).toEqual([
    'startPointId',
    'endPointId',
  ])
  expect(
    validateStep({ ...emptyDraft, startTime: '23:59', endTime: '00:00' }, 3),
  ).toEqual({})
  expect(
    validateStep(
      { ...emptyDraft, startPointId: 'same', endPointId: 'same' },
      2,
    ),
  ).toEqual({})
})

it('rejects technically invalid times without adding business time rules', () => {
  expect(
    validateStep({ ...emptyDraft, startTime: '24:00', endTime: '12:60' }, 3),
  ).toEqual({ startTime: expect.any(String), endTime: expect.any(String) })
})
