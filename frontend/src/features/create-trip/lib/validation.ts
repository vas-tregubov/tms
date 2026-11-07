import type { CreateTripInput } from '@/entities/trip'

export type TripDraft = CreateTripInput & { comment: string }
export type TripDraftErrors = Partial<Record<keyof TripDraft, string>>
export const validateTripDraft = (draft: TripDraft): TripDraftErrors => {
  const errors: TripDraftErrors = {}
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(draft.date) ||
    !Number.isFinite(Date.parse(draft.date)) ||
    draft.date < '1930-01-01' ||
    draft.date > '2099-12-31'
  )
    errors.date = 'Выберите дату рейса'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.startTime))
    errors.startTime = 'Укажите время начала'
  if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(draft.endTime))
    errors.endTime = 'Укажите время окончания'
  if (!draft.routeIds.length) errors.routeIds = 'Добавьте хотя бы один маршрут'
  if (!draft.driverId) errors.driverId = 'Выберите водителя'
  if (!draft.vehicleId) errors.vehicleId = 'Выберите транспортное средство'
  return errors
}
