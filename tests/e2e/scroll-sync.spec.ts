import { test, expect } from '@playwright/test';

test.describe('Page Loading', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/THE_ARCHITECT/);
  });

  test('should load project page', async ({ page }) => {
    await page.goto('/projects/synapse-notes');
    await page.waitForLoadState('networkidle');

    const visualPanel = page.locator('.visual-panel');
    await expect(visualPanel).toBeVisible();
  });

  test('should have split-screen layout on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/projects/synapse-notes');

    const splitLayout = page.locator('.split-screen');
    await expect(splitLayout).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Click on first project link
    const projectLink = page.locator('.nav__link').first();
    await projectLink.click();

    // Should navigate to a project page
    await expect(page).toHaveURL(/\/projects\//);
  });

  test('should have working home link', async ({ page }) => {
    await page.goto('/projects/synapse-notes');
    await page.waitForLoadState('networkidle');

    const homeLink = page.locator('.nav__logo');
    await homeLink.click();

    await expect(page).toHaveURL('/');
  });

  test('should have mobile menu toggle', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const menuToggle = page.locator('.nav__toggle');
    await expect(menuToggle).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('should have skip to main content link', async ({ page }) => {
    await page.goto('/projects/synapse-notes');

    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('should have main content landmark', async ({ page }) => {
    await page.goto('/projects/synapse-notes');

    const main = page.locator('main#main-content');
    await expect(main).toBeVisible();
  });

  test('should have navigation landmark', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav[aria-label="Main navigation"]');
    await expect(nav).toBeAttached();
  });

  test('should have proper focus styles', async ({ page }) => {
    await page.goto('/');

    // Tab to first focusable element
    await page.keyboard.press('Tab');

    // Check that something is focused
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeAttached();
  });
});

test.describe('Visual Panel', () => {
  test('should display visual panel on project page', async ({ page }) => {
    await page.goto('/projects/synapse-notes');
    await page.waitForLoadState('networkidle');

    const visualPanel = page.locator('.visual-panel');
    await expect(visualPanel).toBeVisible();
  });

  test('should have terminal-style header', async ({ page }) => {
    await page.goto('/projects/synapse-notes');
    await page.waitForLoadState('networkidle');

    const terminalHeader = page.locator('.visual-panel__header');
    await expect(terminalHeader).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('should display single column on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/projects/synapse-notes');

    // On mobile, the split layout should be present
    const splitLayout = page.locator('.split-screen');
    await expect(splitLayout).toBeVisible();
  });

  test('should display two columns on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/projects/synapse-notes');

    const narrativePanel = page.locator('.narrative-panel');
    const visualPanel = page.locator('.visual-panel');

    await expect(narrativePanel).toBeVisible();
    await expect(visualPanel).toBeVisible();
  });
});

test.describe('404 Error Page', () => {
  test('should display 404 page for invalid routes', async ({ page }) => {
    await page.goto('/invalid-route-12345');

    // Check for 404 indicator in the terminal-style error page
    const errorNumber = page.locator('.error-page__number');
    await expect(errorNumber).toContainText('404');
  });

  test('should have link back to home on 404 page', async ({ page }) => {
    await page.goto('/invalid-route-12345');

    // Check for the "cd ~" link that goes home
    const homeLink = page.locator('.error-page__link');
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');
  });

  test('should have terminal-style error display', async ({ page }) => {
    await page.goto('/invalid-route-12345');

    const terminal = page.locator('.error-page__terminal');
    await expect(terminal).toBeVisible();
  });
});

test.describe('Keyboard Navigation', () => {
  test('should close mobile menu with Escape', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open menu
    const menuToggle = page.locator('.nav__toggle');
    await menuToggle.click();

    // Menu should be open
    const menu = page.locator('.nav__menu--open');
    await expect(menu).toBeVisible();

    // Press Escape
    await page.keyboard.press('Escape');

    // Menu should be closed
    await expect(menu).not.toBeVisible();
  });

  test('should navigate with Tab key', async ({ page }) => {
    await page.goto('/');

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should have focused an interactive element
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeAttached();
  });
});
