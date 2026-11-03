import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { expect, it } from 'vitest'

import Combobox from './Combobox'

const Example = () => {
  const [value, setValue] = useState('')
  return (
    <Combobox
      label="Точка"
      value={value}
      onChange={setValue}
      options={[
        { value: 'north', label: 'РЦ Северный' },
        { value: 'central', label: 'Пункт Центральный' },
      ]}
    />
  )
}

it('opens, filters case-insensitively and selects a result', () => {
  render(<Example />)
  const input = screen.getByRole('combobox', { name: 'Точка' })
  fireEvent.click(input)
  expect(screen.getAllByRole('option')).toHaveLength(2)
  fireEvent.change(input, { target: { value: 'сЕв' } })
  expect(screen.getAllByRole('option')).toHaveLength(1)
  fireEvent.click(screen.getByRole('option', { name: 'РЦ Северный' }))
  expect((input as HTMLInputElement).value).toBe('РЦ Северный')
  expect(screen.queryByRole('listbox')).toBeNull()
})

it('shows no results and dismisses with Escape or outside interaction', () => {
  render(<Example />)
  const input = screen.getByRole('combobox')
  fireEvent.change(input, { target: { value: 'неизвестно' } })
  expect(screen.getByText('Ничего не найдено')).toBeTruthy()
  fireEvent.keyDown(input, { key: 'Escape' })
  expect(screen.queryByRole('listbox')).toBeNull()
  fireEvent.click(input)
  fireEvent.pointerDown(document.body)
  expect(screen.queryByRole('listbox')).toBeNull()
})

it('supports keyboard result selection and closes on Tab without trapping focus', () => {
  render(<Example />)
  const input = screen.getByRole('combobox')
  fireEvent.keyDown(input, { key: 'ArrowDown' })
  fireEvent.keyDown(input, { key: 'Enter' })
  expect((input as HTMLInputElement).value).toBe('РЦ Северный')
  fireEvent.keyDown(input, { key: 'ArrowDown' })
  fireEvent.keyDown(input, { key: 'Tab' })
  expect(input.getAttribute('aria-expanded')).toBe('false')
})
