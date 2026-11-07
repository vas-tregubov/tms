import type { RouteFormErrors, RouteFormValues } from '../model/form'

const isTime = (value: string) => /^([01]\d|2[0-3]):[0-5]\d$/.test(value)

export const validateRouteFormStep = (
  draft: RouteFormValues,
  step: number,
): RouteFormErrors => {
  const errors: RouteFormErrors = {}
  if (step === 1) {
    const date = Date.parse(draft.date)
    if (
      !draft.date ||
      !Number.isFinite(date) ||
      date < Date.UTC(1930, 0, 1) ||
      date > Date.UTC(2099, 11, 31)
    )
      errors.date = 'Выберите дату отправки'
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
