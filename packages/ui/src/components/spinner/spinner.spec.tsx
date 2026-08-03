import { render, screen } from '@testing-library/react';

import { Spinner } from './spinner';

describe('Spinner', () => {
  it('exposes an accessible loading status', () => {
    render(<Spinner label="Loading memberships" />);
    expect(
      screen.getByRole('status', { name: 'Loading memberships' }),
    ).not.toBeNull();
  });

  it('applies selected size and color', () => {
    render(<Spinner label="Loading" size="lg" variant="muted" />);
    const graphic = screen.getByRole('status').firstElementChild;
    expect(graphic?.className).toContain('size-8');
    expect(graphic?.className).toContain('text-muted-foreground');
  });

  it('merges consumer classes on the visual indicator', () => {
    render(<Spinner className="size-10" />);
    const graphic = screen.getByRole('status').firstElementChild;
    expect(graphic?.className).toContain('size-10');
    expect(graphic?.className).not.toContain('size-5');
  });
});
