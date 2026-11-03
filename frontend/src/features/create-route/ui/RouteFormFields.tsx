import { ROUTE_STATUS_OPTIONS } from '@/entities/route'
import Combobox, { type ComboboxOption } from '@/shared/ui/combobox'
import DateInput from '@/shared/ui/date-input'
import Input from '@/shared/ui/input'
import Select from '@/shared/ui/select'
import StatusBadge from '@/shared/ui/status-badge'

import type { DraftErrors } from '../lib/validation'
import type { RouteDraft } from '../model/createRouteSlice'

type RouteFormFieldsProps = {
  step: number
  draft: RouteDraft
  errors: DraftErrors
  points: ComboboxOption[]
  disabled: boolean
  onChange: (field: keyof RouteDraft, value: string) => void
  onBlur: (field: keyof RouteDraft) => void
}

const RouteFormFields = ({
  step,
  draft,
  errors,
  points,
  disabled,
  onChange,
  onBlur,
}: RouteFormFieldsProps) => {
  const created = ROUTE_STATUS_OPTIONS.find(
    (option) => option.value === 'created',
  )!
  const inputProps = (field: keyof RouteDraft) => ({
    value: draft[field],
    error: errors[field],
    disabled,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange(field, event.target.value),
    onBlur: () => onBlur(field),
  })
  if (step === 1)
    return (
      <div className="grid w-full max-w-[720px] grid-cols-2 items-start gap-5">
        <DateInput label="Дата" {...inputProps('date')} />
        <Select
          label="Статус"
          value={draft.status}
          disabled={disabled}
          error={errors.status}
          onChange={(event) => onChange('status', event.target.value)}
          onBlur={() => onBlur('status')}
        >
          <option value="">Выберите значение</option>
          <option value={created.value}>{created.label}</option>
        </Select>
      </div>
    )
  if (step === 2)
    return (
      <div className="grid grid-cols-2 items-start gap-5">
        <Combobox
          label="Точка отправления"
          options={points}
          value={draft.startPointId}
          onChange={(value) => onChange('startPointId', value)}
          onBlur={() => onBlur('startPointId')}
          error={errors.startPointId}
          disabled={disabled}
        />
        <Combobox
          label="Точка назначения"
          options={points}
          value={draft.endPointId}
          onChange={(value) => onChange('endPointId', value)}
          onBlur={() => onBlur('endPointId')}
          error={errors.endPointId}
          disabled={disabled}
        />
      </div>
    )
  if (step === 3)
    return (
      <div className="flex max-w-[720px] flex-col gap-5">
        <div className="grid grid-cols-2 items-start gap-5">
          <Input
            type="time"
            label="Время отправления"
            {...inputProps('startTime')}
          />
          <Input
            type="time"
            label="Время прибытия"
            {...inputProps('endTime')}
          />
        </div>
        <Input
          label="Комментарий / особые условия"
          {...inputProps('comment')}
        />
      </div>
    )
  const summary = [
    ['Дата', draft.date.split('-').reverse().join('.')],
    [
      'Статус',
      <StatusBadge status={created.value}>{created.label}</StatusBadge>,
    ],
    [
      'Точка отправления',
      points.find((point) => point.value === draft.startPointId)?.label ?? '—',
    ],
    [
      'Точка назначения',
      points.find((point) => point.value === draft.endPointId)?.label ?? '—',
    ],
    ['Время отправления', draft.startTime],
    ['Время прибытия', draft.endTime],
    ['Комментарий / особые условия', draft.comment || '—'],
  ] as const
  return (
    <dl className="flex flex-col gap-4">
      {summary.map(([label, value]) => (
        <div
          key={label}
          className="grid grid-cols-[260px_minmax(0,1fr)] items-center gap-5 text-sm leading-5"
        >
          <dt className="text-muted">{label}</dt>
          <dd className="break-words">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
export default RouteFormFields
