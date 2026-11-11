import { expect, test } from 'playwright/test'

test('creates a Trip with driver, vehicle and Route, then shows the assigned Route', async ({
  page,
}) => {
  await page.goto('/trips/new')
  await page.getByLabel('Дата рейса', { exact: true }).fill('2026-11-12')
  await page.getByLabel('Время начала', { exact: true }).fill('08:00')
  await page.getByLabel('Время окончания', { exact: true }).fill('18:00')
  await page
    .getByLabel('Водитель', { exact: true })
    .selectOption({ label: 'Алексей Петров' })
  await page
    .getByLabel('Транспортное средство', { exact: true })
    .selectOption({ label: 'А001АА777 · Грузовой фургон' })
  await page
    .getByRole('button', { name: 'Добавить маршрут', exact: true })
    .click()

  const selector = page.getByRole('dialog', {
    name: 'Добавить маршруты в рейс',
    exact: true,
  })
  await expect(selector).toBeVisible()
  await selector.getByRole('searchbox', { name: 'Поиск' }).fill('MR-000122')
  await expect(selector.getByText('Создан', { exact: true })).toBeVisible()
  await selector
    .getByRole('checkbox', { name: 'Выбрать MR-000122', exact: true })
    .check()
  await selector
    .getByRole('button', { name: 'Добавить в рейс', exact: true })
    .click()
  await expect(selector).not.toBeVisible()

  const draft = page.getByRole('table', {
    name: 'Маршруты в черновике',
    exact: true,
  })
  await expect(draft.getByText('MR-000122', { exact: true })).toBeVisible()
  await expect(draft.getByText('Создан', { exact: true })).toBeVisible()
  const actions = draft.getByRole('button', {
    name: 'Действия маршрута MR-000122',
    exact: true,
  })
  await actions.click()
  const menu = page.getByRole('menu', {
    name: 'Действия маршрута MR-000122',
    exact: true,
  })
  await expect(menu).toBeVisible()
  const popupPromise = page.waitForEvent('popup')
  await menu.getByRole('menuitem', { name: 'Посмотреть', exact: true }).click()
  const popup = await popupPromise
  await expect(popup).toHaveURL(/\/routes\/route-002$/)
  await expect(
    popup.getByRole('heading', { name: 'Маршрут MR-000122', exact: true }),
  ).toBeVisible()
  await popup.close()
  await expect(draft.getByText('MR-000122', { exact: true })).toBeVisible()
  await page
    .getByRole('button', { name: 'Сохранить рейс', exact: true })
    .click()

  const success = page.getByRole('dialog', {
    name: 'Рейс сохранён',
    exact: true,
  })
  await expect(success).toBeVisible()
  const message = await success
    .getByText(/Рейс TR-\d+ успешно создан/)
    .innerText()
  const number = message.match(/TR-\d+/)?.[0]
  await success
    .getByRole('button', { name: 'Открыть рейс', exact: true })
    .click()
  const heading = page.getByRole('heading', {
    name: `Рейс ${number}`,
    exact: true,
  })
  await expect(heading).toBeVisible()
  await expect(page).toHaveURL(/\/trips\/[^/]+$/)
  expect(
    decodeURIComponent(new URL(page.url()).pathname.split('/').at(-1)!),
  ).not.toBe(number)
  const information = page.getByRole('region', { name: 'Общая информация' })
  await expect(
    information.getByText('Алексей Петров', { exact: true }),
  ).toBeVisible()
  await expect(
    information.getByText('А001АА777 · Грузовой фургон', { exact: true }),
  ).toBeVisible()
  const status = page.getByRole('region', { name: 'Статус рейса', exact: true })
  await expect(status.getByLabel('Изменить статус')).toHaveValue('assigned')
  const routes = page.getByRole('table', {
    name: 'Маршруты в рейсе',
    exact: true,
  })
  await expect(routes.getByText('Назначен', { exact: true })).toBeVisible()
  await routes.getByRole('link', { name: 'MR-000122', exact: true }).click()

  await expect(page).toHaveURL(/\/routes\/route-002$/)
  await expect(
    page.getByRole('heading', { name: 'Маршрут MR-000122', exact: true }),
  ).toBeVisible()
  await expect(
    page
      .getByRole('region', { name: 'Статус маршрута', exact: true })
      .getByLabel('Изменить статус'),
  ).toHaveValue('assigned')
})
