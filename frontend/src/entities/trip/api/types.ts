// Temporary read-only Details projection; not a domain event or audit-log model.
export type TripStatusRecord = {
  status: string
  dateTime: string
  author: string
  comment: string
}
