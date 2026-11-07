import type { Trip } from '@/entities/trip'

export type TripFilters = {
  search: string
  startDate: string
  endDate: string
  status: string
}
export const filterTrips = (
  trips: Trip[],
  { search, startDate, endDate, status }: TripFilters,
) => {
  const query = search.trim().toLocaleLowerCase('ru-RU')
  const validRange = !startDate || !endDate || startDate <= endDate
  return trips.filter(
    (trip) =>
      (!query ||
        [
          trip.number,
          trip.driver.fullName,
          trip.vehicle.registrationNumber,
        ].some((value) => value.toLocaleLowerCase('ru-RU').includes(query))) &&
      (!validRange || !startDate || trip.date >= startDate) &&
      (!validRange || !endDate || trip.date <= endDate) &&
      (!status || trip.status === status),
  )
}
