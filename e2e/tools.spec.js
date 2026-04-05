// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Tool Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html#tools');
    await page.waitForTimeout(300);
  });

  test('renders page title and description', async ({ page }) => {

    await expect(page.locator('.section-title', { hasText: 'Tool Catalogue' })).toBeVisible();
    await expect(page.locator('.section-desc')).toContainText('unique tools');
  });

  test('renders search input', async ({ page }) => {

    const searchInput = page.locator('#tool-search');
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toHaveAttribute('placeholder', /Search tools/);
  });

  test('renders all tools as cards', async ({ page }) => {

    const toolItems = page.locator('.tool-item');
    const count = await toolItems.count();
    expect(count).toBeGreaterThan(30); // data model has ~50 tools
  });

  test('tool cards show tool name and appearance metadata', async ({ page }) => {

    const firstTool = page.locator('.tool-item').first();
    await expect(firstTool.locator('.tool-item-name')).toBeVisible();

    const appearances = firstTool.locator('.tool-appearance');
    const appCount = await appearances.count();
    expect(appCount).toBeGreaterThanOrEqual(1);
  });

  test('search filters tools by name', async ({ page }) => {

    const totalBefore = await page.locator('.tool-item').count();

    await page.locator('#tool-search').fill('Playwright');
    await page.waitForTimeout(200);

    const totalAfter = await page.locator('.tool-item').count();
    expect(totalAfter).toBeLessThan(totalBefore);
    expect(totalAfter).toBeGreaterThanOrEqual(1);

    const visibleToolName = page.locator('.tool-item-name').first();
    await expect(visibleToolName).toContainText(/Playwright/i);
  });

  test('search is case-insensitive', async ({ page }) => {

    await page.locator('#tool-search').fill('eslint');
    await page.waitForTimeout(200);
    const lowerCount = await page.locator('.tool-item').count();

    await page.locator('#tool-search').fill('ESLint');
    await page.waitForTimeout(200);
    const upperCount = await page.locator('.tool-item').count();

    expect(lowerCount).toBe(upperCount);
    expect(lowerCount).toBeGreaterThanOrEqual(1);
  });

  test('empty search shows all tools', async ({ page }) => {

    const totalBefore = await page.locator('.tool-item').count();

    await page.locator('#tool-search').fill('zzzzzz_nonexistent');
    await page.waitForTimeout(200);
    expect(await page.locator('.tool-item').count()).toBe(0);

    await page.locator('#tool-search').fill('');
    await page.waitForTimeout(200);
    expect(await page.locator('.tool-item').count()).toBe(totalBefore);
  });

  test('no-results search shows empty state', async ({ page }) => {

    await page.locator('#tool-search').fill('zzz_does_not_exist_xyz');
    await page.waitForTimeout(200);

    const emptyState = page.locator('.empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText('No tools found');
  });

  test('tool appearances link to gate and attribute detail pages', async ({ page }) => {

    const firstTool = page.locator('.tool-item').first();
    const gateLink = firstTool.locator('a[href^="#gates/"]');
    await expect(gateLink).toBeVisible();

    const attrLink = firstTool.locator('a[href^="#attributes/"]');
    await expect(attrLink).toBeVisible();
  });
});
