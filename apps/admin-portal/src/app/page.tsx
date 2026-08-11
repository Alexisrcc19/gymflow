import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CreditCard,
  Dumbbell,
  Users,
} from 'lucide-react';

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
} from '@gymflow/ui';

import { AttendanceChart } from '../components/dashboard/attendance-chart';
import { MembershipStatus } from '../components/dashboard/membership-status';
import { RecentMembers } from '../components/dashboard/recent-members';
import { UpcomingClasses } from '../components/dashboard/upcoming-classes';

const metrics = [
  {
    change: '4.2%',
    direction: 'up',
    icon: Users,
    label: 'Total members',
    supporting: 'vs. previous 30 days',
    value: '1,405',
  },
  {
    change: '7.8%',
    direction: 'up',
    icon: Dumbbell,
    label: "Today's attendance",
    supporting: 'check-ins since 05:00',
    value: '312',
  },
  {
    change: '1.1%',
    direction: 'down',
    icon: CreditCard,
    label: 'Active memberships',
    supporting: '74 currently paused',
    value: '1,042',
  },
  {
    change: '6.3%',
    direction: 'up',
    icon: CalendarDays,
    label: 'Upcoming classes',
    supporting: '68 spots available today',
    value: '6',
  },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-muted-foreground">Today</p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Operations overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor daily activity across GymFlow.
          </p>
        </div>
        <Button className="sm:mb-0.5">Add member</Button>
      </div>

      <Alert
        icon={<span className="text-base font-bold">!</span>}
        variant="warning"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <AlertTitle>168 memberships expire within 14 days</AlertTitle>
            <AlertDescription>
              Review renewals before the next billing run.
            </AlertDescription>
          </div>
          <Button size="sm" variant="ghost">
            Review
          </Button>
        </div>
      </Alert>

      <section
        aria-label="Key performance indicators"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(
          ({ change, direction, icon: Icon, label, supporting, value }) => {
            const DirectionIcon =
              direction === 'up' ? ArrowUpRight : ArrowDownRight;
            return (
              <Card className="h-full" key={label}>
                <CardHeader className="flex min-h-16 grid-cols-none flex-row items-start justify-between gap-4 pb-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {label}
                  </p>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                </CardHeader>
                <CardContent className="pt-1">
                  <p className="font-display text-3xl font-semibold tabular-nums text-foreground">
                    {value}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                    <Badge variant={direction === 'up' ? 'success' : 'danger'}>
                      <DirectionIcon aria-hidden="true" size={12} />
                      {change}
                    </Badge>
                    <span className="text-muted-foreground">{supporting}</span>
                  </div>
                </CardContent>
              </Card>
            );
          },
        )}
      </section>

      <section
        aria-label="Attendance and membership insights"
        className="grid gap-4 xl:grid-cols-3"
      >
        <AttendanceChart />
        <MembershipStatus />
      </section>

      <section
        aria-label="Recent operations"
        className="grid gap-4 xl:grid-cols-3"
      >
        <RecentMembers />
        <UpcomingClasses />
      </section>
    </div>
  );
}
