import type { Meta, StoryObj } from '@storybook/react-vite';

import { Spinner } from './spinner';

const meta = {
  title: 'Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Spinner** component communicates an indeterminate operation whose completion time is unknown.

#### Usage guidelines

- Use for brief local operations or when no meaningful content shape is available.
- Prefer Skeleton for initial page or card loading.
- Keep the surrounding layout stable while the spinner is visible.

#### Accessibility

- Exposes a named \`status\` region while the animated graphic remains decorative.
- Provide a specific \`label\` such as “Loading memberships”.
- Remove the spinner from the document when loading completes.
`,
      },
    },
  },
  argTypes: {
    label: {
      description: 'Accessible name describing the operation in progress.',
      control: 'text',
      table: {
        category: 'Accessibility',
        defaultValue: { summary: 'Loading' },
      },
    },
    size: {
      description: 'Visual indicator size.',
      control: 'select',
      options: ['sm', 'md', 'lg'],
      table: { category: 'Appearance', defaultValue: { summary: 'md' } },
    },
    variant: {
      description: 'Indicator color in its current context.',
      control: 'select',
      options: ['primary', 'muted', 'current'],
      table: { category: 'Appearance', defaultValue: { summary: 'primary' } },
    },
    className: {
      description: 'Additional classes merged with the visual indicator.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: { label: 'Loading memberships', size: 'md', variant: 'primary' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner label="Small loading indicator" size="sm" />
      <Spinner label="Medium loading indicator" size="md" />
      <Spinner label="Large loading indicator" size="lg" />
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Available indicator sizes.' } },
  },
};

export const Muted: Story = {
  args: { variant: 'muted' },
  parameters: {
    docs: { description: { story: 'Lower-emphasis loading indicator.' } },
  },
};
