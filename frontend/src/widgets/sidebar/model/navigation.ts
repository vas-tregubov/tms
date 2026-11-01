import HomeIcon from '@/shared/assets/icons/home.svg?react'
import TruckIcon from '@/shared/assets/icons/truck.svg?react'
import LicenseIcon from '@/shared/assets/icons/license-third-party-draft.svg?react'
import BookIcon from '@/shared/assets/icons/book.svg?react'
import AnalyticsIcon from '@/shared/assets/icons/analytics.svg?react'
import SettingsIcon from '@/shared/assets/icons/operations-record.svg?react'

export type SidebarSection =
  'home' | 'routes' | 'trips' | 'directories' | 'reports' | 'settings'

export const mainItems = [
  { id: 'home', label: 'Главная', Icon: HomeIcon },
  { id: 'routes', label: 'Маршруты', Icon: TruckIcon },
  { id: 'trips', label: 'Рейсы', Icon: LicenseIcon },
  { id: 'directories', label: 'Справочники', Icon: BookIcon },
  { id: 'reports', label: 'Отчёты', Icon: AnalyticsIcon },
] as const

export const bottomItems = [
  { id: 'settings', label: 'Настройки', Icon: SettingsIcon },
] as const
