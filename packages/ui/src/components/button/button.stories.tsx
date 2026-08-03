import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';

const description = `
The **Button** component triggers actions across the Admin Portal and Member Portal. It preserves native button semantics while providing consistent hierarchy, sizing, loading, and disabled states.

#### When to use

- Use **primary** for the most important action in a focused section or flow.
- Use **secondary** or **soft** for supporting actions.
- Use **ghost** in compact areas such as toolbars.
- Use **destructive** only for irreversible or high-risk actions.

#### Usage guidelines

- Prefer one primary action per focused section.
- Use a concise label that starts with a verb, such as “Add member” or “Save changes”.
- Keep the visible label while loading so the action remains understandable.
- Icon-only buttons must provide an accessible name with \`aria-label\`.

#### Accessibility

- Renders a native \`button\` element.
- Uses a visible \`:focus-visible\` indicator for keyboard navigation.
- Loading sets \`aria-busy\` and prevents repeated activation.
- Disabled and loading states prevent pointer and keyboard interaction.
`;

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: description,
      },
    },
  },
  argTypes: {
    children: {
      description: 'Visible and accessible button label.',
      control: 'text',
      table: {
        category: 'Content',
        type: { summary: 'ReactNode' },
      },
    },
    variant: {
      description: 'Visual hierarchy and semantic intent.',
      control: 'select',
      options: ['primary', 'secondary', 'soft', 'ghost', 'destructive'],
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      description: 'Control height and horizontal spacing.',
      control: 'select',
      options: ['sm', 'md', 'lg', 'icon'],
      table: {
        category: 'Appearance',
        defaultValue: { summary: 'md' },
      },
    },
    loading: {
      description: 'Shows progress and prevents repeated activation.',
      control: 'boolean',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      description: 'Prevents interaction with the native button.',
      control: 'boolean',
      table: {
        category: 'State',
        defaultValue: { summary: 'false' },
      },
    },
    type: {
      description: 'Native HTML button behavior.',
      control: 'select',
      options: ['button', 'submit', 'reset'],
      table: {
        category: 'Native attributes',
        defaultValue: { summary: 'button' },
      },
    },
    onClick: {
      description: 'Handler called when the button is activated.',
      action: 'clicked',
      control: false,
      table: {
        category: 'Events',
      },
    },
    className: {
      description: 'Additional classes merged with the component styles.',
      control: false,
      table: {
        category: 'Advanced',
      },
    },
  },
  args: {
    children: 'Add member',
    disabled: false,
    loading: false,
    size: 'md',
    type: 'button',
    variant: 'primary',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Default configuration for the main action within a focused section.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: 'Cancel',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Supporting action that should not compete visually with the primary action.',
      },
    },
  },
};

export const Soft: Story = {
  args: {
    children: 'View details',
    variant: 'soft',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Low-emphasis action placed on neutral surfaces or alongside denser content.',
      },
    },
  },
};

export const Ghost: Story = {
  args: {
    children: 'Clear filters',
    variant: 'ghost',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Quiet action intended for toolbars, navigation areas, and compact interfaces.',
      },
    },
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete member',
    variant: 'destructive',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Reserved for irreversible or high-risk actions that require explicit confirmation.',
      },
    },
  },
};

export const Small: Story = {
  args: {
    children: 'Filter',
    size: 'sm',
    variant: 'secondary',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Compact size for dense tables, filters, and secondary toolbars.',
      },
    },
  },
};

export const Large: Story = {
  args: {
    children: 'Create membership',
    size: 'lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Prominent size for focused forms and high-priority flows.',
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    'aria-label': 'Add member',
    children: <span aria-hidden="true">+</span>,
    size: 'icon',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Square control for recognizable icons. An accessible name is always required.',
      },
    },
  },
};

export const Loading: Story = {
  args: {
    children: 'Saving changes',
    loading: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Communicates an operation in progress while preventing duplicate activation.',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    children: 'Add member',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Represents an action that is currently unavailable. Provide nearby context when the reason is not obvious.',
      },
    },
  },
};
