import CheckIcon from '@/shared/assets/icons/check.svg?react'

type TimelineItemProps = {
  status: string
  dateTime: string
  author: string
  state?: 'completed' | 'current'
  showConnector?: boolean
}

const TimelineItem = ({
  status,
  dateTime,
  author,
  state = 'current',
  showConnector = true,
}: TimelineItemProps) => (
  <li className="flex h-[42px] w-full shrink-0 items-center gap-3">
    <div aria-hidden="true" className="relative h-[42px] w-6 shrink-0">
      <span
        className={`absolute top-[9px] flex size-6 items-center justify-center overflow-hidden rounded-full ${state === 'completed' ? 'bg-status-completed text-surface' : 'border border-status-created text-status-created'}`}
      >
        <CheckIcon className="size-6 shrink-0" />
      </span>
      {showConnector && (
        <span
          className={`absolute top-[33px] left-[11px] h-[18px] w-0.5 rounded-[1px] ${state === 'completed' ? 'bg-status-completed' : 'bg-status-created'}`}
        />
      )}
    </div>
    <div className="grid h-[42px] min-w-0 flex-1 grid-cols-[minmax(0,1fr)_max-content_minmax(0,1fr)] items-center gap-3">
      <p className="m-0 truncate text-base leading-6 font-semibold text-foreground">
        {status}
      </p>
      <p className="m-0 text-xs leading-4 font-normal whitespace-nowrap text-muted">
        {dateTime}
      </p>
      <p className="m-0 truncate text-right text-xs leading-4 font-normal text-muted">
        {author}
      </p>
    </div>
  </li>
)

export default TimelineItem
