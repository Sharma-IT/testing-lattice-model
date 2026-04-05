// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Gates — Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html#gates');
    await page.waitForTimeout(300);
  });

  test('renders page title and description', async ({ page }) => {

    await expect(page.locator('.section-title', { hasText: 'Quality Gates' })).toBeVisible();
    await expect(page.locator('.section-desc')).toContainText('Five blocking thresholds');
  });

  test('renders gate timeline with five items', async ({ page }) => {

    const timelineItems = page.locator('.gate-timeline-item');
    await expect(timelineItems).toHaveCount(5);
  });

  test('renders five gate cards', async ({ page }) => {

    const cards = page.locator('.card');
    await expect(cards).toHaveCount(5);

    const titles = page.locator('.card-title');
    await expect(titles.nth(0)).toContainText('Gate 0');
    await expect(titles.nth(0)).toContainText('Pre-commit');
    await expect(titles.nth(4)).toContainText('Gate 4');
    await expect(titles.nth(4)).toContainText('Production');
  });

  test('gate cards display key principle text', async ({ page }) => {

    const firstCardBody = page.locator('.card').first().locator('.card-body');
    await expect(firstCardBody).toContainText('Catch what can be caught without executing code');
  });

  test('clicking a gate card navigates to gate detail', async ({ page }) => {

    await page.locator('.card').first().click();
    await expect(page).toHaveURL(/.*#gates\/0/);
    await expect(page.locator('.gate-detail-title')).toBeVisible();
  });
});

test.describe('Gates — Detail Pages', () => {
  test('Gate 0 renders with correct content', async ({ page }) => {

    await page.goto('/index.html#gates/0');
    await page.waitForTimeout(300);

    await expect(page.locator('.gate-detail-title')).toContainText('Gate 0');
    await expect(page.locator('.gate-detail-badge')).toContainText('Pre-commit');
    await expect(page.locator('.gate-detail-badge')).toContainText('<30s');

    const narrative = page.locator('.gate-detail-narrative');
    await expect(narrative).toContainText('mandatory infrastructure');

    const principle = page.locator('.gate-detail-principle');
    await expect(principle).toContainText('Catch what can be caught without executing code');
  });

  test('Gate detail shows back link to gates overview', async ({ page }) => {

    await page.goto('/index.html#gates/0');
    await page.waitForTimeout(300);

    const backLink = page.locator('.back-link');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '#gates');
  });

  test('Gate detail lists all test strategies for that gate', async ({ page }) => {

    await page.goto('/index.html#gates/0');
    await page.waitForTimeout(300);

    const strategyCards = page.locator('.gate-tool-card');
    await expect(strategyCards).toHaveCount(5);

    // Verify first strategy
    const firstCard = strategyCards.first();
    await expect(firstCard.locator('.gate-tool-name')).toHaveText('TypeScript + ESLint');
  });

  test('Gate detail strategy cards show scope and FL chips', async ({ page }) => {

    await page.goto('/index.html#gates/0');
    await page.waitForTimeout(300);

    const firstCard = page.locator('.gate-tool-card').first();
    const chips = firstCard.locator('.chip');
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThanOrEqual(2); // scope and FL at minimum
  });

  test('Gate detail shows "Next gate" button for non-final gates', async ({ page }) => {

    await page.goto('/index.html#gates/0');
    await page.waitForTimeout(300);
    await expect(page.locator('a.hero-cta', { hasText: 'Gate 1' })).toBeVisible();

    await page.goto('/index.html#gates/4');
    await page.waitForTimeout(300);
    await expect(page.locator('a.hero-cta')).not.toBeAttached();
  });

  test('all five gate detail pages render without error', async ({ page }) => {

    for (let i = 0; i <= 4; i++) {
      await page.goto(`/index.html#gates/${i}`);
      await page.waitForTimeout(300);
      await expect(page.locator('.gate-detail-title')).toContainText(`Gate ${i}`);
    }
  });

  test('invalid gate ID falls back to gates overview', async ({ page }) => {

    await page.goto('/index.html#gates/99');
    await page.waitForTimeout(300);
    await expect(page.locator('.section-title', { hasText: 'Quality Gates' })).toBeVisible();
  });
});
