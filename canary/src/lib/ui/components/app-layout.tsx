import { useState, type ComponentType, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
export type AppRole = 'manager' | 'owner' | 'tenant' | 'vendor';
import { useSession, signOut } from '@hooks/auth-client';
import { useProperties } from '@hooks/use-properties';
import { usePeople } from '@hooks/use-people';
import { usePortfolios } from '@hooks/use-portfolios';
import { useLeases } from '@hooks/use-leases';
import { useProjects } from '@hooks/use-projects';
import Wordmark from '@ui/wordmark';
import FabMenu from '@ui/fab-menu';
import {
  Home, MessageSquare, Users, Building, Briefcase, FileText,
  Wrench, CreditCard, Map, BarChart3, LogOut,
  Calendar, Star, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';

type NavItem = {
  group?: string;
  href?: string;
  label?: string;
  icon?: ComponentType<LucideProps>;
  count?: number;
};

function useManagerNav(): NavItem[] {
  const { data: people } = usePeople();
  const { data: properties } = useProperties();
  const { data: portfolios } = usePortfolios();
  const { data: leases } = useLeases();
  const { data: projects } = useProjects();

  return [
    { group: 'Overview' },
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/inbox', label: 'Inbox', icon: MessageSquare, count: 7 },
    { group: 'Records' },
    { href: '/people', label: 'People', icon: Users, count: people?.length },
    { href: '/properties', label: 'Properties', icon: Building, count: properties?.length },
    { href: '/portfolios', label: 'Portfolios', icon: Briefcase, count: portfolios?.length },
    { href: '/leases', label: 'Leases', icon: FileText, count: leases?.length },
    { group: 'Operations' },
    { href: '/projects', label: 'Projects', icon: Wrench, count: projects?.length },
    { href: '/payments', label: 'Payments', icon: CreditCard },
    { href: '/listings', label: 'Public listings', icon: Map },
    { href: '/reports', label: 'Reports', icon: BarChart3 },
  ];
}

const STATIC_NAV: Record<Exclude<AppRole, 'manager'>, NavItem[]> = {
  owner: [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/portfolios', label: 'My portfolios', icon: Briefcase },
    { href: '/properties', label: 'Properties', icon: Building },
    { href: '/statements', label: 'Statements', icon: CreditCard },
    { href: '/projects', label: 'Projects', icon: Wrench },
    { href: '/documents', label: 'Documents', icon: FileText },
  ],
  tenant: [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/pay', label: 'Pay rent', icon: CreditCard },
    { href: '/requests', label: 'Maintenance', icon: Wrench },
    { href: '/lease', label: 'My lease', icon: FileText },
    { href: '/messages', label: 'Messages', icon: MessageSquare, count: 2 },
  ],
  vendor: [
    { href: '/dashboard', label: 'Work orders', icon: Wrench },
    { href: '/schedule', label: 'Schedule', icon: Calendar },
    { href: '/invoices', label: 'Invoices', icon: CreditCard },
    { href: '/ratings', label: 'Reviews', icon: Star },
  ],
};

interface AppLayoutProps {
  role: AppRole;
  children: ReactNode;
}

export default function AppLayout({ role, children }: AppLayoutProps) {
  const [location, navigate] = useLocation();
  const { data: session } = useSession();
  const managerNav = useManagerNav();
  const items = role === 'manager' ? managerNav : STATIC_NAV[role];

  const userName = session?.user?.name ?? 'User';
  const userInitials = userName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => navigate('~/'),
      },
    });
  };

  return (
    <div className="app-layout">
      <RoleSwitcher currentRole={role} />
      <aside className="sidebar">
        <Wordmark />
        {items.map((it, i) => {
          if (it.group) return <div key={i} className="section-label">{it.group}</div>;
          const NavIcon = it.icon;
          const active = location === it.href || (it.href === '/dashboard' && location === '/');
          return (
            <Link key={it.href} href={it.href!} className={`nav-item${active ? ' active' : ''}`}>
              <span className="nav-icon">{NavIcon && <NavIcon size={15} />}</span>
              <span>{it.label}</span>
              {it.count != null && <span className="count">{it.count}</span>}
            </Link>
          );
        })}
        <div className="sidebar-user">
          <div className="avatar">{userInitials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session?.user?.email ?? ''}</div>
          </div>
          <button onClick={handleSignOut} style={{ color: 'var(--ink-3)', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }} title="Sign out"><LogOut size={14} /></button>
        </div>
      </aside>
      <div className="app-main">
        {children}
      </div>
      <FabMenu />
    </div>
  );
}

function RoleSwitcher({ currentRole }: { currentRole: AppRole }) {
  const [open, setOpen] = useState(false);
  const roles: AppRole[] = ['manager', 'owner', 'tenant', 'vendor'];
  return (
    <div className={`role-switcher ${open ? 'open' : 'collapsed'}`}>
      {open ? (
        <>
          <span className="note">DEMO · VIEW AS</span>
          {roles.map(r => (
            <Link key={r} href={`~/${r}/dashboard`} className={currentRole === r ? 'on' : ''}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Link>
          ))}
          <button onClick={() => window.location.href = '/'} title="Exit app"><LogOut size={12} /></button>
          <button onClick={() => setOpen(false)} title="Collapse" className="toggle"><ChevronDown size={12} /></button>
        </>
      ) : (
        <button onClick={() => setOpen(true)} className="toggle" title="Switch role">
          <span className="note">DEMO</span>
          <ChevronUp size={12} />
        </button>
      )}
    </div>
  );
}
