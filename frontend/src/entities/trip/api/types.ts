import type { TripStatus } from '../model/types'

// Read-only status history DTO, independent of timeline presentation.
export type TripStatusRecord = {
  status: TripStatus
  occurredAt: string
  author: string
  comment?: string | null
}

export type CreateTripInput = {
  date: string
  startTime: string
  endTime: string
  routeIds: string[]
  driverId: string
  vehicleId: string
  comment?: string | null
}
