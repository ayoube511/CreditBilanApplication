import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, BarChart3, Settings,
  Search, Menu, X, Bell, ChevronRight,
  LogOut, User, Command, Globe, ShieldCheck,
  ChevronDown, Settings2, BellRing, Landmark
} from 'lucide-react';
import { useState } from 'react';
import { ROUTE_PATHS } from '@/lib/index';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface LayoutProps { children: React.ReactNode; }

const NAV = [
  { label: 'Dashboard',   path: ROUTE_PATHS.DASHBOARD,    icon: LayoutDashboard },
  { label: 'Applications',path: ROUTE_PATHS.APPLICATIONS, icon: FileText },
  { label: 'Statistiques', path: ROUTE_PATHS.STATISTICS,   icon: BarChart3 },
  { label: 'Configuration',path: ROUTE_PATHS.SETTINGS,     icon: Settings },
];

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">

      {/* ── Top Navigation Bar (Minimalist Fusion) ── */}
      <header className="sticky top-0 z-50 w-full h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
        
        {/* Left: Branding & Navigation */}
        <div className="flex items-center gap-12">
          {/* Minimalist Bank Logo (No Text, No BG) */}
          <Link to={ROUTE_PATHS.DASHBOARD} className="flex items-center">
             <Landmark size={22} className="text-slate-900" />
          </Link>

          <span className="text-slate-300 font-light select-none">|</span>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-lg text-[11px] font-[800] uppercase tracking-wider transition-all duration-200 ${
                    active 
                      ? 'text-slate-900 bg-slate-50 border-b-2 border-[#565e74] rounded-none' 
                      : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Center/Right: Search & Actions */}
        <div className="flex items-center gap-6 flex-1 justify-end max-w-4xl">
          
          {/* Search Bar Integration */}
          <div className="relative group hidden xl:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Rechercher dossiers..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none text-[11px] font-bold text-slate-700 placeholder:text-slate-400 rounded-lg outline-none focus:ring-1 focus:ring-[#565e74] transition-all"
            />
          </div>

          <div className="h-6 w-px bg-slate-200 hidden lg:block" />

          <div className="flex items-center gap-3">
             <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all relative">
                <Bell size={18} />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white" />
             </button>
             <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all">
                <Settings2 size={18} />
             </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* User Profile (Photo + Name Only) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 pl-2 group">
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-slate-900 transition-colors group-hover:text-[#565e74]">Ahmed Benali</p>
                </div>
                <div className="h-9 w-9 rounded-full overflow-hidden border border-slate-200 shadow-sm group-hover:shadow-md transition-all">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop" 
                    alt="Ahmed Benali"
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-slate-100 p-2 mt-2">
              <DropdownMenuLabel className="font-bold text-slate-900 px-4 py-2">Account Protocol</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2.5 px-4 rounded-lg text-slate-600 gap-3 cursor-pointer"><User size={16} /> Profil de l'Analyste</DropdownMenuItem>
              <DropdownMenuItem className="py-2.5 px-4 rounded-lg text-slate-600 gap-3 cursor-pointer"><Settings size={16} /> Console de Gestion</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="py-2.5 px-4 rounded-lg text-red-600 font-bold gap-3 cursor-pointer"><LogOut size={16} /> Finir la Session</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Trigger */}
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="lg:hidden animate-fade-in bg-white border-b border-slate-200 px-6 py-6 space-y-2">
          {NAV.map((item) => {
            const active = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 p-4 rounded-xl text-sm font-bold transition-all ${
                  active ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </div>
      )}

      {/* ── Main Content Area ── */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
