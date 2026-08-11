'use client';

import { Bell, LogOut, Menu, Search } from 'lucide-react';

import { useAuth } from '@gymflow/auth-client';
import { Button, Input } from '@gymflow/ui';

import { Brand } from './brand';

interface TopHeaderProps {
  onOpenNavigation: () => void;
}

export function TopHeader({ onOpenNavigation }: TopHeaderProps) {
  const { logout, user } = useAuth();
  const initials = user?.email.slice(0, 2).toUpperCase() ?? 'GF';
  const roleLabel =
    user?.role === 'ADMIN'
      ? 'Administrador'
      : user?.role === 'TRAINER'
        ? 'Entrenador'
        : 'Miembro';

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full min-w-0 items-center gap-3 border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="lg:hidden">
        <Button
          aria-label="Abrir navegación"
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
            aria-label="Buscar miembros, clases y entrenadores"
            className="pl-9 shadow-none"
            placeholder="Buscar miembros, clases, entrenadores..."
            type="search"
          />
        </div>
      </div>

      <Button
        aria-label="Notificaciones"
        className="relative"
        size="icon"
        variant="ghost"
      >
        <Bell aria-hidden="true" size={19} />
        <span className="absolute right-2 top-2 size-1.5 rounded-full bg-danger" />
      </Button>

      <div className="hidden items-center gap-2 sm:flex">
        <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
          {initials}
        </span>
        <div className="hidden xl:block">
          <p className="max-w-44 truncate text-xs font-semibold text-foreground">
            {user?.email}
          </p>
          <p className="text-[11px] text-muted-foreground">{roleLabel}</p>
        </div>
      </div>

      <Button
        aria-label="Cerrar sesión"
        onClick={() => void logout()}
        size="icon"
        variant="ghost"
      >
        <LogOut aria-hidden="true" size={18} />
      </Button>
    </header>
  );
}
