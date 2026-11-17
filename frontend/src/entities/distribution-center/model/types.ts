export type DistributionCenter = {
  id: string
  name: string
  address: string
} & (
  | { latitude: number; longitude: number }
  | { latitude?: null; longitude?: null }
)
