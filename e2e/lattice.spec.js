// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Lattice Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html#lattice');
    await page.waitForTimeout(300);
  });

  test('renders all five gate rows', async ({ page }) => {

    const gateLabels = page.locator('.lattice-gate');
    await expect(gateLabels).toHaveCount(5);

    const gateNames = page.locator('.lattice-gate-name');
    await expect(gateNames.nth(0)).toHaveText('Gate 0');
    await expect(gateNames.nth(1)).toHaveText('Gate 1');
    await expect(gateNames.nth(2)).toHaveText('Gate 2');
    await expect(gateNames.nth(3)).toHaveText('Gate 3');
    await expect(gateNames.nth(4)).toHaveText('Gate 4');
  });

  test('renders all six attribute column headers', async ({ page }) => {

    const headers = page.locator('.lattice-hdr');
    await expect(headers).toHaveCount(6);

    const expectedHeaders = [
      'Correctness', 'Contracts', 'Accessibility',
      'Security', 'Performance', 'Observability',
    ];
    for (let i = 0; i < expectedHeaders.length; i++) {
      await expect(headers.nth(i)).toHaveText(expectedHeaders[i]);
    }
  });

  test('renders populated cells with tool names and scope', async ({ page }) => {

    const cells = page.locator('.lattice-cell');
    const cellCount = await cells.count();
    expect(cellCount).toBeGreaterThan(0);

    // Verify first cell (Gate 0, Correctness — TypeScript + ESLint)
    const firstCell = cells.first();
    await expect(firstCell.locator('.lattice-cell-tool')).toHaveText('TypeScript + ESLint');
    await expect(firstCell.locator('.lattice-cell-scope')).toHaveText('implementation');
  });

  test('renders empty cells for unpopulated positions', async ({ page }) => {

    const emptyCells = page.locator('.lattice-cell-empty');
    const emptyCount = await emptyCells.count();
    expect(emptyCount).toBeGreaterThan(0);
  });

  test('renders fault localisation indicators on populated cells', async ({ page }) => {

    const firstCell = page.locator('.lattice-cell').first();
    const flDot = firstCell.locator('.lattice-cell-fl');
    await expect(flDot).toBeVisible();
  });

  test('clicking a cell opens detail panel below the grid', async ({ page }) => {

    const cell = page.locator('.lattice-cell').first();
    await cell.click();

    const panel = page.locator('.detail-panel');
    await expect(panel).toBeVisible();

    await expect(panel.locator('.detail-panel-title')).toHaveText('TypeScript + ESLint');
    await expect(panel.locator('.detail-panel-subtitle')).toContainText('Gate 0');
    await expect(panel.locator('.detail-panel-subtitle')).toContainText('Correctness');
    await expect(panel.locator('.detail-panel-body')).toContainText('Type checking and lint rules');

    // Verify chips
    const chips = panel.locator('.chip');
    const chipCount = await chips.count();
    expect(chipCount).toBeGreaterThanOrEqual(3); // scope, FL, and at least one tool
  });

  test('detail panel close button dismisses it', async ({ page }) => {

    await page.locator('.lattice-cell').first().click();
    await expect(page.locator('.detail-panel')).toBeVisible();

    await page.locator('#detail-close').click();
    await expect(page.locator('.detail-panel')).not.toBeAttached();
  });

  test('clicking a different cell updates the detail panel', async ({ page }) => {

    const cells = page.locator('.lattice-cell');
    await cells.first().click();
    await expect(page.locator('.detail-panel-title')).toHaveText('TypeScript + ESLint');

    await cells.nth(1).click();
    const newTitle = await page.locator('.detail-panel-title').textContent();
    expect(newTitle).not.toBe('TypeScript + ESLint');
  });

  test('keyboard Enter activates a cell', async ({ page }) => {

    const firstCell = page.locator('.lattice-cell').first();
    await firstCell.focus();
    await firstCell.press('Enter');

    await expect(page.locator('.detail-panel')).toBeVisible();
  });

  test('gate labels link to gate detail pages', async ({ page }) => {

    const gateLabel = page.locator('.lattice-gate').first();
    await expect(gateLabel).toHaveAttribute('href', '#gates/0');
  });
});

test.describe('Lattice Grid — Filter Layout', () => {
  test('Scope and Localisation filters are on separate rows', async ({ page }) => {

    await page.goto('/index.html#lattice');
    await page.waitForTimeout(300);

    const positions = await page.evaluate(() => {
      const groups = document.querySelectorAll('.filter-group');
      return Array.from(groups).map((g) => {
        const rect = g.getBoundingClientRect();
        return { top: rect.top, label: g.querySelector('.filter-label')?.textContent?.trim() };
      });
    });

    const scopeGroup = positions.find((p) => p.label === 'Scope');
    const locGroup = positions.find((p) => p.label === 'Localisation');

    if (!scopeGroup || !locGroup) {
      throw new Error('Expected both Scope and Localisation filter groups to exist');
    }
    expect(locGroup.top).toBeGreaterThan(scopeGroup.top);
  });
});

test.describe('Lattice Grid — Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html#lattice');
    await page.waitForTimeout(300);
  });

  test('scope filter dims non-matching cells', async ({ page }) => {

    const implementationPill = page.locator('.filter-pill[data-scope="implementation"]');
    await implementationPill.click();
    await page.waitForTimeout(300);

    const dimmedCells = page.locator('.lattice-cell.dim');
    const dimmedCount = await dimmedCells.count();
    expect(dimmedCount).toBeGreaterThan(0);

    // "All" should still exist and not be active
    const allPill = page.locator('.filter-pill[data-scope="all"]');
    await expect(allPill).not.toHaveClass(/active/);
    await expect(implementationPill).toHaveClass(/active/);
  });

  test('localisation filter dims non-matching cells', async ({ page }) => {

    const highPill = page.locator('.filter-pill[data-fl="high"]');
    await highPill.click();
    await page.waitForTimeout(300);

    const dimmedCells = page.locator('.lattice-cell.dim');
    const dimmedCount = await dimmedCells.count();
    expect(dimmedCount).toBeGreaterThan(0);
  });

  test('"All" scope filter removes dimming', async ({ page }) => {

    // First filter
    await page.locator('.filter-pill[data-scope="component"]').click();
    await page.waitForTimeout(300);
    expect(await page.locator('.lattice-cell.dim').count()).toBeGreaterThan(0);

    // Reset
    await page.locator('.filter-pill[data-scope="all"]').click();
    await page.waitForTimeout(300);
    expect(await page.locator('.lattice-cell.dim').count()).toBe(0);
  });

  test('combining scope and FL filters narrows results further', async ({ page }) => {

    // Apply scope filter
    await page.locator('.filter-pill[data-scope="system"]').click();
    await page.waitForTimeout(300);
    const dimmedAfterScope = await page.locator('.lattice-cell.dim').count();

    // Apply FL filter on top
    await page.locator('.filter-pill[data-fl="high"]').click();
    await page.waitForTimeout(300);
    const dimmedAfterBoth = await page.locator('.lattice-cell.dim').count();

    expect(dimmedAfterBoth).toBeGreaterThanOrEqual(dimmedAfterScope);
  });
});
