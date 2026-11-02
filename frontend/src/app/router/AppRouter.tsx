import { Route, Routes } from 'react-router'

import PlaceholderPage from '@/pages/placeholder'

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
        <Route index element={<PlaceholderPage title="Маршруты" />} />
        <Route
          path="new"
          element={<PlaceholderPage title="Создание маршрута" />}
        />
        <Route path=":routeId" element={<PlaceholderPage title="Маршрут" />} />
        <Route
          path=":routeId/edit"
          element={<PlaceholderPage title="Редактирование маршрута" />}
        />
      </Route>
      <Route path="trips">
        <Route index element={<PlaceholderPage title="Рейсы" />} />
        <Route
          path="new"
          element={<PlaceholderPage title="Создание рейса" />}
        />
        <Route path=":tripId" element={<PlaceholderPage title="Рейс" />} />
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
