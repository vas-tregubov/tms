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

it('dismisses a hovered tooltip with Escape outside the trigger', () => {
  render(<RouteTimeHelp />)
  const trigger = screen.getByRole('button', {
    name: 'О временном интервале маршрута',
  })
  fireEvent.mouseEnter(trigger)
  expect(screen.getByRole('tooltip')).toBeTruthy()
  fireEvent.keyDown(document.body, { key: 'Escape' })
  expect(screen.queryByRole('tooltip')).toBeNull()
  fireEvent.mouseLeave(trigger)
  fireEvent.mouseEnter(trigger)
  expect(screen.getByRole('tooltip')).toBeTruthy()
})

it('prevents pointer focus and does not persist after a click and mouse leave', () => {
  render(<RouteTimeHelp />)
  const trigger = screen.getByRole('button', {
    name: 'О временном интервале маршрута',
  })
  fireEvent.mouseEnter(trigger)
  expect(fireEvent.pointerDown(trigger, { button: 0 })).toBe(false)
  fireEvent.click(trigger)
  fireEvent.mouseLeave(trigger)
  expect(screen.queryByRole('tooltip')).toBeNull()
})

it('allows hovering the tooltip outside the table clipping context', () => {
  render(<RouteTimeHelp />)
  const trigger = screen.getByRole('button', {
    name: 'О временном интервале маршрута',
  })
  fireEvent.mouseEnter(trigger)
  const tooltip = screen.getByRole('tooltip')
  fireEvent.mouseLeave(trigger, { relatedTarget: tooltip })
  fireEvent.mouseEnter(tooltip, { relatedTarget: trigger })
  expect(screen.getByRole('tooltip')).toBeTruthy()
  fireEvent.mouseLeave(tooltip, { relatedTarget: document.body })
  expect(screen.queryByRole('tooltip')).toBeNull()
})

it('dismisses on scrolling or viewport resize rather than leaving a detached hint', () => {
  render(<RouteTimeHelp />)
  const trigger = screen.getByRole('button', {
    name: 'О временном интервале маршрута',
  })
  fireEvent.mouseEnter(trigger)
  fireEvent.scroll(document)
  expect(screen.queryByRole('tooltip')).toBeNull()
  fireEvent.mouseLeave(trigger)
  fireEvent.mouseEnter(trigger)
  fireEvent.resize(window)
  expect(screen.queryByRole('tooltip')).toBeNull()
})
