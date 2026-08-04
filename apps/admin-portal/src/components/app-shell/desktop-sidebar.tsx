'use client';

import { usePathname } from 'next/navigation';

import { navigationSections } from '../../config/navigation';
import { Brand } from './brand';
import { NavigationItem } from './navigation-item';

function isCurrentPath(pathname: string, href: string) {
  return href === '/' ? pathname === href : pathname.startsWith(href);
}

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Brand />
      </div>

      <nav
        aria-label="Primary navigation"
        className="flex-1 space-y-7 overflow-y-auto px-3 py-6"
      >
        {navigationSections.map((section) => (
          <section key={section.label}>
            <h2 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {section.label}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => (
                <NavigationItem
                  {...item}
                  active={isCurrentPath(pathname, item.href)}
                  key={item.href}
                />
              ))}
            </div>
          </section>
        ))}
      </nav>
    </aside>
  );
}
