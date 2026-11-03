import { expect, it } from 'vitest'

import reducer, {
  emptyDraft,
  resetCreateRoute,
  setStep,
  updateDraft,
} from './createRouteSlice'

it('keeps the step within the four-step flow', () => {
  expect(reducer(undefined, setStep(0)).currentStep).toBe(1)
  expect(reducer(undefined, setStep(5)).currentStep).toBe(4)
})

it('resets both the draft and current step', () => {
  const populated = reducer(
    undefined,
    updateDraft({
      date: '2026-11-10',
      status: 'created',
      startPointId: 'dc-001',
      endPointId: 'point-001',
      startTime: '09:00',
      endTime: '10:00',
      comment: 'Условия',
    }),
  )
  const state = reducer(populated, setStep(4))
  expect(reducer(state, resetCreateRoute())).toEqual({
    draft: emptyDraft,
    currentStep: 1,
  })
})
