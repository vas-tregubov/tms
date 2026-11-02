import type { DistributionCenter } from '@/entities/distribution-center'
import type { LogisticsPoint } from '@/entities/logistics-point'

export type Route = {
  id: string
  date: string
  startPoint: DistributionCenter | LogisticsPoint
  endPoint: DistributionCenter | LogisticsPoint
  startTime: string
  endTime: string
  status: string
}
