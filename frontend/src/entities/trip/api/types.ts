// Temporary read-only Details projection; not a domain event or audit-log model.
export type TripStatusRecord = {
  status: string
  dateTime: string
  author: string
  comment: string
}

export type CreateTripInput = {
  date: string
  startTime: string
  endTime: string
  routeIds: string[]
  driverId: string
  vehicleId: string
  comment?: string
}
