'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { mobileNavigationItems } from '../../config/navigation';

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile primary navigation"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      {mobileNavigationItems.map(({ href, icon: Icon, label }) => {
        const active =
          href === '/' ? pathname === '/' : pathname.startsWith(href);

        return (
          <Link
            aria-current={active ? 'page' : undefined}
            className={
              active
                ? 'flex min-w-0 flex-col items-center gap-1 px-1 py-2 text-primary'
                : 'flex min-w-0 flex-col items-center gap-1 px-1 py-2 text-muted-foreground'
            }
            href={href}
            key={href}
          >
            <Icon aria-hidden="true" size={19} strokeWidth={1.8} />
            <span className="max-w-full truncate text-[10px] font-medium">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
