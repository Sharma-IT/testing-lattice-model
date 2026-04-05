// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html#home');
  });

  test('renders hero section with title and subtitle but no hero-badge', async ({ page }) => {

    const title = page.locator('.hero-title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('The Testing Lattice Model');

    const subtitle = page.locator('.hero-subtitle');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('three orthogonal axes');

    const badge = page.locator('.hero-badge');
    await expect(badge).toHaveCount(0);
  });

  test('displays four stat cards with correct values', async ({ page }) => {

    const stats = page.locator('.hero-stat');
    await expect(stats).toHaveCount(4);

    const statNumbers = page.locator('.hero-stat-number');
    await expect(statNumbers.nth(0)).toHaveText('5');
    await expect(statNumbers.nth(1)).toHaveText('6');

    const statLabels = page.locator('.hero-stat-label');
    await expect(statLabels.nth(0)).toHaveText('Quality Gates');
    await expect(statLabels.nth(1)).toHaveText('Quality Attributes');
    await expect(statLabels.nth(2)).toHaveText('Test Strategies');
    await expect(statLabels.nth(3)).toHaveText('Unique Tools');
  });

  test('renders "Explore the Lattice" CTA linking to #lattice', async ({ page }) => {

    const cta = page.locator('.hero-cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/Explore the Lattice/);
    await expect(cta).toHaveAttribute('href', '#lattice');
  });

  test('renders philosophy section with comparison quote', async ({ page }) => {

    const sectionTitle = page.locator('.section-title', { hasText: 'Why another testing model?' });
    await expect(sectionTitle).toBeVisible();

    const quote = page.locator('.comparison-quote');
    await expect(quote).toBeVisible();
    await expect(quote).toContainText('The pyramid gives you a shape');
    await expect(quote).toContainText('The lattice gives you all three');
  });

  test('renders four philosophy principle cards', async ({ page }) => {

    const cards = page.locator('.philosophy-card');
    await expect(cards).toHaveCount(4);

    const expectedTitles = [
      'Gate assignment replaces volume ratios',
      'Fault localisation prevents test suite gaming',
      'Production scope is mandatory',
      'Static analysis is Gate 0 infrastructure',
    ];

    for (let i = 0; i < expectedTitles.length; i++) {
      const title = cards.nth(i).locator('.philosophy-card-title');
      await expect(title).toHaveText(expectedTitles[i]);
    }
  });

  test('renders gate timeline with all five gates', async ({ page }) => {

    const timelineItems = page.locator('.gate-timeline-item');
    await expect(timelineItems).toHaveCount(5);

    const names = page.locator('.gate-timeline-name');
    await expect(names.nth(0)).toHaveText('Gate 0');
    await expect(names.nth(4)).toHaveText('Gate 4');
  });

  test('renders adoption guide block', async ({ page }) => {

    const adoptionBlock = page.locator('.adoption-block');
    await expect(adoptionBlock).toBeVisible();
    await expect(adoptionBlock).toContainText('Audit your current suite against the grid');
  });

  test('CTA navigates to lattice view on click', async ({ page }) => {

    await page.locator('.hero-cta').click();
    await expect(page).toHaveURL(/.*#lattice/);
    await expect(page.locator('.lattice-grid')).toBeVisible();
  });
});
