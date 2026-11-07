export type { Trip } from './model/types'
export {
  useGetTripsQuery,
  useGetTripReferencesQuery,
  useGetTripByIdQuery,
  useGetTripTimelineQuery,
} from './api/tripApi'

export { TRIP_STATUS_OPTIONS, getTripStatusOption } from './lib/statusOptions'

export type { TripStatusRecord } from './api/types'

export type { CreateTripInput } from './api/types'
// Temporary mock use-case boundary, not for UI consumers.
export { getMockTripReferences, saveMockTrip } from './api/mockTripSource'

export { getTripTimelineProgress } from './lib/getTripTimelineProgress'
