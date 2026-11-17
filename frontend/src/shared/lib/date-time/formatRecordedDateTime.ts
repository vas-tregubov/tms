// Display the event's recorded wall time without using the browser's timezone.
// The data contract retains its RFC 3339 offset; this is not Trip scheduling logic.
export const formatRecordedDateTime = (timestamp: string): string => {
  const parts =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.exec(
      timestamp,
    )
  if (!parts || !Number.isFinite(Date.parse(timestamp))) return '—'
  const [, year, month, day, hour, minute] = parts
  return `${day}.${month}.${year} ${hour}:${minute}`
}
