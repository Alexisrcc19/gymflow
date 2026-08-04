import { render, screen } from '@testing-library/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

describe('Card', () => {
  it('renders a composed card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Total members</CardTitle>
          <CardDescription>Current gym population</CardDescription>
        </CardHeader>
        <CardContent>1,405</CardContent>
        <CardFooter>Updated today</CardFooter>
      </Card>,
    );

    expect(
      screen.getByRole('heading', { name: 'Total members' }),
    ).not.toBeNull();
    expect(screen.getByText('1,405')).not.toBeNull();
    expect(screen.getByText('Updated today')).not.toBeNull();
  });

  it('applies the selected elevation', () => {
    render(<Card elevation="raised">Raised card</Card>);

    expect(screen.getByText('Raised card').className).toContain(
      'shadow-raised',
    );
  });

  it('merges consumer classes', () => {
    render(<Card className="rounded-md">Custom card</Card>);

    const card = screen.getByText('Custom card');
    expect(card.className).toContain('rounded-md');
    expect(card.className).not.toContain('rounded-lg');
  });
});
