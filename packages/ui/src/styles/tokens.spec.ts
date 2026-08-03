import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const tokens = readFileSync(
  resolve(process.cwd(), 'src/styles/tokens.css'),
  'utf8',
);

const requiredColorTokens = [
  'background',
  'surface',
  'foreground',
  'muted-foreground',
  'border',
  'primary',
  'primary-soft',
  'success',
  'warning',
  'danger',
  'info',
] as const;

describe('design tokens', () => {
  it.each(requiredColorTokens)(
    'defines the %s semantic color token',
    (token) => {
      expect(tokens).toContain(`--gymflow-color-${token}:`);
    },
  );

  it('defines the shared typography families', () => {
    expect(tokens).toContain('--gymflow-font-display:');
    expect(tokens).toContain('--gymflow-font-body:');
  });

  it('defines a visible focus ring', () => {
    expect(tokens).toContain('--gymflow-focus-ring-width:');
    expect(tokens).toContain('--gymflow-focus-ring-offset:');
  });
});
