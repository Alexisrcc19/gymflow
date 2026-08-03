import { render, screen } from '@testing-library/react';

import { Input } from './input';

describe('Input', () => {
  it('renders a native input with the supplied type and accessible name', () => {
    render(<Input aria-label="Email" type="email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect(input.tagName).toBe('INPUT');
    expect(input.getAttribute('type')).toBe('email');
  });

  it('supports native disabled and invalid states', () => {
    render(<Input aria-label="Email" aria-invalid disabled />);

    const input = screen.getByRole('textbox', { name: 'Email' });

    expect((input as HTMLInputElement).disabled).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('applies the selected size', () => {
    render(<Input aria-label="Search" inputSize="lg" />);

    expect(screen.getByRole('textbox', { name: 'Search' }).className).toContain(
      'h-10',
    );
  });

  it('merges consumer classes without preserving conflicting utilities', () => {
    render(<Input aria-label="Member ID" className="px-5" />);

    const input = screen.getByRole('textbox', { name: 'Member ID' });

    expect(input.className).toContain('px-5');
    expect(input.className).not.toContain('px-3');
  });
});
