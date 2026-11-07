import type { TripStatusRecord } from '../api/types'
import { getTripStatusOption, TRIP_STATUS_OPTIONS } from './statusOptions'

// Existing Details progress projection; event metadata is never fabricated.
export const getTripTimelineProgress = (
  status: string,
  records: TripStatusRecord[],
) => {
  const current = getTripStatusOption(status)
  const currentIndex = TRIP_STATUS_OPTIONS.findIndex(
    (option) => option === current,
  )
  return TRIP_STATUS_OPTIONS.map((option, index) => {
    const record = records.find((item) => item.status === option.value)
    return {
      status: option.value,
      label: option.label,
      dateTime: record?.dateTime ?? '',
      author: record?.author ?? '',
      state:
        index <= currentIndex ? ('completed' as const) : ('pending' as const),
    }
  })
}
