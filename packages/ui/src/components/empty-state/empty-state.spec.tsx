import { render, screen } from '@testing-library/react';

import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('renders a heading and supporting description', () => {
    render(
      <EmptyState
        description="Add a class to see it here."
        title="No classes scheduled"
      />,
    );
    expect(
      screen.getByRole('heading', { name: 'No classes scheduled' }),
    ).not.toBeNull();
    expect(screen.getByText('Add a class to see it here.')).not.toBeNull();
  });

  it('renders optional icon and action content', () => {
    const { container } = render(
      <EmptyState
        action={<button type="button">Add class</button>}
        icon={<svg />}
        title="No classes"
      />,
    );
    expect(screen.getByRole('button', { name: 'Add class' })).not.toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('merges consumer classes', () => {
    render(<EmptyState className="py-12" title="No results" />);
    const state = screen.getByRole('heading', {
      name: 'No results',
    }).parentElement;
    expect(state?.className).toContain('py-12');
    expect(state?.className).not.toContain('py-10');
  });
});
