/* App shell wraps all role-specific views */

function AppShell({ navigate }) {
  const [role, setRoleState] = React.useState(() => localStorage.getItem('canary_role') || 'manager');
  const [section, setSection] = React.useState(() => localStorage.getItem('canary_section') || 'dashboard');
  const setRole = (r) => { setRoleState(r); localStorage.setItem('canary_role', r); setSection('dashboard'); };
  const goSection = (s) => { setSection(s); localStorage.setItem('canary_section', s); };

  return (
    <div className="app-layout">
      <RoleSwitcher role={role} setRole={setRole} navigate={navigate}/>
      <Sidebar role={role} section={section} setSection={goSection} navigate={navigate}/>
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

function RoleSwitcher({ role, setRole, navigate }) {
  return (
    <div className="role-switcher">
      <span className="note">DEMO · VIEW AS</span>
      {[
        { k: 'manager', l: 'Manager' },
        { k: 'owner', l: 'Owner' },
        { k: 'tenant', l: 'Tenant' },
        { k: 'vendor', l: 'Vendor' },
      ].map(r => (
        <button key={r.k} className={role === r.k ? 'on' : ''} onClick={() => setRole(r.k)}>{r.l}</button>
      ))}
      <button onClick={() => navigate('/')} title="Exit app" style={{ padding: '5px 10px' }}><Icon name="logout" size={12}/></button>
    </div>
  );
}

function Sidebar({ role, section, setSection, navigate }) {
  const nav = {
    manager: [
      { group: 'Overview' },
      { k: 'dashboard', l: 'Dashboard', i: 'home' },
      { k: 'inbox', l: 'Inbox', i: 'message', count: 7 },
      { group: 'Records' },
      { k: 'people', l: 'People', i: 'users', count: CLIENTS.length + TENANTS.length + VENDORS.length },
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
    ]
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
        <button style={{ color: 'var(--ink-3)' }} onClick={() => navigate('/')} title="Sign out"><Icon name="logout" size={14}/></button>
      </div>
    </aside>
  );
}

function Topbar({ title, crumbs, actions }) {
  return (
    <div className="app-topbar">
      <div>
        {crumbs && <div className="crumbs">{crumbs}</div>}
        <h1>{title}</h1>
      </div>
      <div style={{ flex: 1 }}/>
      <div className="search-input">
        <Icon name="search" size={13}/>
        <input placeholder="Search anything..."/>
        <span className="kbd">⌘K</span>
      </div>
      <button className="btn btn-ghost btn-sm"><Icon name="bell" size={14}/></button>
      {actions}
    </div>
  );
}

Object.assign(window, { AppShell, Topbar });
