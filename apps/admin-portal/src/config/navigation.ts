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
    label: 'Operaciones',
    items: [
      { href: '/', icon: LayoutDashboard, label: 'Panel' },
      { href: '/members', icon: Users, label: 'Miembros' },
      { href: '/classes', icon: CalendarDays, label: 'Clases' },
      { href: '/trainers', icon: UserRoundCog, label: 'Entrenadores' },
      { href: '/memberships', icon: CreditCard, label: 'Membresías' },
    ],
  },
  {
    label: 'Sistema',
    items: [{ href: '/settings', icon: Settings, label: 'Configuración' }],
  },
];

export const mobileNavigationItems = navigationSections[0].items;
