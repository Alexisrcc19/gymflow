'use client';

import { Bell, Menu, Search } from 'lucide-react';

import { Button, Input } from '@gymflow/ui';

import { Brand } from './brand';

interface TopHeaderProps {
  onOpenNavigation: () => void;
}

export function TopHeader({ onOpenNavigation }: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full min-w-0 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="lg:hidden">
        <Button
          aria-label="Open navigation"
          onClick={onOpenNavigation}
          size="icon"
          variant="ghost"
        >
          <Menu aria-hidden="true" size={20} />
        </Button>
      </div>

      <div className="hidden sm:block lg:hidden">
        <Brand compact />
      </div>

      <div className="min-w-0 flex-1">
        <div className="relative max-w-md">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={17}
          />
          <Input
            aria-label="Search members, classes, and trainers"
            className="pl-9 shadow-none"
            placeholder="Search members, classes, trainers..."
            type="search"
          />
        </div>
      </div>

      <Button
        aria-label="Notifications"
        className="relative"
        size="icon"
        variant="ghost"
      >
        <Bell aria-hidden="true" size={19} />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
      </Button>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          AC
        </span>
        <div className="hidden xl:block">
          <p className="text-xs font-semibold text-foreground">Alexis Cañar</p>
          <p className="text-[11px] text-muted-foreground">Administrator</p>
        </div>
      </div>
    </header>
  );
}
