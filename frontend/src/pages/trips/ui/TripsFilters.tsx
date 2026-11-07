import { useId } from 'react'

import { TRIP_STATUS_OPTIONS } from '@/entities/trip'
import Button from '@/shared/ui/button'
import DateRange from '@/shared/ui/date-range'
import SearchInput from '@/shared/ui/search-input'
import Select from '@/shared/ui/select'

import type { TripFilters } from '../lib/filterTrips'

type TripsFiltersProps = {
  filters: TripFilters
  dateRangeResetKey: number
  onSearchChange: (value: string) => void
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  onStatusChange: (value: string) => void
  onReset: () => void
}

const TripsFilters = ({
  filters,
  dateRangeResetKey,
  onSearchChange,
  onStartDateChange,
  onEndDateChange,
  onStatusChange,
  onReset,
}: TripsFiltersProps) => {
  const { search, startDate, endDate, status } = filters
  const errorId = useId()
  const invalidDateRange = Boolean(startDate && endDate && startDate > endDate)
  const hasFilters = Boolean(search || startDate || endDate || status)

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3">
        <fieldset className="min-w-0 flex-[0_1_20rem]">
          <legend className="mb-1.5 text-xs leading-4 text-muted">
            Период
          </legend>
          {/* Reserve room for DateInput's own helper/validation messages. */}
          <div className="min-h-18">
            <DateRange
              key={dateRangeResetKey}
              aria-label="Дата рейса"
              startInputProps={{
                value: startDate,
                'aria-invalid': invalidDateRange || undefined,
                'aria-describedby': invalidDateRange ? errorId : undefined,
                onChange: (event) => onStartDateChange(event.target.value),
              }}
              endInputProps={{
                value: endDate,
                'aria-invalid': invalidDateRange || undefined,
                'aria-describedby': invalidDateRange ? errorId : undefined,
                onChange: (event) => onEndDateChange(event.target.value),
              }}
            />
          </div>
        </fieldset>
        <div className="w-56">
          <label
            htmlFor="trips-status"
            className="mb-1.5 block text-xs leading-4 text-muted"
          >
            Статус
          </label>
          <Select
            id="trips-status"
            value={status}
            onChange={(event) => onStatusChange(event.target.value)}
          >
            <option value="">Все статусы</option>
            {TRIP_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="min-w-48 flex-1">
          <label
            htmlFor="trips-search"
            className="mb-1.5 block text-xs leading-4 text-muted"
          >
            Поиск
          </label>
          <SearchInput
            id="trips-search"
            placeholder="Поиск по номеру рейса, водителю, ТС..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            onClear={() => onSearchChange('')}
          />
        </div>
      </div>
      {/* Keep a stable row for the range error and secondary reset action. */}
      <div className="flex min-h-9 items-start justify-between gap-3">
        <p
          id={errorId}
          role={invalidDateRange ? 'alert' : undefined}
          className="min-h-8 flex-1 text-xs leading-4 text-danger"
        >
          {invalidDateRange
            ? 'Начальная дата должна быть не позже конечной.'
            : ''}
        </p>
        {hasFilters && (
          <Button variant="secondary" onClick={onReset}>
            Сбросить фильтры
          </Button>
        )}
      </div>
    </div>
  )
}

export default TripsFilters
