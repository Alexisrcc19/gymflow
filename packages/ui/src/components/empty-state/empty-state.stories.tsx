import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../button/button';
import { EmptyState } from './empty-state';

const CalendarIcon = () => (
  <svg
    aria-hidden="true"
    fill="none"
    height="20"
    viewBox="0 0 24 24"
    width="20"
  >
    <path
      d="M7 3v3m10-3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const meta = {
  title: 'Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **EmptyState** component explains why a content region has no data and, when appropriate, provides a clear next action.

#### When to use

- Use for a valid empty collection, first-use state, or filtered result with no matches.
- State what is missing and explain the next useful step.
- Include an action only when the user can resolve the state directly.

#### Accessibility

- Uses a heading to make the empty region easy to understand.
- The optional icon is decorative and hidden from assistive technologies.
- Action content must use native interactive elements such as Button.
`,
      },
    },
  },
  argTypes: {
    title: {
      description: 'Concise explanation of the empty condition.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    description: {
      description: 'Supporting explanation or recovery guidance.',
      control: 'text',
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    icon: {
      description: 'Optional decorative illustration or icon.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    action: {
      description: 'Optional native action resolving the empty condition.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: {
    description: 'Add a class to make it available for member reservations.',
    title: 'No classes scheduled',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { className: 'w-[30rem]' },
  parameters: {
    docs: {
      description: { story: 'Informational empty state without an action.' },
    },
  },
};

export const WithAction: Story = {
  args: {
    action: <Button size="sm">Add class</Button>,
    className: 'w-[30rem]',
    icon: <CalendarIcon />,
  },
  parameters: {
    docs: {
      description: {
        story: 'Recoverable empty state with a clear primary action.',
      },
    },
  },
};

export const NoFilterResults: Story = {
  args: {
    action: (
      <Button size="sm" variant="secondary">
        Clear filters
      </Button>
    ),
    className: 'w-[30rem]',
    description: 'Adjust the date range or clear filters to see records.',
    title: 'No results for this filter',
  },
  parameters: {
    docs: {
      description: {
        story: 'Filtered empty state offering a direct recovery action.',
      },
    },
  },
};
