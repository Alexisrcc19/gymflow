import { render, screen } from '@testing-library/react';

import { Label } from './label';

describe('Label', () => {
  it('associates its text with a form control', () => {
    render(
      <div>
        <Label htmlFor="member-name">Member name</Label>
        <input id="member-name" />
      </div>,
    );

    expect(screen.getByLabelText('Member name').getAttribute('id')).toBe(
      'member-name',
    );
  });

  it('merges consumer classes', () => {
    render(<Label className="text-danger">Email</Label>);

    expect(screen.getByText('Email').className).toContain('text-danger');
  });
});
