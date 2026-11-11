import { expect, test } from 'playwright/test'

test('keeps Routes filters through Details, breadcrumbs and browser Back', async ({
  page,
}) => {
  await page.goto('/routes')
  const table = page.getByRole('table', { name: 'Маршруты', exact: true })
  await expect(table).toBeVisible()
  await page.getByRole('searchbox', { name: 'Поиск' }).fill('Северный')
  await page
    .getByRole('combobox', { name: 'Статус', exact: true })
    .selectOption('assigned')
  await expect(table.getByRole('link')).toHaveCount(1)
  await expect(
    table.getByRole('link', { name: 'MR-000123', exact: true }),
  ).toBeVisible()
  await expect(
    table.getByRole('link', { name: 'MR-000122', exact: true }),
  ).toHaveCount(0)
  const filteredUrl = page.url()

  await table.getByRole('link', { name: 'MR-000123', exact: true }).click()
  await expect(page).toHaveURL(/\/routes\/route-001$/)
  await expect(
    page.getByRole('heading', { name: 'Маршрут MR-000123', exact: true }),
  ).toBeVisible()
  const information = page.getByRole('region', { name: 'Общая информация' })
  await expect(
    information.getByText('РЦ Северный', { exact: true }),
  ).toBeVisible()
  await expect(
    information.getByText('02.11.2026', { exact: true }),
  ).toBeVisible()

  await page
    .getByRole('navigation', { name: 'Хлебные крошки' })
    .getByRole('link', { name: 'Маршруты', exact: true })
    .click()
  await expect(page).toHaveURL(filteredUrl)
  await expect(page.getByRole('searchbox', { name: 'Поиск' })).toHaveValue(
    'Северный',
  )
  await expect(
    page.getByRole('combobox', { name: 'Статус', exact: true }),
  ).toHaveValue('assigned')
  await expect(table.getByRole('link')).toHaveCount(1)

  await table.getByRole('link', { name: 'MR-000123', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Маршрут MR-000123', exact: true }),
  ).toBeVisible()
  await page.goBack()
  await expect(page).toHaveURL(filteredUrl)
  await expect(page.getByRole('searchbox', { name: 'Поиск' })).toHaveValue(
    'Северный',
  )
  await expect(
    page.getByRole('combobox', { name: 'Статус', exact: true }),
  ).toHaveValue('assigned')
  await expect(table.getByRole('link')).toHaveCount(1)
  await expect(
    table.getByRole('link', { name: 'MR-000123', exact: true }),
  ).toBeVisible()
})
