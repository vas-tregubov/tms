import type { ReactNode } from 'react'

import Combobox, { type ComboboxOption } from '@/shared/ui/combobox'
import DateInput from '@/shared/ui/date-input'
import Input from '@/shared/ui/input'

import RouteTimeHelp from './RouteTimeHelp'

import type { RouteFormErrors, RouteFormValues } from '../model/form'

type RouteFormFieldsProps = {
  statusControl: ReactNode
  statusContent: ReactNode
  step: number
  draft: RouteFormValues
  errors: RouteFormErrors
  points: ComboboxOption[]
  disabled: boolean
  onChange: (field: keyof RouteFormValues, value: string) => void
  onBlur: (field: keyof RouteFormValues) => void
}

const RouteFormFields = ({
  statusControl,
  statusContent,
  step,
  draft,
  errors,
  points,
  disabled,
  onChange,
  onBlur,
}: RouteFormFieldsProps) => {
  const inputProps = (field: keyof RouteFormValues) => ({
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
        {statusControl}
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
        <div className="inline-flex items-center gap-1">
          <p className="text-sm leading-5 font-medium">Временной интервал</p>
          <RouteTimeHelp />
        </div>
        <div className="grid grid-cols-2 items-start gap-5">
          <Input type="time" label="Приёмка с" {...inputProps('startTime')} />
          <Input type="time" label="Приёмка до" {...inputProps('endTime')} />
        </div>
        <Input
          label="Комментарий / особые условия"
          {...inputProps('comment')}
        />
      </div>
    )
  const summary = [
    ['Дата', draft.date.split('-').reverse().join('.')],
    ['Статус', statusContent],
    [
      'Точка отправления',
      points.find((point) => point.value === draft.startPointId)?.label ?? '—',
    ],
    [
      'Точка назначения',
      points.find((point) => point.value === draft.endPointId)?.label ?? '—',
    ],
    ['Приёмка с', draft.startTime],
    ['Приёмка до', draft.endTime],
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
