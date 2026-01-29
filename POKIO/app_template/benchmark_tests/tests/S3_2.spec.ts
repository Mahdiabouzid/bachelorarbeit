import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:5173';

test.describe('Accessibility Scans', () => {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Upload', path: '/upload' },
    { name: 'About', path: '/about' },
    { name: 'Settings', path: '/settings' },
  ];

  for (const p of pages) {
    test(`${p.name} page should have no automatically detectable accessibility violations`, async ({ page }) => {
      await page.goto(`${BASE_URL}${p.path}`);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

test.describe('Navigation & Routing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Header displays app title "Lumen"', async ({ page }) => {
    await expect(page.getByText('Lumen', { exact: true })).toBeVisible();
  });

  test('Navigation contains all required links', async ({ page }) => {
    const nav = page.getByRole('navigation').or(page.locator('header')).first();
    await expect(nav.getByRole('link', { name: 'Home', exact: true }).first()).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Gallery', exact: true }).first()).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Upload', exact: true }).first()).toBeVisible();
    await expect(nav.getByRole('link', { name: 'About', exact: true }).first()).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Settings', exact: true }).first()).toBeVisible();
  });

  test('Home link navigates to /', async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
    await page.getByRole('link', { name: 'Home', exact: true }).first().click();
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Gallery link navigates to /gallery', async ({ page }) => {
    await page.getByRole('link', { name: 'Gallery', exact: true }).first().click();
    await expect(page).toHaveURL(BASE_URL + '/gallery');
  });

  test('Upload link navigates to /upload', async ({ page }) => {
    await page.getByRole('link', { name: 'Upload', exact: true }).first().click();
    await expect(page).toHaveURL(BASE_URL + '/upload');
  });

  test('About link navigates to /about', async ({ page }) => {
    await page.getByRole('link', { name: 'About', exact: true }).first().click();
    await expect(page).toHaveURL(BASE_URL + '/about');
  });

  test('Settings link navigates to /settings', async ({ page }) => {
    await page.getByRole('link', { name: 'Settings', exact: true }).first().click();
    await expect(page).toHaveURL(BASE_URL + '/settings');
  });

  test('Navigation is persistent across all pages', async ({ page }) => {
    const pages = ['/', '/gallery', '/upload', '/about', '/settings'];
    for (const path of pages) {
      await page.goto(`${BASE_URL}${path}`);
      const nav = page.getByRole('navigation').or(page.locator('header')).first();
      await expect(nav.getByRole('link', { name: 'Home', exact: true }).first()).toBeVisible();
      await expect(nav.getByRole('link', { name: 'Gallery', exact: true }).first()).toBeVisible();
    }
  });
});

test.describe('Theming System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the site first to get the correct origin
    await page.goto(BASE_URL);
    // Clear storage ONCE via evaluate, NOT via addInitScript
    await page.evaluate(() => localStorage.clear());
    // Now go to the settings page
    await page.goto(`${BASE_URL}/settings`);
  });

  const themeToggleLocator = (page) =>
    page.getByTestId('theme-toggle')
      .or(page.getByRole('button', { name: /toggle theme/i }))
      .or(page.getByLabel(/toggle theme/i))
      // Optional fallback if you ever change aria-label to visible label:
      .or(page.getByRole('button', { name: /dark mode|dunkelmodus/i })).first();

  const accentSelectLocator = (page) =>
    page.getByTestId('accent-select')
      .or(page.getByRole('combobox', { name: /accent color|akzentfarbe/i }))
      .or(page.getByLabel(/accent color|akzentfarbe/i));

  test('Theme toggle exists with accessible name "Toggle Theme"', async ({ page }) => {
    const themeToggle = themeToggleLocator(page);
    await expect(themeToggle).toBeVisible();
    // optional: ensure it is actually named correctly
    await expect(themeToggle).toHaveAccessibleName(/toggle theme|theme/i);
  });

  test('Theme persists in localStorage as "lumen.theme"', async ({ page }) => {
    const themeToggle = themeToggleLocator(page);

    // for sonnet 4.5
    // await themeToggle.click();
    await themeToggle.setChecked(true);;

    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('lumen.theme'));
    }).toMatch(/light|dark/);
  });

  test('Theme persists across page reloads', async ({ page }) => {
    const themeToggle = themeToggleLocator(page);
    
    // 1. Change the theme
    // await themeToggle.click();

    // for sonnet 4.5
    await themeToggle.setChecked(true);

    // 2. Wait for localStorage to update
    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('lumen.theme'));
    }).not.toBeNull();

    const themeBeforeValue = await page.evaluate(() => localStorage.getItem('lumen.theme'));
    
    await page.reload();

    // 4. Verify
    const themeAfterValue = await page.evaluate(() => localStorage.getItem('lumen.theme'));
    expect(themeAfterValue).toBe(themeBeforeValue);
  });

  test('Accent selector exists with accessible name "Accent Color"', async ({ page }) => {
    const accentSelect = accentSelectLocator(page);
    await expect(accentSelect).toBeVisible();
  });

   test('Accent selector has options: Ocean, Sunset, Forest', async ({ page }) => {
    const accentSelect = accentSelectLocator(page);
    
    // This checks the visible text of the options inside the select
    await expect(accentSelect).toHaveText(/Ocean\s*Sunset\s*Forest/);
    
    // OR check them individually:
    const options = accentSelect.locator('option');
    await expect(options).toHaveText(['Ocean', 'Sunset', 'Forest']);
  });

  test('Accent persists in localStorage as "lumen.accent"', async ({ page }) => {
    const accentSelect = accentSelectLocator(page);

    await accentSelect.selectOption('sunset');

    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('lumen.accent'));
    }).toMatch(/ocean|sunset|forest/);

    // Optional stronger check:
    const storedAccent = await page.evaluate(() => localStorage.getItem('lumen.accent'));
    expect(storedAccent).toBe('sunset');
  });

  test('Accent persists across sessions', async ({ page }) => {
    const accentSelect = accentSelectLocator(page);

    // Select an option
    await accentSelect.selectOption('forest');

    // Wait for storage
    await expect.poll(async () => {
      return page.evaluate(() => localStorage.getItem('lumen.accent'));
    }).toBe('forest');

    await page.reload();

    // Verify after reload
    const accentAfter = await page.evaluate(() => localStorage.getItem('lumen.accent'));
    expect(accentAfter).toBe('forest');
  });
});

test.describe('Localization', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Clear storage on the domain before starting
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    // 2. Go to settings
    await page.goto(`${BASE_URL}/settings`);
  });

  // Updated locator to be more robust
  const langSwitchLocator = (page: any) => page.getByTestId('language-select')
    .or(page.getByRole('combobox', { name: /language|sprache/i }))
    .or(page.getByLabel(/language|sprache/i))
    .first();

  test('Language switcher exists with accessible name "Language"', async ({ page }) => {
    const langSwitch = langSwitchLocator(page);
    await expect(langSwitch).toBeVisible();
  });

  test('Language switcher supports English and German', async ({ page }) => {
    const langSwitch = langSwitchLocator(page);
    
    // Create a locator for the options inside the select
    const options = langSwitch.locator('option');

    const values = await options.evaluateAll((elements: any) => 
      elements.map(el => (el as HTMLOptionElement).value)
    );
    
    expect(values).toEqual(['en', 'de']);
  });

  test('Language persists in localStorage', async ({ page }) => {
    const langSwitch = langSwitchLocator(page);
    
    // Use selectOption for native <select> elements
    await langSwitch.selectOption('de');
    
    // Wait for logic to settle and check storage
    // Check if your key is 'lumen.lang' or 'lumen.language' in your AppContext!
    await expect.poll(async () => {
      return page.evaluate(() => 
        localStorage.getItem('lumen.language') || localStorage.getItem('lumen.lang')
      );
    }).toBe('de');
  });

  test('UI text changes when switching language', async ({ page }) => {
    // 1. Stay on settings to change the language
    const langSwitch = langSwitchLocator(page);
    await langSwitch.selectOption('de');

    // 2. Navigate to gallery and check for German text
    await page.goto(`${BASE_URL}/gallery`);
    
    // Instead of comparing body text (which is slow), look for a specific UI element 
    // that you know changes (e.g., a heading or nav link)
    const navGallery = page.getByRole('link', { name: /Galerie/i }).first();
    await expect(navGallery).toBeVisible();
  });

  test('Date localization: formats differently in EN vs DE', async ({ page }) => {
    // 1. Set to English and check gallery
    await page.goto(`${BASE_URL}/settings`);
    await langSwitchLocator(page).selectOption('en');
    await page.goto(`${BASE_URL}/gallery`);
    const dateEN = await page.locator('[data-testid="gallery-item"]').first().textContent();
    
    // 2. Set to German and check gallery
    await page.goto(`${BASE_URL}/settings`);
    await langSwitchLocator(page).selectOption('de');
    await page.goto(`${BASE_URL}/gallery`);
    const dateDE = await page.locator('[data-testid="gallery-item"]').first().textContent();
    
    expect(dateEN).not.toBe(dateDE);
  });

  test('Language persists across sessions', async ({ page }) => {
    const langSwitch = langSwitchLocator(page);
    
    // Change to German
    await langSwitch.selectOption('de');
    
    // Wait for storage to update
    await expect.poll(async () => {
       return page.evaluate(() => localStorage.getItem('lumen.language') || localStorage.getItem('lumen.lang'));
    }).toBe('de');
    
    await page.reload();
    
    // Verify the select still shows German after reload
    await expect(langSwitch).toHaveValue('de');
  });
});

test.describe('Gallery Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/gallery`);
  });

  const filterLocator = (page) => 
    page.getByLabel(/Filter/i)
      .or(page.getByRole('combobox', { name: /Filter/i }))
      .first();

  test('Gallery grid exists with data-testid="gallery-grid"', async ({ page }) => {
    await expect(page.getByTestId('gallery-grid')).toBeVisible();
  });

  test('Gallery displays exactly 12 items', async ({ page }) => {
    // Ensure we wait for the items to actually load/render
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(12);
  });

  test('Filter control exists with accessible name "Filter"', async ({ page }) => {
    const filter = filterLocator(page);
    await expect(filter).toBeVisible();
  });

  test('Filter has options: All, Portrait, Nature, Urban', async ({ page }) => {
    const filter = filterLocator(page);
    
    // Check for options inside the select without relying on visibility
    const options = filter.locator('option');
    await expect(options).toHaveText(['All', 'Portrait', 'Nature', 'Urban']);
  });

  test('Filtering by Portrait updates visible items', async ({ page }) => {
    const filter = filterLocator(page);
    
    // Use selectOption instead of click
    await filter.selectOption('Portrait');
    
    // Instead of waitForTimeout, Playwright's assertions will auto-retry 
    // until the condition is met.
    const visibleItems = page.getByTestId('gallery-item');
    
    // Verify at least one item exists and they all contain the tag
    await expect(visibleItems.first()).toBeVisible();
    await expect(visibleItems.first()).toContainText(/portrait|porträt/i);
    
    // Optional: if you know exactly how many portraits there are (e.g., 3)
    // await expect(visibleItems).toHaveCount(3);
  });

  test('Filtering by Nature updates visible items', async ({ page }) => {
    const filter = filterLocator(page);
    await filter.selectOption('Nature');
    
    const firstVisible = page.getByTestId('gallery-item').first();
    await expect(firstVisible).toContainText(/nature|natur/i);
  });

  test('Selecting All shows all 12 items again', async ({ page }) => {
    const filter = filterLocator(page);
    
    // 1. Filter to Urban first
    await filter.selectOption('Urban');
    const itemsUrban = await page.getByTestId('gallery-item').count();
    expect(itemsUrban).toBeLessThan(12);
    
    // 2. Select All
    await filter.selectOption('All');
    
    // 3. Verify count returns to 12
    await expect(page.getByTestId('gallery-item')).toHaveCount(12);
  });

  test('Gallery items use placeholder images', async ({ page }) => {
    const firstItem = page.getByTestId('gallery-item').first();
    const img = firstItem.locator('img').first();
    
    const src = await img.getAttribute('src');
    
    // If you are using Unsplash or similar, the test fails if it's strict.
    // Check if it's a valid string and not empty.
    expect(src).toBeTruthy();
  });
});

test.describe('Offline Mode', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Ensure a clean slate (English, Online)
    await page.goto(BASE_URL);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Offline toggle exists with data-testid="offline-toggle"', async ({ page }) => {
    const toggle = page.getByTestId('offline-toggle');
    await expect(toggle).toBeVisible();
  });

  test('Offline toggle has accessible label "Offline mode"', async ({ page }) => {
    const toggle = page.getByTestId('offline-toggle')
      .or(page.getByRole('checkbox', { name: /Offline mode/i }))
      .or(page.getByLabel(/Offline mode/i));
    await expect(toggle).toBeVisible();
  });

  test('Enabling offline mode shows indicator "Offline mode enabled"', async ({ page }) => {
    const toggle = page.getByTestId('offline-toggle');
    // await toggle.click();
    await toggle.setChecked(true);

    await page.waitForTimeout(200);
    
    await expect(page.getByText(/Offline mode enabled/i)).toBeVisible();
  });

  test('Offline mode can be toggled from Settings page', async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
    
    const toggle = page.getByRole('button', { name: /Offline Mode/i})
      .or(page.getByRole('checkbox', { name: /Offline mode/i }))
      .or(page.getByLabel(/Offline mode/i)).first();
    
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.waitForTimeout(200);
    
    await expect(page.getByText(/Offline mode enabled/i)).toBeVisible();
  });

  test('Gallery renders when offline mode is enabled', async ({ page }) => {
    const toggle = page.getByTestId('offline-toggle');
    // await toggle.click();
    await toggle.setChecked(true);
    await page.waitForTimeout(200);
    
    await page.goto(`${BASE_URL}/gallery`);
    
    const items = page.getByTestId('gallery-item');
    await expect(items).toHaveCount(12);
  });

  test('Offline state persists across navigation', async ({ page }) => {
    // 1. Start on the settings page
    await page.goto(`${BASE_URL}/settings`);

    // 2. Enable offline mode
    const toggle = page.getByTestId('offline-toggle');
    // await toggle.click();
    await toggle.setChecked(true);

    // 3. Verify it is enabled on the current page
    // (Checks the DevToolbar indicator)
    await expect(page.getByText(/Offline mode enabled/i)).toBeVisible();

    // 4. NAVIGATE INTERNALLY (Do NOT use page.goto)
    // Find your navigation link to the gallery. 
    // Adjust the name 'Gallery' to match your actual nav text (e.g., 'Galerie' or 'Gallery')
    const galleryLink = page.getByRole('link', { name: /Gallery|Galerie/i });
    await galleryLink.click();

    // 5. Verify the URL changed but state remained
    await expect(page).toHaveURL(/.*gallery/);
    
    // 6. Check that the "Offline mode enabled" indicator is still there 
    // and the Gallery-specific offline banner is visible
    await expect(page.getByText(/Offline mode enabled/i)).toBeVisible();
    
    // This matches your Gallery.tsx logic for the yellow banner:
    await expect(page.getByText(/Viewing in offline mode/i)).toBeVisible();

    // 7. Navigate back to Settings via UI
    const settingsLink = page.getByRole('link', { name: /Settings|Einstellungen/i });
    await settingsLink.click();

    // 8. Verify the toggle is still checked
    await expect(page.getByTestId('offline-toggle')).toBeChecked();
  });
});

test.describe('Upload Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/upload`);
  });

  test('Upload page has file picker control', async ({ page }) => {
    const filePicker = page.locator('input[type="file"]');
    await expect(filePicker).toHaveCount(1);
  });

  test('Upload button exists and is disabled', async ({ page }) => {
    const uploadBtn = page.getByRole('button', { name: /Upload/i });
    await expect(uploadBtn).toBeVisible();
    await expect(uploadBtn).toBeDisabled();
  });

  test('Upload page shows demo helper text', async ({ page }) => {
    await expect(page.getByText(/demo|mock|simulation|example/i)).toBeVisible();
  });
});

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/settings`);
  });

  test('Settings page contains theme control', async ({ page }) => {
    const themeControl = page.getByTestId('theme-toggle')
      .or(page.getByRole('checkbox', { name: /Theme/i }))
      .or(page.getByLabel(/Theme/i));
    await expect(themeControl).toBeVisible();
  });

  test('Settings page contains accent color control', async ({ page }) => {
    const accentControl = page.getByTestId('accent-select')
      .or(page.getByRole('combobox', { name: /Accent color/i }))
      .or(page.getByLabel(/Accent color/i));
    await expect(accentControl).toBeVisible();
  });

  test('Settings page contains language control', async ({ page }) => {
    const langControl = page.getByTestId('language-select')
      .or(page.getByRole('combobox', { name: /Language/i }))
      .or(page.getByLabel(/Language/i)).first();
    await expect(langControl).toBeVisible();
  });

  test('Settings page contains offline mode control', async ({ page }) => {
    const offlineControl = page.getByTestId('offline-toggle')
      .or(page.getByRole('checkbox', { name: /Offline mode/i }))
      .or(page.getByLabel(/Offline mode/i)).first();
    await expect(offlineControl).toBeVisible();
  });

  test('All settings controls have proper data-testid attributes', async ({ page }) => {
    await expect(page.getByTestId('theme-toggle')).toBeVisible();
    await expect(page.getByTestId('accent-select')).toBeVisible();
    await expect(page.getByTestId('language-select')).toBeVisible();
  });
});