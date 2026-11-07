import type { Trip } from '../model/types'
import { mockTrips } from './mockTrips'

let trips = mockTrips
let sequence = 0
export const getMockTrips = () => trips
export const getMockTripReferences = () => ({
  drivers: [
    ...new Map(mockTrips.map((trip) => [trip.driver.id, trip.driver])).values(),
  ],
  vehicles: [
    ...new Map(
      mockTrips.map((trip) => [trip.vehicle.id, trip.vehicle]),
    ).values(),
  ],
})
export const saveMockTrip = (
  input: Pick<
    Trip,
    | 'date'
    | 'routes'
    | 'driver'
    | 'vehicle'
    | 'startTime'
    | 'endTime'
    | 'comment'
  >,
): Trip => {
  sequence += 1
  const trip: Trip = {
    ...input,
    id: `created-trip-${sequence}`,
    number: `TR-${String(124 + sequence).padStart(6, '0')}`,
    status: 'assigned',
  }
  trips = [...trips, trip]
  return trip
}
export const resetMockTripSource = () => {
  trips = mockTrips
  sequence = 0
}
