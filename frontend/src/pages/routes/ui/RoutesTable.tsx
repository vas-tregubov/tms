import { Link, useNavigate } from 'react-router'

import type { Route } from '@/entities/route'
import ActionMenu, { ActionMenuItem } from '@/shared/ui/action-menu'
import StatusBadge from '@/shared/ui/status-badge'
import Table, { TableCell, TableRow } from '@/shared/ui/table'

import { STATUS_OPTIONS } from './statusOptions'

type RoutesTableProps = {
  routes: Route[]
}

const RoutesTable = ({ routes }: RoutesTableProps) => {
  const navigate = useNavigate()
  return (
    <Table aria-label="Маршруты" className="min-w-[960px] table-fixed">
      <colgroup>
        <col className="w-[100px]" />
        <col className="w-[140px]" />
        <col className="w-[180px]" />
        <col />
        <col className="w-[120px]" />
        <col className="w-[120px]" />
        <col className="w-[130px]" />
      </colgroup>
      <thead>
        <TableRow>
          {[
            '№ маршрута',
            'Дата',
            'Точка отправления',
            'Точка назначения',
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
        {routes.map((route) => {
          const badgeStatus = STATUS_OPTIONS.find(
            (option) => option.value === route.status,
          )?.value
          const detailsUrl = `/routes/${encodeURIComponent(route.id)}`

          return (
            <TableRow key={route.id}>
              <TableCell>
                <Link
                  to={detailsUrl}
                  className="rounded-control text-xs leading-4 hover:underline focus-visible:outline-1 focus-visible:outline-primary"
                >
                  {route.number}
                </Link>
              </TableCell>
              <TableCell>
                <span className="text-xs leading-4">
                  {route.date.split('-').reverse().join('.')}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className="block truncate text-xs leading-4"
                  title={route.startPoint.name}
                >
                  {route.startPoint.name}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className="block truncate text-xs leading-4"
                  title={route.endPoint.name}
                >
                  {route.endPoint.name}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-xs leading-4">
                  {route.startTime}–{route.endTime}
                </span>
              </TableCell>
              <TableCell>
                {badgeStatus ? (
                  <StatusBadge status={badgeStatus} />
                ) : (
                  <span className="text-xs leading-4">{route.status}</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex justify-center">
                  <ActionMenu label={`Действия маршрута ${route.number}`}>
                    <ActionMenuItem onClick={() => navigate(detailsUrl)}>
                      Открыть маршрут
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

export default RoutesTable
