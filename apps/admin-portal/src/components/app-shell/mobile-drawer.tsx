'use client';

import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@gymflow/ui';

import { navigationSections } from '../../config/navigation';
import { Brand } from './brand';
import { NavigationItem } from './navigation-item';

interface MobileDrawerProps {
  onClose: () => void;
  open: boolean;
}

export function MobileDrawer({ onClose, open }: MobileDrawerProps) {
  const pathname = usePathname();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        aria-label="Close navigation"
        className="absolute inset-0 bg-foreground/35"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-label="Mobile navigation"
        aria-modal="true"
        className="relative flex h-full w-4/5 max-w-sm flex-col bg-surface shadow-overlay"
        role="dialog"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-5">
          <Brand />
          <Button
            aria-label="Close navigation"
            autoFocus
            onClick={onClose}
            size="icon"
            variant="ghost"
          >
            <X aria-hidden="true" size={20} />
          </Button>
        </div>
        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          {navigationSections.map((section) => (
            <section key={section.label}>
              <h2 className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {section.label}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavigationItem
                    {...item}
                    active={
                      item.href === '/'
                        ? pathname === '/'
                        : pathname.startsWith(item.href)
                    }
                    key={item.href}
                    onNavigate={onClose}
                  />
                ))}
              </div>
            </section>
          ))}
        </nav>
      </aside>
    </div>
  );
}
