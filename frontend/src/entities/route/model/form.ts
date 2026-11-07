// Values shared by Route forms; lifecycle state belongs to the consuming feature.
export type RouteFormValues = {
  date: string
  startPointId: string
  endPointId: string
  startTime: string
  endTime: string
  comment: string
}

export type RouteFormErrors = Partial<Record<keyof RouteFormValues, string>>

export const ROUTE_FORM_STEPS = [
  'Основные данные',
  'Точки маршрута',
  'Время и условия',
  'Проверка и сохранение',
]
