import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label';
import { Select } from './select';

const meta = {
  title: 'Forms/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Select** component lets a user choose one value from a short, predefined list using native browser behavior.

#### Usage guidelines

- Use when the available choices are known and mutually exclusive.
- Keep option labels concise and order them predictably.
- Use a visible \`Label\`; a placeholder option must not replace it.

#### Accessibility

- Renders a native \`select\` with keyboard, touch, and form support.
- Supports native disabled and required states.
- Use \`aria-invalid\` and \`aria-describedby\` when validation fails.
`,
      },
    },
  },
  argTypes: {
    disabled: {
      description: 'Prevents focus and selection changes.',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    required: {
      description: 'Requires a valid option for native validation.',
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: 'false' } },
    },
    'aria-invalid': {
      description: 'Communicates that the current selection failed validation.',
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: 'false' } },
    },
    onChange: {
      description: 'Handler called when the selected value changes.',
      action: 'changed',
      control: false,
      table: { category: 'Events' },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: { disabled: false, required: false },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = (
  <>
    <option value="">Select a plan</option>
    <option value="monthly">Monthly</option>
    <option value="annual">Annual</option>
    <option value="day-pass">Day pass</option>
  </>
);

const field = (args: Story['args']) => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="membership-plan">Membership plan</Label>
    <Select {...args} id="membership-plan">
      {options}
    </Select>
  </div>
);

export const Default: Story = {
  render: field,
  parameters: {
    docs: { description: { story: 'Default single-choice field.' } },
  },
};

export const Selected: Story = {
  args: { defaultValue: 'annual' },
  render: field,
  parameters: {
    docs: { description: { story: 'Field with an initial selection.' } },
  },
};

export const Invalid: Story = {
  args: { 'aria-describedby': 'plan-error', 'aria-invalid': true },
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="invalid-plan">Membership plan</Label>
      <Select {...args} id="invalid-plan">
        {options}
      </Select>
      <p className="text-xs text-danger" id="plan-error">
        Select a membership plan.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Invalid selection with an associated error message.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { defaultValue: 'monthly', disabled: true },
  render: field,
  parameters: {
    docs: { description: { story: 'Unavailable selection field.' } },
  },
};
