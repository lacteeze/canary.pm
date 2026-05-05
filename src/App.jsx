import React from 'react';
import { Wordmark, Icon } from './ui.jsx';
import { CLIENTS, TENANTS, VENDORS, PROPERTIES, PORTFOLIOS, LEASES, PROJECTS, LEADS, initials } from './data.js';
import { ManagerViews } from './views/manager.jsx';
import { OwnerViews } from './views/owner.jsx';
import { TenantViews } from './views/tenant.jsx';
import { VendorViews } from './views/vendor.jsx';
import { FABMenu } from './views/fab.jsx';
import './styles.css';

export default function App() {
  const [role, setRoleState] = React.useState(() => localStorage.getItem('canary_role') || 'manager');
  const [section, setSection] = React.useState(() => localStorage.getItem('canary_section') || 'dashboard');
  const [dark, setDark] = React.useState(() => localStorage.getItem('canary_dark') === 'true');

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('canary_dark', dark);
  }, [dark]);

  const setRole = (r) => { setRoleState(r); localStorage.setItem('canary_role', r); setSection('dashboard'); localStorage.setItem('canary_section', 'dashboard'); };
  const goSection = (s) => { setSection(s); localStorage.setItem('canary_section', s); };

  return (
    <div className="app-layout">
      <RoleSwitcher role={role} setRole={setRole} dark={dark} setDark={setDark}/>
      <Sidebar role={role} section={section} setSection={goSection}/>
      <div className="app-main">
        {role === 'manager' && <ManagerViews section={section} setSection={goSection}/>}
        {role === 'owner' && <OwnerViews section={section}/>}
        {role === 'tenant' && <TenantViews section={section}/>}
        {role === 'vendor' && <VendorViews section={section}/>}
      </div>
      <FABMenu/>
    </div>
  );
}

function RoleSwitcher({ role, setRole, dark, setDark }) {
  return (
    <div className="role-switcher">
      <span className="note">DEMO · VIEW AS</span>
      {[['manager','Manager'],['owner','Owner'],['tenant','Tenant'],['vendor','Vendor']].map(([k,l]) => (
        <button key={k} className={role === k ? 'on' : ''} onClick={() => setRole(k)}>{l}</button>
      ))}
      <button
        className="dark-toggle"
        onClick={() => setDark(d => !d)}
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={dark ? 'Light mode' : 'Dark mode'}
      >
        <Icon name={dark ? 'sun' : 'moon'} size={14}/>
      </button>
    </div>
  );
}

function Sidebar({ role, section, setSection }) {
  const nav = {
    manager: [
      { group: 'Overview' },
      { k: 'dashboard', l: 'Dashboard', i: 'home' },
      { k: 'inbox', l: 'Inbox', i: 'message', count: 7 },
      { group: 'Records' },
      { k: 'people', l: 'People', i: 'users', count: CLIENTS.length + TENANTS.length + VENDORS.length },
      { k: 'pipeline', l: 'Pipeline', i: 'arrow_right', count: LEADS.active.length },
      { k: 'properties', l: 'Properties', i: 'building', count: PROPERTIES.length },
      { k: 'portfolios', l: 'Portfolios', i: 'briefcase', count: PORTFOLIOS.length },
      { k: 'leases', l: 'Leases', i: 'doc', count: LEASES.length },
      { group: 'Operations' },
      { k: 'projects', l: 'Projects', i: 'wrench', count: PROJECTS.length },
      { k: 'payments', l: 'Payments', i: 'card' },
      { k: 'listings', l: 'Public listings', i: 'map' },
      { k: 'reports', l: 'Reports', i: 'chart' },
    ],
    owner: [
      { k: 'dashboard', l: 'Overview', i: 'home' },
      { k: 'portfolios', l: 'My portfolios', i: 'briefcase' },
      { k: 'properties', l: 'Properties', i: 'building' },
      { k: 'statements', l: 'Statements', i: 'card' },
      { k: 'projects', l: 'Projects', i: 'wrench' },
      { k: 'documents', l: 'Documents', i: 'doc' },
    ],
    tenant: [
      { k: 'dashboard', l: 'Home', i: 'home' },
      { k: 'pay', l: 'Pay rent', i: 'card' },
      { k: 'requests', l: 'Maintenance', i: 'wrench' },
      { k: 'lease', l: 'My lease', i: 'doc' },
      { k: 'messages', l: 'Messages', i: 'message', count: 2 },
    ],
    vendor: [
      { k: 'dashboard', l: 'Work orders', i: 'wrench' },
      { k: 'schedule', l: 'Schedule', i: 'calendar' },
      { k: 'invoices', l: 'Invoices', i: 'card' },
      { k: 'ratings', l: 'Reviews', i: 'star' },
    ],
  };

  const items = nav[role];
  const user = {
    manager: { name: 'Aidan Flynn', role: 'Property Manager' },
    owner: { name: 'Declan Murphy', role: 'Harbour Holdings' },
    tenant: { name: 'Maeve Walsh', role: 'Tenant · Gower Heights' },
    vendor: { name: 'Rock Solid Roofing', role: 'Vendor · Roofing' },
  }[role];

  return (
    <aside className="sidebar">
      <Wordmark/>
      {items.map((it, i) => {
        if (it.group) return <div key={i} className="section-label">{it.group}</div>;
        return (
          <div key={it.k} className={"nav-item" + (section === it.k ? " active" : "")} onClick={() => setSection(it.k)}>
            <span className="nav-icon"><Icon name={it.i} size={15}/></span>
            <span>{it.l}</span>
            {it.count != null && <span className="count">{it.count}</span>}
          </div>
        );
      })}
      <div className="sidebar-user">
        <div className="avatar">{initials(user.name)}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.role}</div>
        </div>
      </div>
    </aside>
  );
}
