import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BarChart3, Settings,
  Search, Menu, X, Bell, ChevronRight,
  TrendingUp, CircleDot, LogOut, User, Sliders,
} from 'lucide-react';
import { useState } from 'react';
import { ROUTE_PATHS } from '@/lib/index';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps { children: React.ReactNode; }

const NAV = [
  { label: 'Dashboard',    path: ROUTE_PATHS.DASHBOARD,    icon: LayoutDashboard, badge: null },
  { label: 'Demandes',     path: ROUTE_PATHS.APPLICATIONS, icon: FileText,        badge: '42' },
  { label: 'Statistiques', path: ROUTE_PATHS.STATISTICS,   icon: BarChart3,       badge: null },
  { label: 'Paramètres',   path: ROUTE_PATHS.SETTINGS,     icon: Settings,        badge: null },
];

const PORTFOLIO_STATS = [
  { label: 'Dossiers actifs', value: '156', color: '#F59E0B' },
  { label: 'Taux approbation', value: '78.1%', color: '#059669' },
  { label: 'En cours',        value: '42',    color: '#6366F1' },
];

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const Sidebar = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex h-full flex-col" style={{ background: 'var(--sidebar-bg)' }}>

      {/* ── Logo ── */}
      <div className="flex h-[60px] items-center px-5 border-b" style={{ borderColor: 'var(--sidebar-border)' }}>
        <Link to={ROUTE_PATHS.DASHBOARD} className="flex items-center gap-3" onClick={onClose}>
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
            <TrendingUp className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <div className="leading-none">
            <p className="text-[13px] font-700 tracking-tight" style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 700 }}>
              CreditScore
            </p>
            <p className="text-[9px] font-600 uppercase tracking-[0.12em] mt-0.5"
              style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
              Pro Platform
            </p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="ml-auto p-1 rounded" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── Nav Section Label ── */}
      <div className="px-5 pt-6 pb-2">
        <p className="section-label" style={{ color: 'rgba(255,255,255,0.25)' }}>Menu principal</p>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-all duration-150"
              style={{
                background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
                color: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md transition-colors"
                  style={{ background: active ? 'rgba(245,158,11,0.15)' : 'transparent' }}>
                  <Icon className="h-4 w-4" style={{ color: active ? '#F59E0B' : 'rgba(255,255,255,0.45)' }} strokeWidth={active ? 2 : 1.75} />
                </div>
                <span className="text-[13px]" style={{ fontWeight: active ? 600 : 400 }}>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-700"
                    style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', fontWeight: 700 }}>
                    {item.badge}
                  </span>
                )}
                {active && <ChevronRight className="h-3 w-3" style={{ color: 'rgba(255,255,255,0.25)' }} />}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* ── Portfolio Mini Stats ── */}
      <div className="mx-3 mb-3 rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>Portefeuille</p>
        <div className="space-y-2.5">
          {PORTFOLIO_STATS.map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</span>
              </div>
              <span className="num text-[12px] font-600" style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>{s.value}</span>
            </div>
          ))}
        </div>
        {/* Mini progress bar */}
        <div className="mt-3 progress-track">
          <div className="progress-fill" style={{ width: '78.1%', background: 'linear-gradient(90deg, #059669, #10B981)' }} />
        </div>
        <p className="text-[10px] mt-1.5" style={{ color: 'rgba(255,255,255,0.25)' }}>78.1% taux d'approbation</p>
      </div>

      {/* ── User Profile ── */}
      <div className="border-t p-3" style={{ borderColor: 'var(--sidebar-border)' }}>
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-700"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff', fontWeight: 700 }}>
              AB
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 animate-pulse-dot"
              style={{ background: '#059669', borderColor: 'var(--sidebar-bg)' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-600 truncate" style={{ color: 'rgba(255,255,255,0.90)', fontWeight: 600 }}>Ahmed Benali</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>Analyste Senior · Crédit</p>
          </div>
          <button className="p-1 rounded transition-colors" style={{ color: 'rgba(255,255,255,0.25)' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)'}>
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-[220px] hidden lg:block">
        <Sidebar />
      </aside>

      {/* ── Main Area ── */}
      <div className="lg:pl-[220px] flex flex-col min-h-screen">

        {/* ── Top Header ── */}
        <header className="sticky top-0 z-30 flex h-[56px] items-center gap-3 px-5 lg:px-6"
          style={{
            background: 'rgba(248,249,252,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(229,231,235,0.8)',
          }}>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            style={{ background: '#F3F4F6' }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-4 w-4" style={{ color: '#374151' }} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-[360px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#9CA3AF' }} />
              <Input
                type="search"
                placeholder="Rechercher dossier, client, ID..."
                className="pl-9 h-8 text-[13px] border-0 focus-visible:ring-1"
                style={{ background: '#F3F4F6', color: '#374151' }}
              />
            </div>
          </div>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1.5">

            {/* Notifications */}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
              <Bell className="h-4 w-4" style={{ color: '#6B7280' }} />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full" style={{ background: '#DC2626' }} />
            </button>

            {/* Settings shortcut */}
            <button className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-gray-100">
              <Sliders className="h-4 w-4" style={{ color: '#6B7280' }} />
            </button>

            {/* Divider */}
            <div className="h-5 w-px mx-1" style={{ background: '#E5E7EB' }} />

            {/* User dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-700"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff', fontWeight: 700 }}>
                    AB
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[12px] font-600 leading-none" style={{ fontWeight: 600, color: '#111827' }}>Ahmed Benali</p>
                    <p className="text-[10px] leading-none mt-0.5" style={{ color: '#9CA3AF' }}>Analyste Senior</p>
                  </div>
                  <ChevronRight className="h-3 w-3 rotate-90 hidden sm:block" style={{ color: '#9CA3AF' }} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold">Ahmed Benali</p>
                  <p className="text-xs text-muted-foreground font-normal">ahmed.benali@leasingcorp.ma</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profil</DropdownMenuItem>
                <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Paramètres</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive"><LogOut className="mr-2 h-4 w-4" />Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* ── Page Content ── */}
        <main className="flex-1 p-5 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[220px] animate-slide-right">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </div>
  );
}
