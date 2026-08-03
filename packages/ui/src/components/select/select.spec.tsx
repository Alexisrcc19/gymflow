import { render, screen } from '@testing-library/react';

import { Select } from './select';

describe('Select', () => {
  it('renders a native select with its options', () => {
    render(
      <Select aria-label="Membership plan">
        <option value="monthly">Monthly</option>
        <option value="annual">Annual</option>
      </Select>,
    );

    const select = screen.getByRole('combobox', { name: 'Membership plan' });

    expect(select.tagName).toBe('SELECT');
    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  it('supports native default value and disabled states', () => {
    render(
      <Select aria-label="Membership plan" defaultValue="annual" disabled>
        <option value="monthly">Monthly</option>
        <option value="annual">Annual</option>
      </Select>,
    );

    const select = screen.getByRole('combobox', {
      name: 'Membership plan',
    }) as HTMLSelectElement;

    expect(select.value).toBe('annual');
    expect(select.disabled).toBe(true);
  });

  it('merges consumer classes', () => {
    render(<Select aria-label="Plan" className="h-10" />);

    const select = screen.getByRole('combobox', { name: 'Plan' });

    expect(select.className).toContain('h-10');
    expect(select.className).not.toContain('h-9');
  });
});
