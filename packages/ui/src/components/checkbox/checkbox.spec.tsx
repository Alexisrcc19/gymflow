import { render, screen } from '@testing-library/react';

import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders a native checkbox with its accessible name', () => {
    render(<Checkbox aria-label="Active membership" />);

    const checkbox = screen.getByRole('checkbox', {
      name: 'Active membership',
    });

    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox.getAttribute('type')).toBe('checkbox');
  });

  it('supports native checked and disabled states', () => {
    render(<Checkbox aria-label="Active membership" defaultChecked disabled />);

    const checkbox = screen.getByRole('checkbox', {
      name: 'Active membership',
    }) as HTMLInputElement;

    expect(checkbox.checked).toBe(true);
    expect(checkbox.disabled).toBe(true);
  });

  it('merges consumer classes', () => {
    render(<Checkbox aria-label="Selected" className="size-5" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Selected' });

    expect(checkbox.className).toContain('size-5');
    expect(checkbox.className).not.toContain('size-4');
  });
});
