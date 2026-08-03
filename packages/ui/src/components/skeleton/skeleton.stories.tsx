import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card, CardContent, CardHeader } from '../card/card';
import { Skeleton } from './skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The **Skeleton** component reserves layout space while content is loading and approximates the shape of the expected interface.

#### Usage guidelines

- Match the final content dimensions closely to prevent layout shifts.
- Combine simple shapes to represent a complete loading region.
- Use for initial content loading, not for brief button operations.

#### Accessibility

- Skeleton shapes are decorative and hidden from assistive technologies by default.
- Apply loading semantics such as \`aria-busy\` to the containing region.
- Preserve an accessible region name so users know what content is loading.
`,
      },
    },
  },
  argTypes: {
    shape: {
      description: 'Geometry of the expected content.',
      control: 'select',
      options: ['rectangle', 'text', 'circle'],
      table: { category: 'Appearance', defaultValue: { summary: 'rectangle' } },
    },
    className: {
      description: 'Dimensions and additional merged styles.',
      control: false,
      table: { category: 'Appearance' },
    },
  },
  args: { className: 'h-24 w-80', shape: 'rectangle' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: { description: { story: 'Generic rectangular placeholder.' } },
  },
};

export const Shapes: Story = {
  render: () => (
    <div className="flex w-80 items-center gap-4">
      <Skeleton className="size-12" shape="circle" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="w-2/3" shape="text" />
        <Skeleton className="w-full" shape="text" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Composable shapes approximating profile content.',
      },
    },
  },
};

export const CardLoading: Story = {
  render: () => (
    <Card aria-busy="true" aria-label="Loading member summary" className="w-96">
      <CardHeader className="flex grid-cols-none flex-row items-center gap-3">
        <Skeleton className="size-10" shape="circle" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="w-1/2" shape="text" />
          <Skeleton className="w-3/4" shape="text" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete loading composition inside a named busy region.',
      },
    },
  },
};
