import { render, screen } from '@testing-library/react';

import { Badge } from './badge';

describe('Badge', () => {
  it('renders its visible status text', () => {
    render(<Badge>Active</Badge>);

    expect(screen.getByText('Active').tagName).toBe('SPAN');
  });

  it('applies semantic variant and size styles', () => {
    render(
      <Badge size="md" variant="warning">
        Expiring
      </Badge>,
    );

    const badge = screen.getByText('Expiring');

    expect(badge.className).toContain('text-warning');
    expect(badge.className).toContain('text-xs');
  });

  it('renders an optional decorative status dot', () => {
    const { container } = render(<Badge showDot>Paused</Badge>);

    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('merges consumer classes without preserving conflicting utilities', () => {
    render(<Badge className="px-3">Custom</Badge>);

    const badge = screen.getByText('Custom');

    expect(badge.className).toContain('px-3');
    expect(badge.className).not.toContain('px-1.5');
  });
});
