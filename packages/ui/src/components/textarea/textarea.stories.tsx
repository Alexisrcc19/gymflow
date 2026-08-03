import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label';
import { Textarea } from './textarea';

const meta = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Textarea** component captures longer free-form content such as member notes, trainer feedback, and routine instructions.

#### Usage guidelines

- Pair it with a visible \`Label\` and explain expected content when necessary.
- Set an appropriate initial \`rows\` value while allowing vertical resizing.
- Use \`aria-invalid\` and \`aria-describedby\` to connect validation feedback.

#### Accessibility

- Renders a native \`textarea\` with keyboard and form support.
- Keeps a visible focus indicator and supports native disabled, read-only, and required states.
`,
      },
    },
  },
  argTypes: {
    placeholder: {
      description: 'Short example of the expected content.',
      control: 'text',
      table: { category: 'Content' },
    },
    rows: {
      description: 'Initial visible number of text rows.',
      control: { type: 'number', min: 2, max: 12 },
      table: { category: 'Appearance', defaultValue: { summary: '4' } },
    },
    disabled: {
      description: 'Prevents focus, editing, and form submission.',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    readOnly: {
      description: 'Allows focus and selection but prevents editing.',
      control: 'boolean',
      table: { category: 'State', defaultValue: { summary: 'false' } },
    },
    'aria-invalid': {
      description: 'Communicates that the current value failed validation.',
      control: 'boolean',
      table: { category: 'Validation', defaultValue: { summary: 'false' } },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: {
    disabled: false,
    placeholder: 'Add relevant notes for the trainer',
    readOnly: false,
    rows: 4,
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

const field = (args: Story['args']) => (
  <div className="grid w-96 gap-2">
    <Label htmlFor="member-notes">Member notes</Label>
    <Textarea {...args} id="member-notes" />
  </div>
);

export const Default: Story = {
  render: field,
  parameters: {
    docs: { description: { story: 'Default resizable multiline field.' } },
  },
};

export const Invalid: Story = {
  args: {
    'aria-describedby': 'notes-error',
    'aria-invalid': true,
    defaultValue: 'No',
  },
  render: (args) => (
    <div className="grid w-96 gap-2">
      <Label htmlFor="invalid-notes">Cancellation reason</Label>
      <Textarea {...args} id="invalid-notes" />
      <p className="text-xs text-danger" id="notes-error">
        Provide a little more detail.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Invalid field with an explicitly associated error message.',
      },
    },
  },
};

export const Disabled: Story = {
  args: { defaultValue: 'This note cannot be edited.', disabled: true },
  render: field,
  parameters: {
    docs: { description: { story: 'Unavailable multiline field.' } },
  },
};
