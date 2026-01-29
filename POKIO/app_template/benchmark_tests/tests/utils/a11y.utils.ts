import { Page, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function checkA11y(page: Page, options?: { tags?: string[] }) {
  const builder = new AxeBuilder({ page });
  if (options?.tags?.length) builder.withTags(options.tags);
  const results = await builder.analyze();

  if (results.violations.length) {
    // Pretty-print violations for fast debugging
    // eslint-disable-next-line no-console
    console.log(
      '\nAXE VIOLATIONS:\n',
      results.violations.map(v => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.helpUrl,
        nodes: v.nodes.slice(0, 3).map(n => n.target?.[0]),
      }))
    );
  }
  return expect(results.violations.length, 'No AXE violations expected').toBe(0);
}
