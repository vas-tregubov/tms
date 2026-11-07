import { getTripStatusOption, type TripStatusRecord } from '@/entities/trip'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import StatusBadge from '@/shared/ui/status-badge'
import Table, { TableCell, TableRow } from '@/shared/ui/table'

type TripHistoryProps = {
  query: {
    currentData?: TripStatusRecord[]
    isLoading: boolean
    isFetching: boolean
    isError: boolean
    refetch: () => unknown
  }
}
const TripHistory = ({ query }: TripHistoryProps) => {
  if (query.isLoading || (!query.currentData && query.isFetching))
    return <Loader label="Загрузка истории рейса" />
  if (query.isError)
    return (
      <div role="alert">
        Не удалось загрузить историю рейса.{' '}
        <Button variant="secondary" onClick={() => query.refetch()}>
          Повторить загрузку истории
        </Button>
      </div>
    )
  if (!query.currentData?.length)
    return (
      <p className="text-sm text-muted">История изменений пока отсутствует.</p>
    )
  return (
    <Table
      aria-label="История изменений рейса"
      className="min-w-[640px] table-fixed"
    >
      <thead>
        <TableRow>
          {['Дата и время', 'Статус', 'Пользователь', 'Комментарий'].map(
            (label) => (
              <TableCell key={label} header>
                <span className="text-xs font-normal">{label}</span>
              </TableCell>
            ),
          )}
        </TableRow>
      </thead>
      <tbody>
        {[...query.currentData].reverse().map((record) => {
          const status = getTripStatusOption(record.status)
          return (
            <TableRow key={`${record.status}-${record.dateTime}`}>
              <TableCell>
                <span className="text-xs">{record.dateTime}</span>
              </TableCell>
              <TableCell>
                {status ? (
                  <StatusBadge status={status.value}>
                    {status.label}
                  </StatusBadge>
                ) : (
                  record.status
                )}
              </TableCell>
              <TableCell>
                <span className="text-xs">{record.author}</span>
              </TableCell>
              <TableCell>
                <span className="block truncate text-xs" title={record.comment}>
                  {record.comment}
                </span>
              </TableCell>
            </TableRow>
          )
        })}
      </tbody>
    </Table>
  )
}
export default TripHistory
