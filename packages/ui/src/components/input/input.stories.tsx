import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from '../label/label';
import { Input } from './input';

const meta = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Input** component captures short-form text and other native HTML input values with consistent GymFlow sizing, focus, disabled, and validation states.

#### When to use

- Use for short values such as names, email addresses, member IDs, and search terms.
- Choose the correct native \`type\` so browsers and assistive technologies understand the expected value.
- Pair the input with a visible \`Label\` and supporting or error text when needed.

#### Accessibility

- Renders a native \`input\` and accepts all applicable native attributes.
- Displays a visible keyboard focus indicator.
- Use \`aria-invalid\` when validation fails and \`aria-describedby\` to connect supporting or error text.
- Disabled and read-only are distinct states and should be selected intentionally.
`,
      },
    },
  },
  argTypes: {
    placeholder: {
      description: 'Short example or hint shown while the input is empty.',
      control: 'text',
      table: { category: 'Content' },
    },
    inputSize: {
      description: 'Control height and text size.',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },
    type: {
      description: 'Native input type describing the expected value.',
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'number'],
      table: {
        category: 'Native attributes',
        defaultValue: { summary: 'text' },
      },
    },
    disabled: {
      description: 'Prevents focus, editing, and form submission.',
      control: 'boolean',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      description: 'Allows focus and selection but prevents editing.',
      control: 'boolean',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' },
      },
    },
    required: {
      description: 'Marks the value as required for native validation.',
      control: 'boolean',
      table: {
        category: 'Validation',
        defaultValue: { summary: 'false' },
      },
    },
    'aria-invalid': {
      description: 'Communicates that the current value failed validation.',
      control: 'boolean',
      table: {
        category: 'Validation',
        defaultValue: { summary: 'false' },
      },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: {
    disabled: false,
    inputSize: 'md',
    placeholder: 'Enter member name',
    readOnly: false,
    required: false,
    type: 'text',
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

const field = (args: Story['args'], supportingText?: string) => (
  <div className="grid w-80 gap-2">
    <Label htmlFor="member-name">Member name</Label>
    <Input {...args} id="member-name" />
    {supportingText ? (
      <p className="text-xs text-muted-foreground">{supportingText}</p>
    ) : null}
  </div>
);

export const Default: Story = {
  render: (args) => field(args),
  parameters: {
    docs: {
      description: {
        story: 'Default text input paired with a persistent visible label.',
      },
    },
  },
};

export const WithSupportingText: Story = {
  render: (args) =>
    field(args, 'Use the full name shown on the membership agreement.'),
  parameters: {
    docs: {
      description: {
        story:
          'Supporting text provides guidance that remains visible before and after entry.',
      },
    },
  },
};

export const Invalid: Story = {
  args: {
    'aria-describedby': 'email-error',
    'aria-invalid': true,
    defaultValue: 'camille@',
    placeholder: 'member@example.com',
    type: 'email',
  },
  render: (args) => (
    <div className="grid w-80 gap-2">
      <Label htmlFor="member-email">Email</Label>
      <Input {...args} id="member-email" />
      <p className="text-xs text-danger" id="email-error">
        Enter a complete email address.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Invalid state connects the error message to the input for assistive technologies.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'GM-4821',
  },
  render: (args) => field(args),
  parameters: {
    docs: {
      description: {
        story: 'Disabled values cannot receive focus, change, or be submitted.',
      },
    },
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: 'GM-4821',
  },
  render: (args) => field(args),
  parameters: {
    docs: {
      description: {
        story:
          'Read-only values remain focusable and selectable but cannot be edited.',
      },
    },
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="grid w-80 gap-4">
      <Input
        {...args}
        aria-label="Small input"
        inputSize="sm"
        placeholder="Small"
      />
      <Input
        {...args}
        aria-label="Medium input"
        inputSize="md"
        placeholder="Medium"
      />
      <Input
        {...args}
        aria-label="Large input"
        inputSize="lg"
        placeholder="Large"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Available sizes for compact, standard, and prominent form layouts.',
      },
    },
  },
};
