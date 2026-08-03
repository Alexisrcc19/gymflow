import type { Meta, StoryObj } from '@storybook/react-vite';

const colors = [
  ['Background', 'background', '#F8F7F4'],
  ['Surface', 'surface', '#FFFFFF'],
  ['Foreground', 'foreground', '#1F2933'],
  ['Muted text', 'muted-foreground', '#6B7580'],
  ['Border', 'border', '#E3E1DC'],
  ['Primary', 'primary', '#2A7F7B'],
  ['Primary soft', 'primary-soft', '#E7F2F0'],
  ['Success', 'success', '#2F8F5B'],
  ['Warning', 'warning', '#B5811F'],
  ['Danger', 'danger', '#C0433B'],
  ['Info', 'info', '#2F6FB5'],
] as const;

const spacing = [4, 8, 12, 16, 20, 24, 32, 48] as const;

function Foundations() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 font-sans text-foreground">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          GymFlow UI
        </p>
        <h1 className="font-display text-3xl font-semibold">
          Calm Performance
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Semantic foundations shared by the Admin Portal and Member Portal.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Color palette</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {colors.map(([label, token, value]) => (
            <article
              className="overflow-hidden rounded-lg border bg-surface shadow-rest"
              key={token}
            >
              <div
                className="h-20 border-b"
                style={{ backgroundColor: `var(--gymflow-color-${token})` }}
              />
              <div className="space-y-1 p-4">
                <h3 className="text-sm font-semibold">{label}</h3>
                <p className="text-xs text-muted-foreground">
                  --gymflow-color-{token}
                </p>
                <p className="text-xs font-medium">{value}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Typography</h2>
          <div className="space-y-6 rounded-lg border bg-surface p-6 shadow-rest">
            <div>
              <p className="text-xs text-muted-foreground">Display / Sora</p>
              <p className="font-display text-3xl font-semibold">Dashboard</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Body / Manrope</p>
              <p className="text-sm">
                Reliable software for everyday gym operations.
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Metric</p>
              <p className="font-display text-3xl font-semibold tabular-nums">
                1,405
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display text-xl font-semibold">Spacing</h2>
          <div className="space-y-3 rounded-lg border bg-surface p-6 shadow-rest">
            {spacing.map((value) => (
              <div className="flex items-center gap-4" key={value}>
                <span className="w-8 text-xs tabular-nums text-muted-foreground">
                  {value}
                </span>
                <div
                  className="h-3 rounded-sm bg-primary-soft"
                  style={{ width: `${value * 3}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">
          Radius and elevation
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-sm border bg-surface p-6 shadow-rest">
            Small / Rest
          </div>
          <div className="rounded-md border bg-surface p-6 shadow-raised">
            Medium / Raised
          </div>
          <div className="rounded-lg border bg-surface p-6 shadow-overlay">
            Large / Overlay
          </div>
        </div>
      </section>
    </main>
  );
}

const meta = {
  title: 'Foundations/Overview',
  component: Foundations,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Foundations>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
