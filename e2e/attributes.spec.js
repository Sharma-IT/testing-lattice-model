// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Attributes — Overview', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html#attributes');
    await page.waitForTimeout(300);
  });

  test('renders page title and description', async ({ page }) => {

    await expect(page.locator('.section-title', { hasText: 'Quality Attributes' })).toBeVisible();
    await expect(page.locator('.section-desc')).toContainText('Six orthogonal quality dimensions');
  });

  test('renders six attribute cards', async ({ page }) => {

    const cards = page.locator('.card');
    await expect(cards).toHaveCount(6);

    const expectedNames = [
      'Correctness', 'Contracts', 'Accessibility',
      'Security', 'Performance', 'Observability',
    ];
    for (let i = 0; i < expectedNames.length; i++) {
      await expect(cards.nth(i).locator('.card-title')).toHaveText(expectedNames[i]);
    }
  });

  test('attribute cards show strategy count and gate count', async ({ page }) => {

    const firstCardMeta = page.locator('.card').first().locator('.card-meta');
    await expect(firstCardMeta).toContainText('strategies');
    await expect(firstCardMeta).toContainText('gates');
  });

  test('clicking an attribute card navigates to attribute detail', async ({ page }) => {

    await page.locator('.card').first().click();
    await expect(page).toHaveURL(/.*#attributes\/correctness/);
    await expect(page.locator('.gate-detail-title')).toContainText('Correctness');
  });
});

test.describe('Attributes — Detail Pages', () => {
  test('Correctness detail page renders with correct content', async ({ page }) => {

    await page.goto('/index.html#attributes/correctness');
    await page.waitForTimeout(300);

    await expect(page.locator('.gate-detail-title')).toContainText('Correctness');
    await expect(page.locator('.back-link')).toHaveAttribute('href', '#attributes');

    const narrative = page.locator('.gate-detail-narrative');
    await expect(narrative).toContainText('Does the software do what it is supposed to do');
  });

  test('attribute detail shows gate progression section', async ({ page }) => {

    await page.goto('/index.html#attributes/correctness');
    await page.waitForTimeout(300);

    const progressionTitle = page.locator('.section-title', { hasText: /How Correctness is verified/ });
    await expect(progressionTitle).toBeVisible();
  });

  test('attribute detail lists strategy cards with gate references', async ({ page }) => {

    await page.goto('/index.html#attributes/correctness');
    await page.waitForTimeout(300);

    const strategyCards = page.locator('.gate-tool-card');
    const cardCount = await strategyCards.count();
    expect(cardCount).toBeGreaterThan(0);

    // First card should have a gate reference link
    const firstCard = strategyCards.first();
    const gateLink = firstCard.locator('a[href^="#gates/"]');
    await expect(gateLink).toBeVisible();
  });

  test('attribute detail shows "Next" button except for last attribute', async ({ page }) => {

    await page.goto('/index.html#attributes/correctness');
    await page.waitForTimeout(300);
    await expect(page.locator('a.hero-cta', { hasText: 'Contracts' })).toBeVisible();

    await page.goto('/index.html#attributes/observability');
    await page.waitForTimeout(300);
    await expect(page.locator('a.hero-cta')).not.toBeAttached();
  });

  test('all six attribute detail pages render without error', async ({ page }) => {

    const ids = [
      'correctness', 'contracts', 'accessibility',
      'security', 'performance', 'observability',
    ];
    for (const id of ids) {
      await page.goto(`/index.html#attributes/${id}`);
      await page.waitForTimeout(300);
      await expect(page.locator('.gate-detail-title')).toBeVisible();
    }
  });

  test('invalid attribute ID falls back to attributes overview', async ({ page }) => {

    await page.goto('/index.html#attributes/nonexistent');
    await page.waitForTimeout(300);
    await expect(page.locator('.section-title', { hasText: 'Quality Attributes' })).toBeVisible();
  });
});
