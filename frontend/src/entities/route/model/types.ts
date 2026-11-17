import type { DistributionCenter } from '@/entities/distribution-center'
import type { LogisticsPoint } from '@/entities/logistics-point'

export type RouteStatus = 'created' | 'assigned' | 'intransit' | 'completed'

export type Route = {
  id: string
  number: string
  date: string
  startPoint: DistributionCenter | LogisticsPoint
  endPoint: DistributionCenter | LogisticsPoint
  startTime: string
  endTime: string
  comment?: string | null
  status: RouteStatus
}
