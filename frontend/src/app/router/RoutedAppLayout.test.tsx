import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { Link, MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import RoutedAppLayout from './RoutedAppLayout'

const BrokenPage = () => {
  throw new Error('PRIVATE_PAGE_ERROR')
}

const StatefulPage = () => {
  const [value, setValue] = useState('')
  return (
    <>
      <label>
        Черновик
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <Link to="?search=updated">Изменить поиск</Link>
    </>
  )
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => vi.restoreAllMocks())

const renderRoutes = () =>
  render(
    <MemoryRouter initialEntries={['/routes']}>
      <Routes>
        <Route element={<RoutedAppLayout />}>
          <Route index element={<h1>Главная</h1>} />
          <Route path="routes" element={<BrokenPage />} />
          <Route path="trips" element={<StatefulPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

it('keeps the shell and recovers through the fallback home action', () => {
  renderRoutes()
  const header = screen.getByRole('banner')
  const sidebar = screen.getByRole('navigation', { name: 'Основная навигация' })
  expect(
    screen.getByRole('heading', { name: 'Не удалось отобразить страницу' }),
  ).toBeTruthy()
  expect(screen.getAllByRole('main')).toHaveLength(1)
  expect(screen.queryByText(/PRIVATE_PAGE_ERROR/)).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'На главную' }))
  expect(screen.getByRole('heading', { name: 'Главная' })).toBeTruthy()
  expect(screen.queryByRole('alert')).toBeNull()
  expect(screen.getByRole('banner')).toBe(header)
  expect(screen.getByRole('navigation', { name: 'Основная навигация' })).toBe(
    sidebar,
  )
})

it('recovers through Sidebar and preserves healthy Page state on search navigation', () => {
  renderRoutes()
  fireEvent.click(screen.getByRole('link', { name: 'Рейсы' }))
  const input = screen.getByRole('textbox', {
    name: 'Черновик',
  }) as HTMLInputElement
  fireEvent.change(input, { target: { value: 'Несохранённый текст' } })
  fireEvent.click(screen.getByRole('link', { name: 'Изменить поиск' }))
  expect(screen.getByRole('textbox', { name: 'Черновик' })).toBe(input)
  expect(input.value).toBe('Несохранённый текст')
  expect(screen.queryByRole('alert')).toBeNull()
})
