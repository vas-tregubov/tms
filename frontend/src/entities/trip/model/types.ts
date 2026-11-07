import type { Driver } from '@/entities/driver'
import type { Route } from '@/entities/route'
import type { Vehicle } from '@/entities/vehicle'

export type Trip = {
  id: string
  number: string
  date: string
  routes: Route[]
  driver: Driver
  vehicle: Vehicle
  startTime: string
  endTime: string
  status: string
  comment?: string
}
