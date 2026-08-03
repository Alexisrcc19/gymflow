import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert, AlertDescription, AlertTitle } from './alert';

const StatusIcon = ({ symbol }: { symbol: string }) => (
  <span className="flex size-5 items-center justify-center rounded-full border border-current text-xs font-bold">
    {symbol}
  </span>
);

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Alert** component communicates important contextual feedback without removing the user from the current workflow.

Use **AlertTitle** for the concise message and **AlertDescription** for supporting details. An optional icon can reinforce meaning, but the text must remain understandable on its own.

#### When to use

- Use **info** for neutral operational context.
- Use **success** to confirm a completed operation.
- Use **warning** when attention or preventive action is needed.
- Use **danger** for failures or conditions that block progress.

#### Accessibility

- Static alerts do not receive a live-region role automatically.
- Add \`role="status"\` for non-urgent feedback inserted dynamically.
- Add \`role="alert"\` only for urgent dynamic messages that require immediate attention.
- Icons are decorative; severity and required action must be present in text.
`,
      },
    },
  },
  argTypes: {
    children: {
      description: 'Alert content, usually AlertTitle and AlertDescription.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    icon: {
      description: 'Optional decorative icon reinforcing the semantic meaning.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    variant: {
      description: 'Semantic intent and visual treatment.',
      control: 'select',
      options: ['info', 'success', 'warning', 'danger'],
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'info' },
      },
    },
    role: {
      description:
        'Optional live-region semantics for dynamically inserted feedback.',
      control: 'select',
      options: [undefined, 'status', 'alert'],
      table: { category: 'Accessibility' },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: {
    children: (
      <>
        <AlertTitle>Class schedule updated</AlertTitle>
        <AlertDescription>
          The evening session now starts at 18:30.
        </AlertDescription>
      </>
    ),
    variant: 'info',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Informational feedback with title and details.' },
    },
  },
};

export const WithIcon: Story = {
  args: { icon: <StatusIcon symbol="i" /> },
  parameters: {
    docs: {
      description: {
        story:
          'Optional decorative icon reinforces the message without replacing text.',
      },
    },
  },
};

export const Success: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Member profile updated</AlertTitle>
        <AlertDescription>
          The latest contact and membership information was saved.
        </AlertDescription>
      </>
    ),
    icon: <StatusIcon symbol="✓" />,
    role: 'status',
    variant: 'success',
  },
  parameters: {
    docs: {
      description: { story: 'Polite confirmation of a completed operation.' },
    },
  },
};

export const Warning: Story = {
  args: {
    children: (
      <>
        <AlertTitle>168 memberships expire within 14 days</AlertTitle>
        <AlertDescription>
          Review renewals before the next billing run.
        </AlertDescription>
      </>
    ),
    icon: <StatusIcon symbol="!" />,
    variant: 'warning',
  },
  parameters: {
    docs: {
      description: { story: 'Preventive warning requiring user attention.' },
    },
  },
};

export const Danger: Story = {
  args: {
    children: (
      <>
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Review the billing details before retrying the charge.
        </AlertDescription>
      </>
    ),
    icon: <StatusIcon symbol="!" />,
    role: 'alert',
    variant: 'danger',
  },
  parameters: {
    docs: {
      description: {
        story: 'Urgent failure that blocks the current operation.',
      },
    },
  },
};

export const SemanticVariants: Story = {
  render: () => (
    <div className="grid w-[40rem] gap-3">
      <Alert icon={<StatusIcon symbol="i" />} variant="info">
        <AlertTitle>Class schedule syncs every 15 minutes.</AlertTitle>
      </Alert>
      <Alert icon={<StatusIcon symbol="✓" />} variant="success">
        <AlertTitle>Billing run completed successfully.</AlertTitle>
      </Alert>
      <Alert icon={<StatusIcon symbol="!" />} variant="warning">
        <AlertTitle>168 memberships expire in 14 days.</AlertTitle>
      </Alert>
      <Alert icon={<StatusIcon symbol="!" />} variant="danger">
        <AlertTitle>Check-in terminal 2 is offline.</AlertTitle>
      </Alert>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: 'Complete semantic feedback palette.' },
    },
  },
};
