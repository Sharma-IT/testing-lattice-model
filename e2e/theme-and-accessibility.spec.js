// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Theme Toggle', () => {
  test('defaults to dark theme', async ({ page }) => {

    await page.goto('/index.html');

    // Fresh page with no localStorage should default to dark
    const theme = await page.locator('html').getAttribute('data-theme');
    expect(theme).toBe('dark');
  });

  test('toggle switches from dark to light and back', async ({ page }) => {

    await page.goto('/index.html');

    const toggle = page.locator('#theme-toggle');
    await expect(toggle).toBeVisible();

    // Switch to light
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Switch back to dark
    await toggle.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('theme persists across page reloads via localStorage', async ({ page }) => {

    await page.goto('/index.html');
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    // Cleanup: reset to dark
    await page.locator('#theme-toggle').click();
  });

  test('toggle button shows correct icon for each theme', async ({ page }) => {

    await page.goto('/index.html');

    const toggle = page.locator('#theme-toggle');
    const darkIcon = await toggle.textContent();

    await toggle.click();
    const lightIcon = await toggle.textContent();

    expect(darkIcon).not.toBe(lightIcon);
  });

  test('theme toggle has accessible label', async ({ page }) => {

    await page.goto('/index.html');
    const toggle = page.locator('#theme-toggle');
    const label = await toggle.getAttribute('aria-label');
    expect(label).toContain('Switch to');
  });
});

test.describe('Background Pattern', () => {
  test('renders a background pattern on the body in dark theme', async ({ page }) => {

    await page.goto('/index.html');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    const bgImage = await page.evaluate(() =>
      window.getComputedStyle(document.body, '::after').getPropertyValue('background-image')
    );
    expect(bgImage).not.toBe('none');
    expect(bgImage).toBeTruthy();
  });

  test('background pattern covers the full page', async ({ page }) => {

    await page.goto('/index.html');

    const styles = await page.evaluate(() => {
      const computed = window.getComputedStyle(document.body, '::after');
      return {
        position: computed.getPropertyValue('position'),
        inset: computed.getPropertyValue('inset'),
        pointerEvents: computed.getPropertyValue('pointer-events'),
      };
    });
    expect(styles.position).toBe('fixed');
    expect(styles.pointerEvents).toBe('none');
  });

  test('background pattern adapts when switching to light theme', async ({ page }) => {

    await page.goto('/index.html');

    const darkBg = await page.evaluate(() =>
      window.getComputedStyle(document.body, '::after').getPropertyValue('background-image')
    );

    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

    const lightBg = await page.evaluate(() =>
      window.getComputedStyle(document.body, '::after').getPropertyValue('background-image')
    );

    // Both themes should have a pattern
    expect(darkBg).not.toBe('none');
    expect(lightBg).not.toBe('none');

    // The pattern colours should differ between themes
    expect(darkBg).not.toBe(lightBg);
  });
});

test.describe('Footer', () => {
  test('footer renders with attribution text', async ({ page }) => {

    await page.goto('/index.html');
    const footer = page.locator('.footer');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('Testing Lattice Model');
  });
});

test.describe('SEO & Accessibility', () => {
  test('page has the correct favicon URL', async ({ page }) => {

    await page.goto('/index.html');
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveCount(1);
    const href = await favicon.getAttribute('href');
    expect(href).toBe('https://avatars.githubusercontent.com/u/88814023?v=4');
  });

  test('page has correct title tag', async ({ page }) => {

    await page.goto('/index.html');
    await expect(page).toHaveTitle(/Testing Lattice Model/);
  });

  test('page has meta description', async ({ page }) => {

    await page.goto('/index.html');
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(50);
  });

  test('main content has role="main"', async ({ page }) => {

    await page.goto('/index.html');
    await expect(page.locator('main[role="main"]')).toBeVisible();
  });

  test('navigation has proper ARIA attributes', async ({ page }) => {

    await page.goto('/index.html');
    const nav = page.locator('nav[role="navigation"]');
    await expect(nav).toBeVisible();
    const label = await nav.getAttribute('aria-label');
    expect(label).toBeTruthy();
  });

  test('lattice cells have accessible labels', async ({ page }) => {

    await page.goto('/index.html#lattice');
    await page.waitForTimeout(300);

    const firstCell = page.locator('.lattice-cell').first();
    const ariaLabel = await firstCell.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    expect(ariaLabel).toContain('TypeScript');

    const tabindex = await firstCell.getAttribute('tabindex');
    expect(tabindex).toBe('0');
  });
});
