import type { DistributionCenter } from '@/entities/distribution-center'
import type { LogisticsPoint } from '@/entities/logistics-point'

export type Order = {
  id: string
  date: string
  startPoint: DistributionCenter | LogisticsPoint
  endPoints: (DistributionCenter | LogisticsPoint)[]
  weight: number
  volume?: number
  status: string
}
