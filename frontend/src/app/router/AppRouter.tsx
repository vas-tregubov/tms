import { Route, Routes } from 'react-router'

import EditRoutePage from '@/pages/edit-route'
import CreateRoutePage from '@/pages/create-route'
import TripsPage from '@/pages/trips'
import TripDetailsPage from '@/pages/trip-details'
import PlaceholderPage from '@/pages/placeholder'
import RoutesPage from '@/pages/routes'
import RouteDetailsPage from '@/pages/route-details'

import RoutedAppLayout from './RoutedAppLayout'

const AppRouter = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <main className="p-5">
          <PlaceholderPage title="Вход" />
        </main>
      }
    />
    <Route element={<RoutedAppLayout />}>
      <Route index element={<PlaceholderPage title="Главная" />} />
      <Route path="routes">
        <Route index element={<RoutesPage />} />
        <Route path="new" element={<CreateRoutePage />} />
        <Route path=":routeId" element={<RouteDetailsPage />} />
        <Route path=":routeId/edit" element={<EditRoutePage />} />
      </Route>
      <Route path="trips">
        <Route index element={<TripsPage />} />
        <Route
          path="new"
          element={<PlaceholderPage title="Создание рейса" />}
        />
        <Route path=":tripId" element={<TripDetailsPage />} />
      </Route>
      <Route
        path="directories"
        element={<PlaceholderPage title="Справочники" />}
      />
      <Route path="reports" element={<PlaceholderPage title="Отчёты" />} />
      <Route path="settings" element={<PlaceholderPage title="Настройки" />} />
      <Route
        path="*"
        element={<PlaceholderPage title="Страница не найдена" />}
      />
    </Route>
  </Routes>
)

export default AppRouter
