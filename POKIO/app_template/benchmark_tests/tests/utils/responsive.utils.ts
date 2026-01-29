import { Page, Locator, expect } from '@playwright/test';

export const BP = {
  sm: { width: 360, height: 700 },
  md: { width: 768, height: 900 },
  lg: { width: 1024, height: 900 },
  xl: { width: 1280, height: 900 },
};

export async function setBP(page: Page, key: keyof typeof BP) {
  await page.setViewportSize(BP[key]);
}

export async function yTop(el: Locator) {
  const box = await el.boundingBox();
  expect(box).not.toBeNull();
  return box!.y;
}

export async function xLeft(el: Locator) {
  const box = await el.boundingBox();
  expect(box).not.toBeNull();
  return box!.x;
}

/** Count visual columns by grouping cards sharing the same first-row Y (with a small tolerance). */
export async function countColumns(container: Locator, itemSelector: string) {
  const items = container.locator(itemSelector);
  const n = await items.count();
  if (n === 0) return 0;
  const ys: number[] = [];
  for (let i = 0; i < n; i++) {
    const box = await items.nth(i).boundingBox();
    if (box) ys.push(box.y);
  }
  const minY = Math.min(...ys);
  // tolerance for sub-pixel differences
  const firstRow = ys.filter(y => Math.abs(y - minY) < 2);
  return firstRow.length;
}

/** Check CSS position: sticky and that it stays pinned after scroll. */
export async function expectSticky(page: Page, el: Locator) {
  const pos = await el.evaluate((node) => getComputedStyle(node as HTMLElement).position);
  expect(pos).toMatch(/sticky/i);
  const y1 = await yTop(el);
  await page.mouse.wheel(0, 600);
  const y2 = await yTop(el);
  expect(Math.abs(y1 - y2)).toBeLessThan(4);
}
