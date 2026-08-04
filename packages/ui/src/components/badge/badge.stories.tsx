import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';

const meta = {
  title: 'Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Badge** component communicates a compact category, status, or attribute without interrupting the surrounding workflow.

#### When to use

- Use in tables, cards, and summaries where a short status needs to be scanned quickly.
- Choose a semantic variant that matches the meaning, not a specific business entity.
- Keep badge labels brief and use consistent wording across the product.
- Use \`showDot\` only when the additional visual cue improves scanning.

#### Accessibility

- Text always communicates the status; color and the optional dot are supplementary.
- Do not use a Badge as a button or interactive control.
- Provide additional context outside the badge when the short label is ambiguous.
`,
      },
    },
  },
  argTypes: {
    children: {
      description: 'Short visible label communicated by the badge.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    variant: {
      description: 'Semantic visual treatment matching the badge meaning.',
      control: 'select',
      options: ['neutral', 'primary', 'success', 'warning', 'danger', 'info'],
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'neutral' },
      },
    },
    size: {
      description: 'Compact or standard badge dimensions.',
      control: 'select',
      options: ['sm', 'md'],
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'sm' },
      },
    },
    showDot: {
      description: 'Adds a decorative dot using the current semantic color.',
      control: 'boolean',
      table: {
        category: 'Appearance',
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
    children: 'Active',
    showDot: false,
    size: 'sm',
    variant: 'success',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Compact status using a semantic color.' },
    },
  },
};

export const WithDot: Story = {
  args: { showDot: true },
  parameters: {
    docs: {
      description: {
        story:
          'Optional decorative dot reinforces the status while text retains meaning.',
      },
    },
  },
};

export const Medium: Story = {
  args: { children: 'Annual membership', size: 'md', variant: 'primary' },
  parameters: {
    docs: {
      description: {
        story: 'Standard size for labels requiring more emphasis.',
      },
    },
  },
};

export const SemanticVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="neutral">Day pass</Badge>
      <Badge variant="primary">Pilates</Badge>
      <Badge showDot variant="success">
        Active
      </Badge>
      <Badge showDot variant="warning">
        Expiring
      </Badge>
      <Badge showDot variant="danger">
        Expired
      </Badge>
      <Badge showDot variant="info">
        Paused
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete semantic palette using representative GymFlow statuses and categories.',
      },
    },
  },
};
