import type { ComponentProps } from 'react'

import {
  ROUTE_STATUS_OPTIONS,
  RouteFormFields as Fields,
} from '@/entities/route'
import Select from '@/shared/ui/select'
import StatusBadge from '@/shared/ui/status-badge'

import type { DraftErrors } from '../lib/validation'
import type { RouteDraft } from '../model/createRouteSlice'

type RouteFormFieldsProps = Omit<
  ComponentProps<typeof Fields>,
  'draft' | 'errors' | 'onChange' | 'onBlur' | 'statusControl' | 'statusContent'
> & {
  draft: RouteDraft
  errors: DraftErrors
  onChange: (field: keyof RouteDraft, value: string) => void
  onBlur: (field: keyof RouteDraft) => void
}

const RouteFormFields = ({
  draft,
  errors,
  disabled,
  onChange,
  onBlur,
  ...props
}: RouteFormFieldsProps) => {
  const created = ROUTE_STATUS_OPTIONS.find(
    (option) => option.value === 'created',
  )!
  return (
    <Fields
      {...props}
      draft={draft}
      errors={errors}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      statusControl={
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
      }
      statusContent={
        <StatusBadge status={created.value}>{created.label}</StatusBadge>
      }
    />
  )
}
export default RouteFormFields
