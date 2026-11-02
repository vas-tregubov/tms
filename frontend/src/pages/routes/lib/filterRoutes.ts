import type { Route } from '@/entities/route'

export type RouteFilters = {
  search: string
  startDate: string
  endDate: string
  status: string
}

export const filterRoutes = (routes: Route[], filters: RouteFilters) => {
  const { search, startDate, endDate, status } = filters
  const query = search.trim().toLocaleLowerCase('ru-RU')
  const validDateRange = !startDate || !endDate || startDate <= endDate

  return routes.filter(
    (route) =>
      (!query ||
        [route.number, route.startPoint.name, route.endPoint.name].some(
          (value) => value.toLocaleLowerCase('ru-RU').includes(query),
        )) &&
      // Ignore both date bounds until the user corrects an inverted range.
      (!validDateRange || !startDate || route.date >= startDate) &&
      (!validDateRange || !endDate || route.date <= endDate) &&
      (!status || route.status === status),
  )
}
