// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Fault Localisation Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html#localisation');
    await page.waitForTimeout(300);
  });

  test('renders page title and description', async ({ page }) => {

    await expect(page.locator('.section-title', { hasText: 'Fault Localisation' })).toBeVisible();
    await expect(page.locator('.section-desc')).toContainText('How precisely a failing test identifies');
  });

  test('renders the key comparison quote', async ({ page }) => {

    const quote = page.locator('.comparison-quote');
    await expect(quote).toBeVisible();
    await expect(quote).toContainText('something');
    await expect(quote).toContainText('exactly');
  });

  test('renders three FL level sections', async ({ page }) => {

    const flRows = page.locator('.fl-level-row');
    await expect(flRows).toHaveCount(3);

    const names = page.locator('.fl-level-name');
    await expect(names.nth(0)).toContainText('High');
    await expect(names.nth(1)).toContainText('Mid');
    await expect(names.nth(2)).toContainText('Low');
  });

  test('each FL level shows its description and strategy count', async ({ page }) => {

    const highRow = page.locator('.fl-level-row').first();
    await expect(highRow.locator('.fl-level-desc')).toContainText('No debugging cycle needed');
    await expect(highRow.locator('.fl-level-gates')).toContainText('test strategies');
  });

  test('each FL level shows its tag description', async ({ page }) => {

    const tags = page.locator('.fl-level-tag');
    await expect(tags.nth(0)).toContainText('function, module, or line');
    await expect(tags.nth(1)).toContainText('service or component boundary');
    await expect(tags.nth(2)).toContainText('system-level symptom');
  });

  test('renders three philosophy cards explaining why localisation matters', async ({ page }) => {

    const cards = page.locator('.philosophy-card');
    await expect(cards).toHaveCount(3);

    await expect(cards.nth(0).locator('.philosophy-card-title')).toContainText('Prevents test suite gaming');
    await expect(cards.nth(1).locator('.philosophy-card-title')).toContainText('Backs up expensive failures');
    await expect(cards.nth(2).locator('.philosophy-card-title')).toContainText('Coverage contract');
  });
});
