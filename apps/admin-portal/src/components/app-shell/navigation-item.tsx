'use client';

import Link from 'next/link';

import type { NavigationItemConfig } from '../../config/navigation';

interface NavigationItemProps extends NavigationItemConfig {
  active: boolean;
  onNavigate?: () => void;
}

export function NavigationItem({
  active,
  href,
  icon: Icon,
  label,
  onNavigate,
}: NavigationItemProps) {
  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={
        active
          ? 'flex h-10 items-center gap-3 rounded-md bg-primary-soft px-3 text-sm font-medium text-primary'
          : 'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground'
      }
      href={href}
      onClick={onNavigate}
    >
      <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </Link>
  );
}
