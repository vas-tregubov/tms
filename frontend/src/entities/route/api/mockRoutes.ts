import type { Route } from '../model/types'

const distributionCenter: Route['startPoint'] = {
  id: 'dc-001',
  name: 'РЦ Северный',
  address: 'Москва, Складская улица, 1',
}

const logisticsPoint: Route['endPoint'] = {
  id: 'point-001',
  name: 'Логистический пункт Центральный',
  address: 'Москва, Транспортная улица, 10',
  coordinates: '55.7558, 37.6173',
  acceptanceSchedule: 'Ежедневно 08:00–20:00',
  status: 'active',
}

// Internal fixtures; these values are not an exhaustive domain status dictionary.
export const mockRoutes: Route[] = [
  {
    id: 'route-001',
    date: '2026-11-02',
    startPoint: distributionCenter,
    endPoint: logisticsPoint,
    startTime: '09:00',
    endTime: '10:30',
    status: 'assigned',
  },
  {
    id: 'route-002',
    date: '2026-11-02',
    startPoint: logisticsPoint,
    endPoint: distributionCenter,
    startTime: '11:00',
    endTime: '12:30',
    status: 'created',
  },
  {
    id: 'route-003',
    date: '2026-11-01',
    startPoint: distributionCenter,
    endPoint: logisticsPoint,
    startTime: '09:00',
    endTime: '10:30',
    status: 'completed',
  },
]
