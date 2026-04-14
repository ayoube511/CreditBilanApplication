import { Link, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Settings, Search, Menu, X, TrendingUp, Bell, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { ROUTE_PATHS } from '@/lib/index';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  { label: 'Tableau de Bord', path: ROUTE_PATHS.DASHBOARD, icon: LayoutDashboard, badge: null },
  { label: 'Demandes', path: ROUTE_PATHS.APPLICATIONS, icon: FileText, badge: '42' },
  { label: 'Statistiques', path: ROUTE_PATHS.STATISTICS, icon: BarChart3, badge: null },
  { label: 'Paramètres', path: ROUTE_PATHS.SETTINGS, icon: Settings, badge: null },
];

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link to={ROUTE_PATHS.DASHBOARD} className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-gradient shadow-sm">
            <TrendingUp className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-bold text-sidebar-foreground tracking-wide">CreditScore</p>
            <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest font-medium">Pro Platform</p>
          </div>
        </Link>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">Navigation</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 px-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-accent' : 'text-sidebar-foreground/50 group-hover:text-accent/80'}`} />
                {item.label}
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <Badge className="h-4 min-w-4 px-1 text-[10px] bg-accent/20 text-accent border-0 font-semibold">
                    {item.badge}
                  </Badge>
                )}
                {isActive && <ChevronRight className="h-3 w-3 text-accent/60" />}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Stats summary */}
      <div className="mx-3 mb-3 rounded-lg bg-sidebar-accent/40 border border-sidebar-border/50 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 mb-2">Portefeuille</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-xs text-sidebar-foreground/60">Total dossiers</span>
            <span className="text-xs font-bold text-sidebar-foreground font-mono">156</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-sidebar-foreground/60">Taux approbation</span>
            <span className="text-xs font-bold text-chart-2 font-mono">78.1%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-sidebar-foreground/60">En cours</span>
            <span className="text-xs font-bold text-accent font-mono">42</span>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar className="h-8 w-8 ring-2 ring-accent/30">
            <AvatarFallback className="bg-navy-gradient text-sidebar-foreground text-xs font-bold">AB</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-sidebar-foreground truncate">Ahmed Benali</p>
            <p className="text-[10px] text-sidebar-foreground/50 truncate">Analyste Senior</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-chart-2 shadow-sm" title="En ligne" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar hidden lg:block">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-5">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>

          {/* Breadcrumb / Search */}
          <div className="flex-1">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un dossier, client..."
                className="pl-9 h-8 text-sm bg-muted/40 border-border/60 focus:bg-background"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-chart-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">AB</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-semibold">Ahmed Benali</p>
                    <p className="text-xs text-muted-foreground">Analyste Senior · Crédit</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profil</DropdownMenuItem>
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Déconnexion</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-5 lg:p-6">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar" onClick={e => e.stopPropagation()}>
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}
