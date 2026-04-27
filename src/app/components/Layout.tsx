import { useEffect, useMemo, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Camera,
  Building2,
  BarChart3,
  Settings as SettingsIcon,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Clock,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';

const mainNav = [
  { name: 'Dashboard', href: '/acs', icon: LayoutDashboard },
  { name: 'Users', href: '/acs/users', icon: Users },
  { name: 'Devices', href: '/acs/devices', icon: Camera },
  { name: 'Logs', href: '/acs/logs', icon: FileText },
  { name: 'Offices', href: '/acs/branches', icon: Building2 },
  { name: 'Reports', href: '/acs/reports', icon: BarChart3 },
  { name: 'Settings', href: '/acs/settings', icon: SettingsIcon },
];

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeFormatter = useMemo(() => {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const hour12 = new Intl.DateTimeFormat(locale, { hour: 'numeric' }).resolvedOptions().hour12 ?? false;

    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12,
      timeZoneName: 'short',
    });
  }, []);

  const headerTime = useMemo(() => timeFormatter.format(now), [now, timeFormatter]);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 bg-slate-900/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 shadow-xl border-r border-slate-800 flex flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <span className="text-white font-semibold tracking-tight">Teampl ACS</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="size-6 text-slate-400" />
            </button>
          </div>
          <nav className="flex-1 mt-6 px-3 flex flex-col">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors text-sm"
            >
              <ArrowLeft className="size-4" />
              Back to Hub
            </Link>
            <div className="space-y-0.5">
              {mainNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-600/15 text-blue-400 font-medium"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className="size-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-slate-900 border-r border-slate-800 overflow-y-auto">
          <div className="flex h-16 items-center px-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <span className="text-white font-semibold tracking-tight">Teampl ACS</span>
            </div>
          </div>
          <nav className="flex-1 mt-6 px-3 flex flex-col">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg text-slate-500 hover:bg-slate-800 hover:text-slate-300 transition-colors text-sm"
            >
              <ArrowLeft className="size-4" />
              Back to Hub
            </Link>
            <div className="space-y-0.5">
              {mainNav.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                      isActive
                        ? "bg-blue-600/15 text-blue-400 font-medium"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )}
                  >
                    <item.icon className="size-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-900 px-4 sm:px-6">
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-6 text-slate-400" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-slate-200">
              <Clock className="size-4 text-slate-400" />
              <span className="text-sm tabular-nums">{headerTime}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 hover:bg-slate-800">
                  <Avatar className="size-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-600 text-white">{user?.avatarInitials ?? 'U'}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-white">{user?.displayName ?? 'User'}</span>
                  <ChevronDown className="size-4 text-slate-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-white" onClick={() => navigate('/')}>Switch Module</DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-white" onClick={() => navigate('/acs/settings')}>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="hover:bg-slate-800 text-slate-400 hover:text-red-400" onClick={() => { logout(); navigate('/login', { replace: true }); }}>
              <LogOut className="size-5" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="h-[calc(100vh-4rem)] overflow-hidden p-4 sm:p-6 text-[15px] leading-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
