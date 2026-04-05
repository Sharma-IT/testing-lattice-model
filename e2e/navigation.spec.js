// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('nav bar renders with all links', async ({ page }) => {

    const navLinks = page.locator('.nav-links .nav-link');
    await expect(navLinks).toHaveCount(6);

    const expectedLabels = ['Home', 'Lattice', 'Gates', 'Attributes', 'Tools', 'Localisation'];
    for (let i = 0; i < expectedLabels.length; i++) {
      await expect(navLinks.nth(i)).toHaveText(expectedLabels[i]);
    }
  });

  test('active nav link highlights based on current route', async ({ page }) => {

    // Home is active by default
    const homeLink = page.locator('.nav-link[data-route="home"]');
    await expect(homeLink).toHaveClass(/active/);

    // Navigate to lattice
    await page.goto('/index.html#lattice');
    await page.waitForTimeout(300);
    const latticeLink = page.locator('.nav-link[data-route="lattice"]');
    await expect(latticeLink).toHaveClass(/active/);
    await expect(homeLink).not.toHaveClass(/active/);
  });

  test('clicking nav links navigates to correct views', async ({ page }) => {

    // Navigate to Gates
    await page.locator('.nav-link[data-route="gates"]').click();
    await expect(page).toHaveURL(/.*#gates/);
    await expect(page.locator('.section-title', { hasText: 'Quality Gates' })).toBeVisible();

    // Navigate to Attributes
    await page.locator('.nav-link[data-route="attributes"]').click();
    await expect(page).toHaveURL(/.*#attributes/);
    await expect(page.locator('.section-title', { hasText: 'Quality Attributes' })).toBeVisible();

    // Navigate to Tools
    await page.locator('.nav-link[data-route="tools"]').click();
    await expect(page).toHaveURL(/.*#tools/);
    await expect(page.locator('.section-title', { hasText: 'Tool Catalogue' })).toBeVisible();

    // Navigate to Localisation
    await page.locator('.nav-link[data-route="localisation"]').click();
    await expect(page).toHaveURL(/.*#localisation/);
    await expect(page.locator('.section-title', { hasText: 'Fault Localisation' })).toBeVisible();
  });

  test('brand link navigates to home', async ({ page }) => {

    await page.goto('/index.html#tools');
    await page.waitForTimeout(300);
    await page.locator('#nav-brand').click();
    await expect(page).toHaveURL(/.*#home/);
    await expect(page.locator('.hero-title')).toBeVisible();
  });

  test('back/forward browser navigation works with hash routing', async ({ page }) => {

    await page.locator('.nav-link[data-route="gates"]').click();
    await page.waitForTimeout(300);
    await page.locator('.nav-link[data-route="tools"]').click();
    await page.waitForTimeout(300);

    await page.goBack();
    await expect(page).toHaveURL(/.*#gates/);
    await expect(page.locator('.section-title', { hasText: 'Quality Gates' })).toBeVisible();

    await page.goForward();
    await expect(page).toHaveURL(/.*#tools/);
    await expect(page.locator('.section-title', { hasText: 'Tool Catalogue' })).toBeVisible();
  });

  test('direct URL entry with hash routes to correct view', async ({ page }) => {

    await page.goto('/index.html#attributes');
    await expect(page.locator('.section-title', { hasText: 'Quality Attributes' })).toBeVisible();

    await page.goto('/index.html#gates/2');
    await expect(page.locator('.gate-detail-title')).toContainText('Gate 2');
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile menu toggle shows and hides menu', async ({ page }) => {

    await page.goto('/index.html');

    const mobileToggle = page.locator('#mobile-toggle');
    await expect(mobileToggle).toBeVisible();

    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).not.toHaveClass(/open/);

    // Open
    await mobileToggle.click();
    await expect(mobileMenu).toHaveClass(/open/);

    // Close
    await mobileToggle.click();
    await expect(mobileMenu).not.toHaveClass(/open/);
  });

  test('mobile menu links navigate and close menu', async ({ page }) => {

    await page.goto('/index.html');
    await page.locator('#mobile-toggle').click();

    const gatesLink = page.locator('.mobile-menu-link[data-route="gates"]');
    await gatesLink.click();
    await expect(page).toHaveURL(/.*#gates/);

    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).not.toHaveClass(/open/);
  });
});
