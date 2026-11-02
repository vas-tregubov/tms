import type { Route } from '@/entities/route'

import type { Trip } from '../model/types'

// Endpoint-local snapshots intentionally duplicate Route fixture values.
// There are no runtime imports from other entity slices.
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

const driver: Trip['driver'] = {
  id: 'driver-001',
  fullName: 'Алексей Петров',
  contacts: '+7 (900) 000-00-01',
}

const vehicle: Trip['vehicle'] = {
  id: 'vehicle-001',
  registrationNumber: 'А001АА777',
  type: 'Грузовой фургон',
  maxWeight: 3500,
  maxVolume: 18,
  status: 'available',
}

export const mockTrips: Trip[] = [
  {
    id: 'trip-001',
    date: '2026-11-02',
    routes: [
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
    ],
    driver,
    vehicle,
    startTime: '08:30',
    endTime: '13:00',
    status: 'assigned',
  },
  {
    id: 'trip-002',
    date: '2026-11-01',
    routes: [
      {
        id: 'route-003',
        date: '2026-11-01',
        startPoint: distributionCenter,
        endPoint: logisticsPoint,
        startTime: '09:00',
        endTime: '10:30',
        status: 'completed',
      },
    ],
    driver,
    vehicle,
    startTime: '08:30',
    endTime: '11:00',
    status: 'completed',
  },
]
