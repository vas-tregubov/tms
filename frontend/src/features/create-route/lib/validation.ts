import { validateRouteFormStep } from '@/entities/route'

import type { RouteDraft } from '../model/createRouteSlice'

export type DraftErrors = Partial<Record<keyof RouteDraft, string>>

export const validateStep = (draft: RouteDraft, step: number): DraftErrors => {
  const errors: DraftErrors = validateRouteFormStep(draft, step)
  if (step === 1 && draft.status !== 'created') {
    errors.status = 'Выберите статус маршрута'
  }
  return errors
}
