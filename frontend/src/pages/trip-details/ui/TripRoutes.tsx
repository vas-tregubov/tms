import { Link } from 'react-router'

import { getRouteStatusOption, type Route } from '@/entities/route'
import StatusBadge from '@/shared/ui/status-badge'
import Table, { TableCell, TableRow } from '@/shared/ui/table'

type TripRoutesProps = { routes: Route[] }
const TripRoutes = ({ routes }: TripRoutesProps) => {
  if (!routes.length)
    return <p className="text-sm text-muted">В рейсе пока нет маршрутов.</p>
  return (
    <Table aria-label="Маршруты в рейсе" className="min-w-[720px] table-fixed">
      <colgroup>
        <col className="w-12" />
        <col className="w-36" />
        <col />
        <col />
        <col className="w-32" />
        <col className="w-32" />
      </colgroup>
      <thead>
        <TableRow>
          {[
            '№',
            'Маршрут',
            'Точка отправления',
            'Точка назначения',
            'Время',
            'Статус',
          ].map((label) => (
            <TableCell key={label} header>
              <span className="text-xs font-normal">{label}</span>
            </TableCell>
          ))}
        </TableRow>
      </thead>
      <tbody>
        {routes.map((route, index) => {
          const status = getRouteStatusOption(route.status)
          return (
            <TableRow key={route.id}>
              <TableCell>
                <span className="text-xs">{index + 1}</span>
              </TableCell>
              <TableCell>
                <Link
                  to={`/routes/${encodeURIComponent(route.id)}`}
                  className="rounded-control text-xs hover:underline focus-visible:outline-1 focus-visible:outline-primary"
                >
                  {route.number}
                </Link>
              </TableCell>
              {[
                route.startPoint.name,
                route.endPoint.name,
                `${route.startTime}–${route.endTime}`,
              ].map((value, cellIndex) => (
                <TableCell key={cellIndex}>
                  <span className="block truncate text-xs" title={value}>
                    {value}
                  </span>
                </TableCell>
              ))}
              <TableCell>
                {status ? (
                  <StatusBadge status={status.value}>
                    {status.label}
                  </StatusBadge>
                ) : (
                  route.status
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </tbody>
    </Table>
  )
}
export default TripRoutes
