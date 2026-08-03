import { render } from '@testing-library/react';

import { Skeleton } from './skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technologies by default', () => {
    const { container } = render(<Skeleton />);
    expect(container.firstElementChild?.getAttribute('aria-hidden')).toBe(
      'true',
    );
  });

  it('applies the selected shape', () => {
    const { container } = render(<Skeleton shape="circle" />);
    expect(container.firstElementChild?.className).toContain('rounded-full');
  });

  it('merges consumer dimensions', () => {
    const { container } = render(<Skeleton className="h-10 w-40" />);
    expect(container.firstElementChild?.className).toContain('h-10');
    expect(container.firstElementChild?.className).toContain('w-40');
  });
});
