import type { Route } from '@/entities/route'
import { getRouteStatusOption } from '@/entities/route'
import ActionMenu, { ActionMenuItem } from '@/shared/ui/action-menu'
import StatusBadge from '@/shared/ui/status-badge'
import Table, { TableCell, TableRow } from '@/shared/ui/table'

type DraftRoutesProps = {
  routes: Route[]
  disabled: boolean
  onRemove: (id: string) => void
  onView: (id: string) => void
}
const DraftRoutes = ({
  routes,
  disabled,
  onRemove,
  onView,
}: DraftRoutesProps) => {
  if (!routes.length)
    return <p className="text-sm text-muted">Маршруты пока не добавлены.</p>
  return (
    <Table aria-label="Маршруты в черновике" className="min-w-[900px]">
      <thead>
        <TableRow>
          {[
            '№',
            'Маршрут',
            'Точка отправления',
            'Точка назначения',
            'Время',
            'Статус',
            'Действия',
          ].map((label) => (
            <TableCell header key={label}>
              <span className="text-xs">{label}</span>
            </TableCell>
          ))}
        </TableRow>
      </thead>
      <tbody>
        {routes.map((route, index) => {
          const status = getRouteStatusOption(route.status)
          return (
            <TableRow key={route.id}>
              {[
                index + 1,
                route.number,
                route.startPoint.name,
                route.endPoint.name,
                `${route.startTime}–${route.endTime}`,
              ].map((value, cell) => (
                <TableCell key={cell}>
                  <span className="text-xs">{value}</span>
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
              <TableCell>
                <ActionMenu label={`Действия маршрута ${route.number}`}>
                  <ActionMenuItem
                    disabled={disabled}
                    onClick={() => onView(route.id)}
                  >
                    Посмотреть
                  </ActionMenuItem>
                  <ActionMenuItem
                    disabled={disabled}
                    destructive
                    onClick={() => onRemove(route.id)}
                  >
                    Удалить из рейса
                  </ActionMenuItem>
                </ActionMenu>
              </TableCell>
            </TableRow>
          )
        })}
      </tbody>
    </Table>
  )
}
export default DraftRoutes
