import { fireEvent, render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

import RouteTimeHelp from './RouteTimeHelp'

it('explains the time interval on hover and keyboard focus, and dismisses with Escape', () => {
  render(<RouteTimeHelp />)
  const trigger = screen.getByRole('button', {
    name: 'О временном интервале маршрута',
  })
  expect(screen.queryByRole('tooltip')).toBeNull()
  fireEvent.mouseEnter(trigger)
  expect(screen.getByRole('tooltip').textContent).toBe(
    'Временной интервал, в который конечная точка маршрута может принять автомобиль.',
  )
  fireEvent.mouseLeave(trigger)
  expect(screen.queryByRole('tooltip')).toBeNull()
  fireEvent.focus(trigger)
  expect(trigger.getAttribute('aria-describedby')).toBe(
    screen.getByRole('tooltip').id,
  )
  fireEvent.keyDown(trigger, { key: 'Escape' })
  expect(screen.queryByRole('tooltip')).toBeNull()
  fireEvent.blur(trigger)
  fireEvent.focus(trigger)
  expect(screen.getByRole('tooltip')).toBeTruthy()
  fireEvent.blur(trigger)
  expect(screen.queryByRole('tooltip')).toBeNull()
})

it('stays visible while either hover or focus remains active', () => {
  render(<RouteTimeHelp />)
  const trigger = screen.getByRole('button', {
    name: 'О временном интервале маршрута',
  })
  fireEvent.focus(trigger)
  fireEvent.mouseEnter(trigger)
  fireEvent.mouseLeave(trigger)
  expect(screen.getByRole('tooltip')).toBeTruthy()
  fireEvent.mouseEnter(trigger)
  fireEvent.blur(trigger)
  expect(screen.getByRole('tooltip')).toBeTruthy()
  fireEvent.mouseLeave(trigger)
  expect(screen.queryByRole('tooltip')).toBeNull()
})
