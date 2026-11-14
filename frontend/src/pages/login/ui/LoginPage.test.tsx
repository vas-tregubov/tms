import { fireEvent, render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, expect, it } from 'vitest'

import { store } from '@/app/store'
import { baseApi } from '@/shared/api'

import LoginPage from './LoginPage'

afterEach(() => {
  store.dispatch(baseApi.util.resetApiState())
})

const LocationProbe = () => (
  <output aria-label="Текущий URL">{useLocation().pathname}</output>
)

const renderLogin = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

const fullName = () => screen.getByRole('textbox', { name: 'Имя и фамилия' })
const password = () => screen.getByLabelText('Пароль')
const submit = () => screen.getByRole('button', { name: 'Войти' })

it('requires both fields before sending the login request', () => {
  renderLogin()
  fireEvent.click(submit())

  expect(fullName().getAttribute('aria-invalid')).toBe('true')
  expect(screen.getByText('Введите имя и фамилию')).toBeTruthy()
  expect(password().getAttribute('aria-invalid')).toBe('true')
  expect(screen.getByText('Введите пароль')).toBeTruthy()
  expect(screen.queryByRole('status')).toBeNull()

  fireEvent.change(fullName(), { target: { value: 'Алексей Петров' } })
  expect(screen.queryByText('Введите имя и фамилию')).toBeNull()
  expect(screen.getByText('Введите пароль')).toBeTruthy()
})

it('shows loading and then the wrong password error without leaving the page', async () => {
  renderLogin()
  fireEvent.change(fullName(), { target: { value: 'Алексей Петров' } })
  fireEvent.change(password(), { target: { value: 'wrong' } })
  fireEvent.click(submit())

  expect(await screen.findByText('Выполняется вход')).toBeTruthy()
  expect(
    screen.getByRole('button', { name: /Вход…/ }).hasAttribute('disabled'),
  ).toBe(true)

  expect(await screen.findByText('Неверный пароль')).toBeTruthy()
  expect(password().getAttribute('aria-invalid')).toBe('true')
  expect(fullName().getAttribute('aria-invalid')).toBe('true')
  expect(screen.queryByLabelText('Текущий URL')).toBeNull()

  fireEvent.change(password(), { target: { value: 'password' } })
  expect(screen.queryByText('Неверный пароль')).toBeNull()
  expect(fullName().hasAttribute('aria-invalid')).toBe(false)
})

it('navigates to the Routes list after a successful mock login', async () => {
  renderLogin()
  fireEvent.change(fullName(), { target: { value: '  алексей   петров ' } })
  fireEvent.change(password(), { target: { value: 'password' } })
  fireEvent.click(submit())

  expect((await screen.findByLabelText('Текущий URL')).textContent).toBe(
    '/routes',
  )
})

it('opens Registration from the forgot password link', () => {
  renderLogin()
  const link = screen.getByRole('link', { name: 'Забыли пароль?' })
  expect(link.getAttribute('href')).toBe('/register')

  fireEvent.click(link)
  expect(screen.getByLabelText('Текущий URL').textContent).toBe('/register')
})
