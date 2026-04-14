import { Link, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3, Settings, Search, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { ROUTE_PATHS } from '@/lib/index';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  {
    label: 'Dashboard',
    path: ROUTE_PATHS.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    label: 'Demandes',
    path: ROUTE_PATHS.APPLICATIONS,
    icon: FileText,
  },
  {
    label: 'Statistiques',
    path: ROUTE_PATHS.STATISTICS,
    icon: BarChart3,
  },
  {
    label: 'Paramètres',
    path: ROUTE_PATHS.SETTINGS,
    icon: Settings,
  },
];

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar transition-transform lg:translate-x-0">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b border-sidebar-border px-6">
            <Link to={ROUTE_PATHS.DASHBOARD} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <LayoutDashboard className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">CreditScore Pro</span>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-4">
            <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/30 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Analyste Crédit</p>
                <p className="text-xs text-sidebar-foreground/60 truncate">analyste@bank.ma</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          <div className="flex-1">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un dossier, client..."
                className="pl-9 bg-muted/50"
              />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Analyste Crédit</p>
                  <p className="text-xs text-muted-foreground">analyste@bank.ma</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-sidebar">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
                <Link to={ROUTE_PATHS.DASHBOARD} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                    <LayoutDashboard className="h-5 w-5 text-sidebar-primary-foreground" />
                  </div>
                  <span className="font-semibold text-sidebar-foreground">CreditScore Pro</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <nav className="flex-1 space-y-1 px-3 py-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
