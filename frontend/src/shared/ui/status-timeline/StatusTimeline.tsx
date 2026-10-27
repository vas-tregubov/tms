import type { ReactNode } from 'react'

type StatusTimelineProps = {
  children: ReactNode
}

const StatusTimeline = ({ children }: StatusTimelineProps) => (
  <ol className="w-full">{children}</ol>
)

export default StatusTimeline
