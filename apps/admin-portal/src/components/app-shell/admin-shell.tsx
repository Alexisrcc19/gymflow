'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { DesktopSidebar } from './desktop-sidebar';
import { MobileDrawer } from './mobile-drawer';
import { MobileNavigation } from './mobile-navigation';
import { TopHeader } from './top-header';

export function AdminShell({ children }: { children: ReactNode }) {
  const [navigationOpen, setNavigationOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = navigationOpen ? 'hidden' : '';

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavigationOpen(false);
    };

    if (navigationOpen) document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [navigationOpen]);

  return (
    <div className="min-h-dvh w-full min-w-0 bg-background">
      <DesktopSidebar />
      <MobileDrawer
        open={navigationOpen}
        onClose={() => setNavigationOpen(false)}
      />

      <div className="min-h-dvh w-full min-w-0 lg:pl-64">
        <TopHeader onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="mx-auto w-full min-w-0 max-w-screen-2xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-8">
          {children}
        </main>
      </div>

      <MobileNavigation />
    </div>
  );
}
