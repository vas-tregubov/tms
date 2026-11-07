import type { RouteDraft } from '../model/createRouteSlice'

export type DraftErrors = Partial<Record<keyof RouteDraft, string>>

const isTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export const validateStep = (draft: RouteDraft, step: number): DraftErrors => {
  const errors: DraftErrors = {}
  if (step === 1) {
    const date = Date.parse(draft.date)
    if (
      !draft.date ||
      !Number.isFinite(date) ||
      date < Date.UTC(1930, 0, 1) ||
      date > Date.UTC(2099, 11, 31)
    )
      errors.date = 'Выберите дату отправки'
    if (draft.status !== 'created') errors.status = 'Выберите статус маршрута'
  }
  if (step === 2) {
    if (!draft.startPointId) errors.startPointId = 'Выберите точку отправления'
    if (!draft.endPointId) errors.endPointId = 'Выберите точку назначения'
  }
  if (step === 3) {
    if (!isTime(draft.startTime))
      errors.startTime = 'Введите корректное время отправления'
    if (!isTime(draft.endTime))
      errors.endTime = 'Введите корректное время прибытия'
  }
  return errors
}
