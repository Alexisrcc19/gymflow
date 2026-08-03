# GymFlow UI

Shared design system for the GymFlow Admin Portal and Member Portal.

The package owns:

- Semantic design tokens.
- Global Tailwind CSS configuration.
- Reusable React components.
- Storybook documentation and interaction examples.

It is private to the GymFlow monorepo and is not published independently.

## Storybook

Run `pnpm nx storybook ui` to develop components in isolation.

Run `pnpm nx build-storybook ui` to verify the production Storybook build.

## Running unit tests

Run `pnpm nx test ui` to execute unit tests with Vitest.
