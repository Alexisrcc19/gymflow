import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';

const meta = {
  title: 'Forms/Label',
  component: Label,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Label** component gives a form control a visible, accessible name while keeping typography consistent across GymFlow forms.

#### When to use

- Use a label for every input, select, and textarea.
- Connect it to the control with matching \`htmlFor\` and \`id\` values.
- Keep labels concise and place instructions or constraints in supporting text.

#### Accessibility

- Renders a native \`label\` element.
- Clicking the label focuses its associated form control.
- A placeholder must not replace a visible label.
`,
      },
    },
  },
  argTypes: {
    children: {
      description: 'Visible name of the associated form control.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    htmlFor: {
      description: 'ID of the form control described by the label.',
      control: 'text',
      table: { category: 'Accessibility' },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: {
    children: 'Member name',
    htmlFor: 'member-name',
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label {...args} />
      <input
        className="h-9 rounded-md border border-border bg-surface px-3 text-sm"
        id={args.htmlFor}
        placeholder="Enter member name"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A visible label correctly associated with its form control.',
      },
    },
  },
};

export const RequiredField: Story = {
  args: {
    children: (
      <>
        Email <span className="text-danger">*</span>
      </>
    ),
    htmlFor: 'email',
  },
  render: (args) => (
    <div className="grid w-72 gap-2">
      <Label {...args} />
      <input
        className="h-9 rounded-md border border-border bg-surface px-3 text-sm"
        id={args.htmlFor}
        placeholder="member@example.com"
        required
        type="email"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A required indicator can be supplied as label content while the control retains its native required attribute.',
      },
    },
  },
};
