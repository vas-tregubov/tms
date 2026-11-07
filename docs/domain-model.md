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
- `number`: string
- `date`: string
- `startPoint`: DistributionCenter | LogisticsPoint
- `endPoint`: DistributionCenter | LogisticsPoint
- `startTime`: string
- `endTime`: string
- `comment`: string (optional)
- `status`: string

`id` is the technical opaque identifier used for routing and lookups.
`number` is the business/display number shown in the UI, for example `MR-000123`.
These values are independent; neither is derived from the other.

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
