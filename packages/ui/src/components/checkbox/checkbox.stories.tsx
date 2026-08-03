import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label';
import { Checkbox } from './checkbox';

const meta = {
  title: 'Forms/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Checkbox** component lets a user independently enable or disable a binary option.

#### Usage guidelines

- Use for independent choices such as active status or notification preferences.
- Use a group of checkboxes when multiple selections are allowed.
- Do not use a checkbox when exactly one option must be selected.

#### Accessibility

- Renders a native checkbox with full keyboard and form behavior.
- Always provide an accessible label and make the complete visible label clickable.
- Disabled state must only be used when the option is genuinely unavailable.
`,
      },
    },
  },
  argTypes: {
    defaultChecked: {
      description: 'Initial checked state for an uncontrolled checkbox.',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    disabled: {
      description: 'Prevents focus and state changes.',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    required: {
      description: 'Requires the option to be checked for native validation.',
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: 'false' } },
    },
    onChange: {
      description: 'Handler called when the checked state changes.',
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
  args: { defaultChecked: false, disabled: false, required: false },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

const option = (args: Story['args'], label: string) => (
  <div className="flex items-start gap-2">
    <Checkbox {...args} id="membership-status" />
    <div className="grid gap-0.5">
      <Label htmlFor="membership-status">{label}</Label>
      <p className="text-xs text-muted-foreground">
        The member can access active services and classes.
      </p>
    </div>
  </div>
);

export const Default: Story = {
  render: (args) => option(args, 'Active membership'),
  parameters: {
    docs: { description: { story: 'Unchecked independent option.' } },
  },
};

export const Checked: Story = {
  args: { defaultChecked: true },
  render: (args) => option(args, 'Active membership'),
  parameters: {
    docs: { description: { story: 'Initially selected option.' } },
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => option(args, 'Managed automatically'),
  parameters: {
    docs: { description: { story: 'Option unavailable for interaction.' } },
  },
};
