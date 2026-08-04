import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from '../badge/badge';
import { Button } from '../button/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'Display/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Card** component groups related content and actions on a distinct surface. Compose it with **CardHeader**, **CardTitle**, **CardDescription**, **CardContent**, and **CardFooter**.

#### Usage guidelines

- Use a card only when grouping improves scanning or hierarchy.
- Keep one clear subject per card and avoid deeply nesting cards.
- Use \`rest\` for standard surfaces, \`flat\` inside an existing container, and \`raised\` sparingly for emphasis.

#### Accessibility

- A Card is a visual container and adds no landmark role automatically.
- Use a meaningful heading inside each substantial card.
- Add an appropriate native element or ARIA role only when the surrounding page structure requires it.
`,
      },
    },
  },
  argTypes: {
    elevation: {
      description: 'Surface depth within the current layout.',
      control: 'select',
      options: ['flat', 'rest', 'raised'],
      table: { category: 'Appearance', defaultValue: { summary: 'rest' } },
    },
    children: {
      description: 'Composable card sections and content.',
      control: false,
      table: { category: 'Content', type: { summary: 'ReactNode' } },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: { category: 'Advanced' },
    },
  },
  args: { elevation: 'rest' },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-96">
      <CardHeader>
        <CardTitle>Membership status</CardTitle>
        <CardDescription>
          Current account and renewal information.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <span className="text-sm">Unlimited Annual</span>
        <Badge showDot variant="success">
          Active
        </Badge>
      </CardContent>
    </Card>
  ),
  parameters: { docs: { description: { story: 'Standard content card.' } } },
};

export const WithFooter: Story = {
  render: (args) => (
    <Card {...args} className="w-96">
      <CardHeader>
        <CardTitle>Member profile</CardTitle>
        <CardDescription>Review the latest membership details.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Joined August 3, 2026 · Member GM-4821
      </CardContent>
      <CardFooter className="justify-end">
        <Button size="sm" variant="secondary">
          Cancel
        </Button>
        <Button size="sm">Save changes</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: { description: { story: 'Card with a separated action area.' } },
  },
};

export const Elevations: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-5 bg-background p-8">
      {(['flat', 'rest', 'raised'] as const).map((elevation) => (
        <Card className="w-52" elevation={elevation} key={elevation}>
          <CardHeader>
            <CardTitle className="capitalize">{elevation}</CardTitle>
            <CardDescription>Surface elevation</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    docs: { description: { story: 'Available surface depth levels.' } },
  },
};
