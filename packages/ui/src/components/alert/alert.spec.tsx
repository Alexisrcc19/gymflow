import { render, screen } from '@testing-library/react';

import { Alert, AlertDescription, AlertTitle } from './alert';

describe('Alert', () => {
  it('renders a composed title and description', () => {
    render(
      <Alert>
        <AlertTitle>Schedule updated</AlertTitle>
        <AlertDescription>The class now starts at 08:30.</AlertDescription>
      </Alert>,
    );

    expect(
      screen.getByRole('heading', { name: 'Schedule updated' }),
    ).not.toBeNull();
    expect(screen.getByText('The class now starts at 08:30.')).not.toBeNull();
  });

  it('applies the selected semantic variant', () => {
    render(<Alert variant="warning">Membership expires soon.</Alert>);

    expect(
      screen.getByText('Membership expires soon.').parentElement?.className,
    ).toContain('border-warning');
  });

  it('renders an optional decorative icon', () => {
    const { container } = render(
      <Alert icon={<svg data-testid="alert-icon" />}>
        Scheduled maintenance
      </Alert>,
    );

    expect(screen.getByTestId('alert-icon')).not.toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it('allows consumers to opt into an urgent alert role', () => {
    render(<Alert role="alert">Payment failed.</Alert>);

    expect(screen.getByRole('alert').textContent).toContain('Payment failed.');
  });

  it('merges consumer classes', () => {
    render(<Alert className="p-6">Custom spacing</Alert>);

    const alert = screen.getByText('Custom spacing').parentElement;

    expect(alert?.className).toContain('p-6');
    expect(alert?.className).not.toContain('p-4');
  });
});
