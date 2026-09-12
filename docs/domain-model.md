# Domain Model

## Distribution Center

- `id`: string
- `name`: string
- `address`: string

## Logistics Point

- `id`: string
- `name`: string
- `address`: string
- `coordinates`: string
- `acceptanceSchedule`: string
- `status`: string

## Trip

- `id`: string
- `date`: string
- `routes`: Route[]
- `driver`: Driver
- `vehicle`: Vehicle
- `startTime`: string
- `endTime`: string
- `status`: string

## Route

- `id`: string
- `date`: string
- `startPoint`: DistributionCenter | LogisticsPoint
- `endPoint`: DistributionCenter | LogisticsPoint
- `startTime`: string
- `endTime`: string
- `status`: string

## Driver

- `id`: string
- `fullName`: string
- `contacts`: string

## Vehicle

- `id`: string
- `registrationNumber`: string
- `type`: string
- `maxWeight`: number
- `maxVolume`: number
- `status`: string

## Order

- `id`: string
- `date`: string
- `startPoint`: DistributionCenter | LogisticsPoint
- `endPoints`: (DistributionCenter | LogisticsPoint)[]
- `weight`: number
- `volume`: number (optional)
- `status`: string