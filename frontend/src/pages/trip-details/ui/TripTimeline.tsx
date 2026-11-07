import {
  getTripStatusOption,
  getTripTimelineProgress,
  type TripStatusRecord,
} from '@/entities/trip'
import Button from '@/shared/ui/button'
import Loader from '@/shared/ui/loader'
import Select from '@/shared/ui/select'
import StatusTimeline, { TimelineItem } from '@/shared/ui/status-timeline'

type TripTimelineProps = {
  status: string
  query: {
    currentData?: TripStatusRecord[]
    isLoading: boolean
    isFetching: boolean
    isError: boolean
    refetch: () => unknown
  }
}
const TripTimeline = ({ status, query }: TripTimelineProps) => {
  const current = getTripStatusOption(status)
  return (
    <section
      aria-labelledby="trip-status-title"
      className="min-w-0 self-stretch rounded-card border border-border bg-surface shadow-card"
    >
      <h2
        id="trip-status-title"
        className="p-4 text-base leading-6 font-semibold"
      >
        Статус рейса
      </h2>
      <div className="flex flex-col gap-4 px-4 pb-4">
        {query.isLoading || (!query.currentData && query.isFetching) ? (
          <Loader label="Загрузка статусов рейса" />
        ) : query.isError ? (
          <div role="alert">
            Не удалось загрузить статусы рейса.{' '}
            <Button variant="secondary" onClick={() => query.refetch()}>
              Повторить загрузку статусов
            </Button>
          </div>
        ) : (
          <StatusTimeline>
            {getTripTimelineProgress(status, query.currentData ?? []).map(
              (item, index, items) => (
                <TimelineItem
                  key={item.status}
                  status={item.label}
                  dateTime={item.dateTime}
                  author={item.author}
                  state={item.state}
                  showConnector={index < items.length - 1}
                />
              ),
            )}
          </StatusTimeline>
        )}
        <Select
          label="Изменить статус"
          value={status}
          disabled
          helper={
            status === 'completed'
              ? 'Рейс завершён. Изменение статуса недоступно.'
              : 'Изменение статуса пока недоступно.'
          }
        >
          <option value={status}>{current?.label ?? status}</option>
        </Select>
      </div>
    </section>
  )
}
export default TripTimeline
