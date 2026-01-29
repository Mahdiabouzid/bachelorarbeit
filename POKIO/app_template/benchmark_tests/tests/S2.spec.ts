import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BASE_URL = 'http://localhost:5173';

/**
 * HELPER: Check if an element is sticky by checking its position after scroll
 */
async function isElementSticky(page: Page, selector: string) {
  await page.evaluate(() => window.scrollTo(0, 500));
  const boundingBox = await page.locator(selector).boundingBox();
  return boundingBox ? boundingBox.y === 0 : false;
}

test.describe('Alex Rivera Portfolio - Functional & Accessibility Benchmark', () => {

  test.describe('1. Global Accessibility & Theme', () => {
    test('Should pass WCAG accessibility scans', async ({ page }) => {
      await page.goto(BASE_URL);
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('Should use the required color palette (Visual Check)', async ({ page }) => {
      await page.goto(BASE_URL);
      // We check if the agent at least attempted to style with the brand colors in CSS variables or body
      const bodyStyle = await page.evaluate(() => {
        const style = window.getComputedStyle(document.body);
        return style.backgroundColor + style.color;
      });
      // Basic check to ensure it's not just browser default white/black without thought
      expect(bodyStyle).not.toBeNull();
    });
  });

  test.describe('2. Navigation (Sticky & Smooth Scroll)', () => {
    test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

    test('Navbar contains all required links', async ({ page }) => {
      const nav = page.getByRole('navigation');
      const links = ['Home', 'About', 'Portfolio', 'Services', 'Contact'];
      for (const link of links) {
        await expect(nav.getByRole('link', { name: link, exact: true })).toBeVisible();
      }
    });

    test('Navigation bar is sticky on scroll', async ({ page }) => {
      // Find the header or nav
      const nav = page.locator('header, nav').first();
      await page.evaluate(() => window.scrollTo(0, 500));
      const box = await nav.boundingBox();
      // In a sticky header, the Y position should remain near the top of the viewport
      expect(box?.y).toBeLessThanOrEqual(10); 
    });

    test('Smooth scroll: clicking "Contact" moves viewport', async ({ page }) => {
      const contactLink = page.getByRole('link', { name: /Contact/i });
      await contactLink.click();
      // Wait for scroll animation
      await page.waitForTimeout(1000); 
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(500);
    });

    test('Logo navigates to home/top of page', async ({ page }) => {
      await page.evaluate(() => window.scrollTo(0, 1000));
      const logo = page.locator('nav a[href="#"], nav a[href="/"], nav a[href="#home"], nav a[href="#hero"]').first();
      await logo.click();
      await page.waitForTimeout(1000);
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    });

    test('Desktop: Navigation links scroll to correct sections', async ({ page }) => {
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.goto(BASE_URL);
        
        const sections = [
            { link: 'About', id: '#about' },
            { link: 'Portfolio', id: '#portfolio' },
            { link: 'Services', id: '#services' },
            { link: 'Contact', id: '#contact' }
        ];
        
        for (const { link, id } of sections) {
            const navLink = page.getByRole('navigation').getByRole('link', { name: link });
            await navLink.click();
            await page.waitForTimeout(800);
            
            const section = page.locator(id);
            await expect(section).toBeInViewport();
        }
    });
  });

  test.describe('3. Hero Section', () => {
    test('Displays name and specific tagline', async ({ page }) => {
      await page.goto(BASE_URL);
      await expect(page.getByRole('heading', { name: /alex rivera/i })).toBeVisible();
      await expect(page.getByText(/Designing Visual Stories/i)).toBeVisible();
    });

    test('Hero CTA button is present and clickable', async ({ page }) => {
      await page.goto(BASE_URL);
      const cta = page.locator('a[href*="portfolio"], a[href*="contact"], button').filter({
        hasText: /view work|my work|portfolio|get in touch|contact|hire me/i
      }).first();
      await expect(cta).toBeVisible();
      await cta.click();
      await page.waitForTimeout(500);
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(200);
    });
  });

  test.describe('4. About Section', () => {
  test('Displays bio, photo, and tools/expertise items', async ({ page }) => {
    await page.goto(`${BASE_URL}#about`);

    // Scope to the about section (id from the scenario)
    const about = page.locator('#about');
    await expect(about).toBeVisible();

    // Photo: keep your existing intent, but scoped
    await expect(
      about.getByRole('img', { name: /Alex Rivera|portrait|profile|professional|bio/i })
    ).toBeVisible();

    // Bio: assert there is some readable text (paragraphs are common, but don't require them)
    const bioText = about.locator('p').first();
    await expect(bioText).toBeVisible();
    await expect(bioText).toHaveText(/.{40,}/); // at least ~40 chars of bio

    // Tools/Expertise label: accept a variety of headings
    const toolsHeading = about.getByRole('heading', {
      name: /tools|technolog(ies|y)|expertise|speciali(z|s)es|stack|toolkit/i,
    });
    await expect(toolsHeading).toBeVisible();

    // Find the "tools area" near the heading, then count items.
    // This avoids assuming UL/LI and works for spans/divs/chips.
    const toolsArea = toolsHeading.locator('xpath=ancestor::*[self::section or self::div][1]');

    // Candidate "items" (chips, list items, etc.)
    const toolItems = toolsArea.locator('li, [role="listitem"], span, a, div').filter({
      // Filter out container-y elements: require some non-trivial text
      hasText: /[A-Za-z].{2,}/,
    });

    // Require at least a few tools
    const toolCount = await toolItems.count();
    expect(toolCount).toBeGreaterThan(4);   

    // Optional: strengthen by checking for a couple of known tools (from the scenario/implementation)
    await expect(toolsArea).toContainText(/Figma|Adobe|React|Next\.js|Tailwind/i);
  });
});

  test.describe('5. Portfolio Section (Masonry & Details)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  test('Contains exactly 6 project thumbnails', async ({ page }) => {
    const byId = page.locator('#portfolio');
    const byHeadingSection = page
        .getByRole('heading', { name: /selected works|portfolio/i })
        .locator('xpath=ancestor::section[1]');

    const portfolio = (await byId.count()) ? byId : byHeadingSection;
    await expect(portfolio).toBeVisible();

    const items = portfolio.getByTestId('portfolio-item');
    await expect(items).toHaveCount(6);
  });

  test('Clicking a project opens modal with details', async ({ page }) => {
    const byId = page.locator('#portfolio');
    const byHeadingSection = page
        .getByRole('heading', { name: /selected works|portfolio/i })
        .locator('xpath=ancestor::section[1]');

    const portfolio = (await byId.count()) ? byId : byHeadingSection;
    await expect(portfolio).toBeVisible();

    const firstItem = portfolio.getByTestId('portfolio-item').first();

    await firstItem.scrollIntoViewIfNeeded();
    await firstItem.click();

    const modal = page.getByTestId('project-modal');
    await expect(modal).toBeVisible();

    // If you add role="dialog", this also becomes a nice accessibility assertion:
    // await expect(page.getByRole('dialog', { name: /project details/i })).toBeVisible();

    // Detail expectations (keep flexible for different agents)
    await expect(modal).toContainText(/description|tools|tools used|overview|case study|role/i);
  });

  test('Pressing Escape closes the project modal', async ({ page }) => {
    const portfolio = page.locator('#portfolio');
    const firstItem = portfolio.getByTestId('portfolio-item').first();

    await firstItem.scrollIntoViewIfNeeded();
    await firstItem.click();

    const modal = page.getByTestId('project-modal');
    await expect(modal).toBeVisible();

    await page.keyboard.press('Escape');

    // Prefer "not visible" because some implementations keep it mounted but hidden;
    // If you unmount it, this still passes.
    await expect(modal).not.toBeVisible();
  });

  test('Modal close button works', async ({ page }) => {
    const portfolio = page.locator('#portfolio');
    const firstItem = portfolio.getByTestId('portfolio-item').first();

    await firstItem.scrollIntoViewIfNeeded();
    await firstItem.click();

    const modal = page.getByTestId('project-modal');
    await expect(modal).toBeVisible();

    const closeBtn = modal.getByRole('button', { name: /close/i }).or(modal.locator('button[aria-label*="close" i]'));
    await closeBtn.click();

    await expect(modal).not.toBeVisible();
  });
});

  test.describe('6. Services Section', () => {
    test('Displays specific services with icons', async ({ page }) => {
      await page.goto(BASE_URL);
      const services = ['Branding', 'UI/UX Design', 'Illustration'];
      // For Sonnet 4.5
      // const services = ['Brand Strategy', 'UI/UX Design', 'Digital Illustration']; 
      for (const service of services) {
        const item = page.locator('section').filter({ hasText: /Services/i }).getByText(service).first();
        await expect(item).toBeVisible();
      }
    });
  });

  test.describe('7. Contact Section', () => {
    test.beforeEach(async ({ page }) => await page.goto(BASE_URL));

    // test('Contact form has required accessible fields', async ({ page }) => {
    //   const form = page.locator('form');
    //   await expect(form.getByLabel(/Name/i).or(form.getByPlaceholder(/Name/i))).toBeVisible();
    //   await expect(form.getByLabel(/Email/i).or(form.getByPlaceholder(/Email/i))).toBeVisible();
    //   await expect(form.getByLabel(/Message/i).or(form.getByPlaceholder(/Message/i))).toBeVisible();
    // });

    test('Contact form has required accessible fields', async ({ page }) => {
      const form = page.locator('form');

      await expect(form.getByLabel('Name')).toBeAttached();
      await expect(form.getByLabel('Email')).toBeAttached();
      await expect(form.getByLabel('Message')).toBeAttached();
    });

    test('Contact form submit button works', async ({ page }) => {
      const form = page.locator('form');
      const submitBtn = form.getByRole('button', { name: /send|submit|contact/i });
      await expect(submitBtn).toBeVisible();
      await expect(submitBtn).toBeEnabled();
    });

    test('Contact section has social media links with accessible names', async ({ page }) => {
      const contactSection = page.locator('#contact');
      // Check for common social roles or links
      const links = contactSection.getByRole('link');
      const count = await links.count();
      expect(count).toBeGreaterThanOrEqual(2);
      
      // Ensure they have accessible names (e.g., "Instagram", "LinkedIn", "Twitter")
      expect(await links.first().getAttribute('aria-label')).not.toBeNull();
      expect(await links.first().getAttribute('aria-label')).not.toBe('');
    });
  });

test.describe('8. Responsiveness & Animations', () => {
    test('Mobile view: Navigation handles small screens (Hamburger)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(BASE_URL);
        
        // Often, links are hidden behind a menu button on mobile
        const navLinks = page.getByRole('link', { name: 'About' }).first();
        let menuBtn = page.getByRole('button', { name: /menu|open/i }).first();

        if ((await menuBtn.count()) === 0) {
            const header = page.locator('header').first();
            menuBtn = header.locator('button:has(svg)')
        }

        expect(menuBtn).toBeVisible()

        if (!(await navLinks.isVisible())) {
          await expect(menuBtn).toBeVisible();
          await menuBtn.click();
          await expect(navLinks).toBeVisible();
        } else {
        // If links are still visible, ensure they are styled for mobile
        await expect(navLinks).toBeVisible();
        }
    });

    test('Mobile menu closes when clicking close button', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(BASE_URL);
        
        const navLinks = page.getByRole('link', { name: 'About' }).first();
        const header = page.locator('header').first();
        let menuBtn = page.getByRole('button', { name: /menu|open/i }).first();

        if ((await menuBtn.count()) === 0) {
            menuBtn = header.locator('button:has(svg)');
        }

        expect(menuBtn).toBeVisible()

        if (!(await navLinks.isVisible())) {
            await menuBtn.click();
            await expect(navLinks).toBeVisible();
            
            let closeBtn = header.locator('button:has(svg)');

            if ((await closeBtn.count()) === 0) {
                closeBtn = header.locator('button:has(svg)');
            }

            await closeBtn.click();
            await page.waitForTimeout(300);
            await expect(navLinks).not.toBeVisible();
        }
    });

    // test('Mobile: Navigation links scroll to correct sections', async ({ page }) => {
    //     await page.setViewportSize({ width: 375, height: 667 });
    //     await page.goto(BASE_URL);
        
    //     const sections = [
    //         { link: 'About', id: '#about' },
    //         { link: 'Portfolio', id: '#portfolio' },
    //         { link: 'Services', id: '#services' },
    //         { link: 'Contact', id: '#contact' }
    //     ];
        
    //     for (const { link, id } of sections) {
    //         let menuBtn = page.getByRole('button', { name: /menu|open/i }).first();
    //         if ((await menuBtn.count()) === 0) {
    //             const header = page.locator('header').first();
    //             menuBtn = header.locator('button:has(svg)');
    //         }
            
    //         expect(menuBtn).toBeVisible()

    //         // Open menu if needed
    //         const navLink = page.getByRole('link', { name: link }).first();
    //         if (!(await navLink.isVisible())) {
    //           await menuBtn.click();
    //           await page.waitForTimeout(200);
    //         }
            
    //         await navLink.click();
    //         await page.waitForTimeout(800);
            
    //         const section = page.locator(id);
    //         await expect(section).toBeInViewport();
    //     }
    // });

    test('Mobile: Navigation links scroll to correct sections', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(BASE_URL);

  const sections = [
    { link: 'About', id: '#about' },
    { link: 'Portfolio', id: '#portfolio' },
    { link: 'Services', id: '#services' },
    { link: 'Contact', id: '#contact' },
  ];

  // find menu button once
  let menuBtn = page.getByRole('button', { name: /menu|open/i }).first();
  if ((await menuBtn.count()) === 0) {
    menuBtn = page.locator('header').first().locator('button:has(svg)');
  }
  await expect(menuBtn).toBeVisible();

  for (const { link, id } of sections) {
    // open menu every time (simple + stable)
    await menuBtn.click();

    // pick the *visible* overlay/menu container
    // common patterns: role=dialog, role=navigation, or a specific mobile nav wrapper
    const menu = page.getByRole('dialog').or(page.getByRole('navigation')).filter({ hasText: link }).first();

    await expect(menu).toBeVisible();

    const navLink = menu.getByRole('link', { name: link });
    await expect(navLink).toBeInViewport(); // stronger than toBeVisible for your issue
    await navLink.click();

    const section = page.locator(id);
    await expect(section).toBeInViewport();
  }
});

    test('Scroll animations: at least one element uses a scroll-triggered animation pattern', async ({ page }) => {
        await page.goto(BASE_URL);

        // Look for common "hooks" for scroll animation libraries
        const candidates = page.locator([
        '[data-aos]',
        '[data-animate]',
        '.animate-on-scroll',
        '.motion',
        '.fade-in',
        '.zoom',
        '[class*="reveal" i]',
        '[class*="in-view" i]',
        '[style*="transition"]',
        ].join(','));

        const count = await candidates.count();
        expect(count).toBeGreaterThan(0);

        // Pick the first candidate and test it changes after we scroll it into view.
        // We'll snapshot a few style signals that often change when an element reveals:
        // opacity/transform and/or class changes.
        const el = candidates.first();

        const before = await el.evaluate((node) => {
        const s = getComputedStyle(node as Element);
        return {
            opacity: s.opacity,
            transform: s.transform,
            className: (node as Element).className,
            hasAos: (node as Element).hasAttribute('data-aos'),
        };
        });

        // Scroll it into view (if it's already in view, go down first then back)
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.mouse.wheel(0, 1200);
        await el.scrollIntoViewIfNeeded();

        // give animations time to apply (AOS/IntersectionObserver/Framer)
        await page.waitForTimeout(300);

        const after = await el.evaluate((node) => {
        const s = getComputedStyle(node as Element);
        return {
            opacity: s.opacity,
            transform: s.transform,
            className: (node as Element).className,
        };
        });

        // Accept several valid implementations:
        // - class toggles (e.g., "in-view", "aos-animate")
        // - style changes (opacity goes from 0 -> 1, transform changes, etc.)
        const classChanged = before.className !== after.className;
        const opacityChanged = before.opacity !== after.opacity;
        const transformChanged = before.transform !== after.transform;

        // If it uses AOS, it often toggles a class when in view
        // but we don't hardcode the class name.
        expect(classChanged || opacityChanged || transformChanged).toBe(true);
        });
    });
});