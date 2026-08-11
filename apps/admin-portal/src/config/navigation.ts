import {
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  Settings,
  Users,
  UserRoundCog,
  type LucideIcon,
} from 'lucide-react';

export interface NavigationItemConfig {
  href: string;
  icon: LucideIcon;
  label: string;
}

export interface NavigationSectionConfig {
  items: NavigationItemConfig[];
  label: string;
}

export const navigationSections: NavigationSectionConfig[] = [
  {
    label: 'Operations',
    items: [
      { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/members', icon: Users, label: 'Members' },
      { href: '/classes', icon: CalendarDays, label: 'Classes' },
      { href: '/trainers', icon: UserRoundCog, label: 'Trainers' },
      { href: '/memberships', icon: CreditCard, label: 'Memberships' },
    ],
  },
  {
    label: 'Workspace',
    items: [{ href: '/settings', icon: Settings, label: 'Settings' }],
  },
];

export const mobileNavigationItems = navigationSections[0].items;
