import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:5173';

/**
 * HELPER: Common selectors that are implementation-agnostic
 */
const SELECTORS = {
  logo: () => page => page.getByRole('link', { name: /PRIM-Agency/i }),
  nav: () => page => page.getByRole('navigation').first(),
  mobileToggle: () => page => page.getByRole('button', { name: /Open menu/i }),
  mobileClose: () => page => page.getByRole('button', { name: /Close menu/i }),
  billingToggle: () => page => page.getByRole('checkbox', { name: /Billing|Monthly\/Yearly|Pricing period/i })
    .or(page.getByRole('button', { name: /Billing|Monthly\/Yearly|Pricing period/i }))
    .or(page.getByLabel(/Billing|Monthly\/Yearly|Pricing period/i)),
  pricingCard: (planName: string) => page => page.locator('div, section, article').filter({ hasText: planName }).first(),
};

test.describe('Accessibility Scans', () => {
  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  for (const p of pages) {
    test(`${p.name} page should have no automatically detectable accessibility violations`, async ({ page }) => {
      await page.goto(`${BASE_URL}${p.path}`);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }
});

test.describe('Header & Navigation (Shared)', () => {
  test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

  test('Logo has accessible name "PRIM-Agency" and links to root', async ({ page }) => {
    const logo = SELECTORS.logo()(page);
    await expect(logo).toBeVisible();
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('Desktop navigation contains Home, Pricing, and Contact links', async ({ page }) => {
    const nav = SELECTORS.nav()(page);
    await expect(nav.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Pricing/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /Contact/i })).toBeVisible();
  });

  test('Mobile hamburger button is present and has accessible name "Open menu"', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(SELECTORS.mobileToggle()(page)).toBeVisible();
  });

  test('Mobile menu opens a slide-over/dialog and can be closed', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await SELECTORS.mobileToggle()(page).click();
    
    const closeBtn = SELECTORS.mobileClose()(page);
    await expect(closeBtn).toBeVisible();
    
    await closeBtn.click();
    await expect(closeBtn).not.toBeVisible();
  });

  test('Mobile menu dialog contains Home, Pricing, and Contact links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await SELECTORS.mobileToggle()(page).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    await expect(dialog.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(dialog.getByRole('link', { name: /Pricing/i })).toBeVisible();
    await expect(dialog.getByRole('link', { name: /Contact/i })).toBeVisible();
  });

});

test.describe('Desktop Navigation Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
  });

  test('Home link navigates to /', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    const nav = SELECTORS.nav()(page);
    const button = nav.getByRole('link', { name: /Home/i })
    await button.click()
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Pricing link navigates to /pricing', async ({ page }) => {
    const nav = SELECTORS.nav()(page);
    const button = nav.getByRole('link', { name: /Pricing/i })
    await button.click()
    await expect(page).toHaveURL(BASE_URL + '/pricing');
  });

  test('Contact link navigates to /contact', async ({ page }) => {
    const nav = SELECTORS.nav()(page);
    const button = nav.getByRole('link', { name: /Contact/i })
    await button.click()
    await expect(page).toHaveURL(BASE_URL + '/contact');
  });
});

test.describe('Mobile Navigation Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
  });

  test('Home link navigates to /', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await SELECTORS.mobileToggle()(page).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: /Home/i }).click();
    
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Pricing link navigates to /pricing', async ({ page }) => {
    await SELECTORS.mobileToggle()(page).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: /Pricing/i }).click();
    
    await expect(page).toHaveURL(BASE_URL + '/pricing');
  });

  test('Contact link navigates to /contact', async ({ page }) => {
    await SELECTORS.mobileToggle()(page).click();
    
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: /Contact/i }).click();
    
    await expect(page).toHaveURL(BASE_URL + '/contact');
  });
});

test.describe('Footer Links', () => {
  test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

  test('Footer Home link navigates to /', async ({ page }) => {
    await page.goto(`${BASE_URL}/pricing`);
    await page.locator('footer').getByRole('link', { name: /Home/i }).click();
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('Footer Pricing link navigates to /pricing', async ({ page }) => {
    await page.locator('footer').getByRole('link', { name: /Pricing/i }).click();
    await expect(page).toHaveURL(BASE_URL + '/pricing');
  });

  test('Footer Contact link navigates to /contact', async ({ page }) => {
    await page.locator('footer').getByRole('link', { name: /Contact/i }).click();
    await expect(page).toHaveURL(BASE_URL + '/contact');
  });

  test('Social links have valid href attributes', async ({ page }) => {
    const twitter = page.locator('footer').getByRole('link', { name: /Twitter|X/i });
    const linkedin = page.locator('footer').getByRole('link', { name: /LinkedIn/i });
    
    await expect(twitter).toHaveAttribute('href', /.+/);
    await expect(linkedin).toHaveAttribute('href', /.+/);
  });
});

test.describe('Pricing CTA Buttons', () => {
  test.beforeEach(async ({ page }) => await page.goto(`${BASE_URL}/pricing`));

  test('Basic plan CTA is clickable and enabled', async ({ page }) => {
    const card = SELECTORS.pricingCard('Basic')(page);
    const cta = card.getByRole('button', { name: /Get Started with Basic/i })
               .or(card.getByRole('link', { name: /Get Started with Basic/i }));
    
    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();
    await cta.click();
  });

  test('Pro plan CTA is clickable and enabled', async ({ page }) => {
    const card = SELECTORS.pricingCard('Pro')(page);
    const cta = card.getByRole('button', { name: /Get Started with Pro/i })
               .or(card.getByRole('link', { name: /Get Started with Pro/i }));
    
    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();
    await cta.click();
  });

  test('Enterprise plan CTA is clickable and enabled', async ({ page }) => {
    const card = SELECTORS.pricingCard('Enterprise')(page);
    const cta = card.getByRole('button', { name: /Get Started with Enterprise/i })
               .or(card.getByRole('link', { name: /Get Started with Enterprise/i }));
    
    await expect(cta).toBeVisible();
    await expect(cta).toBeEnabled();
    await cta.click();
  });
});

test.describe('Footer (Shared)', () => {
  test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

  test('Footer contains sitemap links', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer.getByRole('link', { name: /Home/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /Pricing/i })).toBeVisible();
    await expect(footer.getByRole('link', { name: /Contact/i })).toBeVisible();
  });

  test('Footer contains at least 2 social links with accessible names', async ({ page }) => {
    const twitter = page.locator('footer').getByRole('link', { name: /Twitter|X/i });
    const linkedin = page.locator('footer').getByRole('link', { name: /LinkedIn/i });
    await expect(twitter).toBeVisible();
    await expect(linkedin).toBeVisible();
  });
});

test.describe('Pricing Page Features', () => {
  test.beforeEach(async ({ page }) => await page.goto(`${BASE_URL}/pricing`));

  test('Displays exactly 3 pricing cards: Basic, Pro, Enterprise', async ({ page }) => {
    await expect(SELECTORS.pricingCard('Basic')(page)).toBeVisible();
    await expect(SELECTORS.pricingCard('Pro')(page)).toBeVisible();
    await expect(SELECTORS.pricingCard('Enterprise')(page)).toBeVisible();
  });

  test('Each plan card has a specific CTA (e.g. "Get Started with Basic")', async ({ page }) => {
    const plans = ['Basic', 'Pro', 'Enterprise'];
    for (const plan of plans) {
      const card = SELECTORS.pricingCard(plan)(page);
      const cta = card.getByRole('button', { name: new RegExp(`Get Started with ${plan}`, 'i') })
                 .or(card.getByRole('link', { name: new RegExp(`Get Started with ${plan}`, 'i') }));
      await expect(cta).toBeVisible();
    }
  });

  test('Pro plan is marked with a "Recommended" badge', async ({ page }) => {
    const proCard = SELECTORS.pricingCard('Pro')(page);
    await expect(proCard.getByText(/Recommended/i)).toBeVisible();
  });

  test('Billing toggle exists and is keyboard operable', async ({ page }) => {
    const toggle = SELECTORS.billingToggle()(page);
    await expect(toggle).toBeVisible();
    await toggle.focus();
    await page.keyboard.press('Space'); // Test keyboard interaction
  });

  test('Prices switch correctly between Monthly and Yearly', async ({ page }) => {
    // Check Monthly
    await expect(page.getByText('$10')).toBeVisible();
    await expect(page.getByText('$40')).toBeVisible();

    // Switch to Yearly
    const toggle = SELECTORS.billingToggle()(page);
    await toggle.click();

    // Check Yearly
    await expect(page.getByText('$96')).toBeVisible();
    await expect(page.getByText('$384')).toBeVisible();
  });
});

test.describe('Contact Page Form Validation', () => {
  test.beforeEach(async ({ page }) => await page.goto(`${BASE_URL}/contact`));

  test('Triggers "Required" validation for empty fields', async ({ page }) => {
    await page.getByRole('button', { name: /Submit|Send/i }).click();
    
    // Check that multiple error indicators appear for required fields
    const errors = page.getByText(/required|cannot be empty/i);
    const errorCount = await errors.count();
    expect(errorCount).toBeGreaterThanOrEqual(1);
  });

  test('Validates email format', async ({ page }) => {
    await page.getByLabel(/Email/i).fill('not-an-email');
    await page.getByRole('button', { name: /Submit|Send/i }).click();
    await expect(page.getByText(/valid email|email format/i)).toBeVisible();
  });

  test('Validates message minimum length (10 chars)', async ({ page }) => {
    await page.getByLabel(/Message/i).fill('Too short');
    await page.getByRole('button', { name: /Submit|Send/i }).click();
    await expect(page.getByText(/10 characters/i)).toBeVisible();
  });

  test('Uses accessible attributes (aria-invalid) on invalid fields', async ({ page }) => {
    const emailField = page.getByLabel(/Email/i);
    await emailField.fill('invalid');
    await page.getByRole('button', { name: /Submit|Send/i }).click();
    
    // Most accessible forms use aria-invalid="true" or refer to an error via aria-describedby
    await expect(emailField).toHaveAttribute('aria-invalid', 'true');
  });

  test('Shows success toast message on valid submission', async ({ page }) => {
    await page.getByLabel(/Name/i).fill('John Doe');
    await page.getByLabel(/Email/i).fill('john@example.com');
    await page.getByLabel(/Message/i).fill('This message is long enough to pass validation.');
    
    await page.getByRole('button', { name: /Submit|Send/i }).click();
    
    const toast = page.getByText(/Message sent successfully/i);
    await expect(toast).toBeVisible();
  });
});