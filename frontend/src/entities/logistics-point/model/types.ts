export type LogisticsPoint = {
  id: string
  name: string
  address: string
  schedule: string
  status: string
} & (
  | { latitude: number; longitude: number }
  | { latitude?: null; longitude?: null }
)
