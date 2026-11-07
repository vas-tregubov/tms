import { Link, useLocation, useNavigate } from 'react-router'

import { getTripStatusOption, type Trip } from '@/entities/trip'
import ActionMenu, { ActionMenuItem } from '@/shared/ui/action-menu'
import StatusBadge from '@/shared/ui/status-badge'
import Table, { TableCell, TableRow } from '@/shared/ui/table'

type TripsTableProps = { trips: Trip[] }
const TripsTable = ({ trips }: TripsTableProps) => {
  const { search } = useLocation()
  const navigate = useNavigate()
  return (
    <Table aria-label="Рейсы" className="min-w-[960px] table-fixed">
      <colgroup>
        <col className="w-36" />
        <col className="w-32" />
        <col className="w-28" />
        <col />
        <col className="w-36" />
        <col className="w-32" />
        <col className="w-32" />
        <col className="w-28" />
      </colgroup>
      <thead>
        <TableRow>
          {[
            '№ рейса',
            'Дата',
            'Маршрутов',
            'Водитель',
            'ТС',
            'Время',
            'Статус',
            'Действия',
          ].map((label) => (
            <TableCell key={label} header>
              <span className="text-xs leading-4 font-normal">{label}</span>
            </TableCell>
          ))}
        </TableRow>
      </thead>
      <tbody>
        {trips.map((trip) => {
          const status = getTripStatusOption(trip.status)
          const url = `/trips/${encodeURIComponent(trip.id)}`
          return (
            <TableRow key={trip.id}>
              <TableCell>
                <Link
                  to={url}
                  state={{ tripsSearch: search }}
                  className="rounded-control text-xs hover:underline focus-visible:outline-1 focus-visible:outline-primary"
                >
                  {trip.number}
                </Link>
              </TableCell>
              {[
                trip.date.split('-').reverse().join('.'),
                trip.routes.length,
                trip.driver.fullName,
                trip.vehicle.registrationNumber,
                `${trip.startTime}–${trip.endTime}`,
              ].map((value, index) => (
                <TableCell key={index}>
                  <span
                    className="block truncate text-xs leading-4"
                    title={String(value)}
                  >
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
                  <span className="text-xs">{trip.status}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <ActionMenu label={`Действия рейса ${trip.number}`}>
                    <ActionMenuItem
                      onClick={() =>
                        navigate(url, { state: { tripsSearch: search } })
                      }
                    >
                      Посмотреть
                    </ActionMenuItem>
                    <ActionMenuItem disabled>Редактировать</ActionMenuItem>
                    <ActionMenuItem disabled destructive>
                      Удалить
                    </ActionMenuItem>
                  </ActionMenu>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </tbody>
    </Table>
  )
}
export default TripsTable
