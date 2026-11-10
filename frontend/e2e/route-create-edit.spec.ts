import { expect, test } from 'playwright/test'

test('creates a Route, edits it and shows the updated record in Details and List', async ({
  page,
}) => {
  await page.goto('/routes/new')
  await page.getByLabel('Дата', { exact: true }).fill('2026-11-12')
  await page
    .getByRole('combobox', { name: 'Статус', exact: true })
    .selectOption('created')
  await page.getByRole('button', { name: 'Далее', exact: true }).click()

  await expect(
    page.getByRole('heading', { name: 'Точки маршрута', exact: true }),
  ).toBeVisible()
  const start = page.getByRole('combobox', { name: 'Точка отправления' })
  await start.fill('Северный')
  await start.press('ArrowDown')
  await start.press('Enter')
  await expect(start).toHaveValue('РЦ Северный')
  await page.getByRole('combobox', { name: 'Точка назначения' }).click()
  await page
    .getByRole('option', {
      name: 'Логистический пункт Центральный',
      exact: true,
    })
    .click()
  await page.getByRole('button', { name: 'Далее', exact: true }).click()

  await expect(
    page.getByRole('heading', { name: 'Время и условия', exact: true }),
  ).toBeVisible()
  await page.getByLabel('Приёмка с', { exact: true }).fill('09:00')
  await page.getByLabel('Приёмка до', { exact: true }).fill('11:00')
  await page
    .getByLabel('Комментарий / особые условия')
    .fill('Доставка через северные ворота')
  await page.getByRole('button', { name: 'Далее', exact: true }).click()
  await expect(
    page.getByRole('heading', {
      name: 'Проверка данных маршрута',
      exact: true,
    }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Сохранить маршрут', exact: true })
    .click()

  const createdDialog = page.getByRole('dialog', {
    name: 'Маршрут сохранён',
    exact: true,
  })
  await expect(createdDialog).toBeVisible()
  const message = await createdDialog
    .getByText(/Маршрут MR-\d+ успешно создан/)
    .innerText()
  const number = message.match(/MR-\d+/)?.[0]
  expect(number).toBeDefined()
  await createdDialog
    .getByRole('button', { name: 'Открыть маршрут', exact: true })
    .click()

  await expect(
    page.getByRole('heading', { name: `Маршрут ${number}`, exact: true }),
  ).toBeVisible()
  await expect(page).toHaveURL(/\/routes\/[^/]+$/)
  const detailsPath = new URL(page.url()).pathname
  expect(decodeURIComponent(detailsPath.split('/').at(-1)!)).not.toBe(number)
  const information = page.getByRole('region', { name: 'Общая информация' })
  await expect(
    information.getByText('12.11.2026', { exact: true }),
  ).toBeVisible()
  await expect(
    information.getByText('Доставка через северные ворота', { exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Редактировать', exact: true }).click()

  await expect(page).toHaveURL(new URL(`${detailsPath}/edit`, page.url()).href)
  await expect(page.getByLabel('Дата', { exact: true })).toHaveValue(
    '2026-11-12',
  )
  await expect(
    page.getByRole('combobox', { name: 'Статус', exact: true }),
  ).toBeDisabled()
  await page.getByLabel('Дата', { exact: true }).fill('2026-11-13')
  await page.getByRole('button', { name: 'Далее', exact: true }).click()
  await expect(start).toHaveValue('РЦ Северный')
  await page.getByRole('button', { name: 'Далее', exact: true }).click()
  await page
    .getByLabel('Комментарий / особые условия')
    .fill('Разгрузка у ворот 2')
  await page.getByRole('button', { name: 'Далее', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Проверка изменений', exact: true }),
  ).toBeVisible()
  await page
    .getByRole('button', { name: 'Сохранить изменения', exact: true })
    .click()

  const updatedDialog = page.getByRole('dialog', {
    name: 'Изменения сохранены',
    exact: true,
  })
  await expect(updatedDialog).toBeVisible()
  await updatedDialog
    .getByRole('button', { name: 'Открыть маршрут', exact: true })
    .click()
  await expect(page).toHaveURL(new URL(detailsPath, page.url()).href)
  await expect(
    page.getByRole('heading', { name: `Маршрут ${number}`, exact: true }),
  ).toBeVisible()
  await expect(
    information.getByText('13.11.2026', { exact: true }),
  ).toBeVisible()
  await expect(
    information.getByText('Разгрузка у ворот 2', { exact: true }),
  ).toBeVisible()
  await page
    .getByRole('navigation', { name: 'Хлебные крошки' })
    .getByRole('link', { name: 'Маршруты', exact: true })
    .click()

  const row = page
    .getByRole('table', { name: 'Маршруты', exact: true })
    .getByRole('row')
    .filter({ has: page.getByRole('link', { name: number, exact: true }) })
  await expect(row).toHaveCount(1)
  await expect(
    row.getByRole('link', { name: number, exact: true }),
  ).toHaveAttribute('href', detailsPath)
  await expect(row.getByText('13.11.2026', { exact: true })).toBeVisible()
  await expect(row.getByText('Создан', { exact: true })).toBeVisible()
})
