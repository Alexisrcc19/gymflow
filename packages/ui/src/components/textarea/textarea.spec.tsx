import { render, screen } from '@testing-library/react';

import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders a native textarea with a default row count', () => {
    render(<Textarea aria-label="Notes" />);

    const textarea = screen.getByRole('textbox', { name: 'Notes' });

    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea.getAttribute('rows')).toBe('4');
  });

  it('supports native disabled and invalid states', () => {
    render(<Textarea aria-label="Notes" aria-invalid disabled />);

    const textarea = screen.getByRole('textbox', { name: 'Notes' });

    expect((textarea as HTMLTextAreaElement).disabled).toBe(true);
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('merges consumer classes', () => {
    render(<Textarea aria-label="Notes" className="min-h-40" />);

    expect(screen.getByRole('textbox', { name: 'Notes' }).className).toContain(
      'min-h-40',
    );
  });
});
