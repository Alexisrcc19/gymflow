import { render, screen } from '@testing-library/react';

import { Button } from './button';

describe('Button', () => {
  it('renders a native button with its accessible name', () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole('button', { name: 'Save changes' });

    expect(button.tagName).toBe('BUTTON');
    expect((button as HTMLButtonElement).type).toBe('button');
  });

  it('disables the button and exposes its busy state while loading', () => {
    render(<Button loading>Save changes</Button>);

    const button = screen.getByRole('button', { name: 'Save changes' });

    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
  });

  it('applies the selected visual variants', () => {
    render(
      <Button size="lg" variant="destructive">
        Delete member
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Delete member' });

    expect(button.className).toContain('bg-danger');
    expect(button.className).toContain('h-10');
  });

  it('merges consumer classes without preserving conflicting utilities', () => {
    render(<Button className="px-8">Continue</Button>);

    const button = screen.getByRole('button', { name: 'Continue' });

    expect(button.className).toContain('px-8');
    expect(button.className).not.toContain('px-4');
  });
});
