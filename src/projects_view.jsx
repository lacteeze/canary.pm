/* Powerful projects view: Kanban / Gantt / Calendar / Table + sub-projects + expenses */

function ProjectsViewV2() {
  const [view, setView] = React.useState(() => localStorage.getItem('canary_proj_view') || 'kanban');
  const [openId, setOpenId] = React.useState(null);
  const [filter, setFilter] = React.useState({ status: 'All', priority: 'All', vendor: 'All', property: 'All', size: 'All', search: '' });
  const [sort, setSort] = React.useState({ key: 'due', dir: 'asc' });

  const setV = (v) => { setView(v); localStorage.setItem('canary_proj_view', v); };

  let rows = PROJECTS.slice();
  if (filter.status !== 'All') rows = rows.filter(r => r.status === filter.status);
  if (filter.priority !== 'All') rows = rows.filter(r => r.priority === filter.priority);
  if (filter.vendor !== 'All') rows = rows.filter(r => r.vendorId === filter.vendor);
  if (filter.property !== 'All') rows = rows.filter(r => r.propertyId === filter.property);
  if (filter.size === 'Large') rows = rows.filter(r => r.isLarge);
  if (filter.size === 'Small') rows = rows.filter(r => !r.isLarge);
  if (filter.search) rows = rows.filter(r => (r.title + ' ' + getProperty(r.propertyId).name).toLowerCase().includes(filter.search.toLowerCase()));

  rows.sort((a, b) => {
    const av = a[sort.key], bv = b[sort.key];
    const cmp = av < bv ? -1 : av > bv ? 1 : 0;
    return sort.dir === 'asc' ? cmp : -cmp;
  });

  const toggleSort = (k) => setSort(s => ({ key: k, dir: s.key === k && s.dir === 'asc' ? 'desc' : 'asc' }));

  const totalBudget = rows.reduce((a, p) => a + p.budget, 0);
  const totalSpent = rows.reduce((a, p) => a + p.spent, 0);
  const openCount = rows.filter(p => p.status !== 'Completed').length;

  return (
    <>
      <Topbar title="Projects" crumbs="Operations / Projects"
        actions={<>
          <button className="btn btn-ghost btn-sm">Import</button>
          <button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> New project</button>
        </>}/>
      <div className="app-content">

        <div className="kpi-row">
          <KpiCard label="Open projects" value={openCount}/>
          <KpiCard label="Combined budget" value={fmtCompact(totalBudget)}/>
          <KpiCard label="Spent to date" value={fmtCompact(totalSpent)} delta={Math.round(totalSpent/totalBudget*100) + '% of budget'}/>
          <KpiCard label="Avg. markup" value={Math.round(rows.reduce((a,p)=>a+p.markup,0)/rows.length) + '%'}/>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="segmented">
            {[['kanban','Kanban'],['gantt','Gantt'],['calendar','Calendar'],['table','Table']].map(([k,l]) => (
              <button key={k} className={view===k?'active':''} onClick={() => setV(k)}>{l}</button>
            ))}
          </div>
          <div style={{ width: '1px', height: 20, background: 'var(--line)', margin: '0 4px' }}/>
          <div style={{ display: 'flex', gap: 6, flex: 1, alignItems: 'center', minWidth: 0, flexWrap: 'wrap' }}>
            <select value={filter.status} onChange={e => setFilter({...filter, status: e.target.value})}
              style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink)', cursor: 'pointer', appearance: 'none' }}>
              {['All','Requested','Scheduled','In progress','On hold','Completed'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filter.priority} onChange={e => setFilter({...filter, priority: e.target.value})}
              style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink)', cursor: 'pointer', appearance: 'none' }}>
              {['All','Urgent','High','Medium','Low'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filter.size} onChange={e => setFilter({...filter, size: e.target.value})}
              style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink)', cursor: 'pointer', appearance: 'none' }}>
              {['All','Large','Small'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={filter.vendor} onChange={e => setFilter({...filter, vendor: e.target.value})}
              style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink)', cursor: 'pointer', appearance: 'none' }}>
              <option value="All">All vendors</option>
              {VENDORS.map(v => <option key={v.id} value={v.id}>{v.company}</option>)}
            </select>
            <select value={filter.property} onChange={e => setFilter({...filter, property: e.target.value})}
              style={{ padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink)', cursor: 'pointer', appearance: 'none' }}>
              <option value="All">All properties</option>
              {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div style={{ flex: 1, minWidth: 160 }}/>
            <div className="search-input" style={{ minWidth: 160 }}>
              <Icon name="search" size={13}/>
              <input placeholder="Find..." value={filter.search} onChange={e => setFilter({...filter, search: e.target.value})} style={{ fontSize: 12 }}/>
            </div>
          </div>
        </div>

        {view === 'kanban' && <KanbanViewV2 rows={rows} onOpen={setOpenId}/>}
        {view === 'gantt' && <GanttViewV2 rows={rows} onOpen={setOpenId}/>}
        {view === 'calendar' && <CalendarViewV2 rows={rows} onOpen={setOpenId}/>}
        {view === 'table' && <TableView rows={rows} onOpen={setOpenId} sort={sort} toggleSort={toggleSort}/>}
      </div>

      {openId && <ProjectSheet projectId={openId} onClose={() => setOpenId(null)}/>}
    </>
  );
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="filter-chip" style={{ padding: '8px 26px 8px 12px', cursor: 'pointer', appearance: 'none', background: 'var(--bg-elev) url("data:image/svg+xml;utf8,<svg xmlns=%27http://www.w3.org/2000/svg%27 width=%2710%27 height=%276%27 viewBox=%270 0 10 6%27><path d=%27M1 1l4 4 4-4%27 stroke=%27%236b665f%27 stroke-width=%271.5%27 fill=%27none%27 stroke-linecap=%27round%27/></svg>") no-repeat right 10px center' }}>
        {options.map(o => {
          const [v, l] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v}>{v === 'All' ? `${label}: All` : l}</option>;
        })}
      </select>
    </div>
  );
}

/* ----- Kanban (improved: truly card-based) ----- */
function KanbanViewV2({ rows, onOpen }) {
  const cols = ['Requested','Scheduled','In progress','On hold','Completed'];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginTop: 16 }}>
      {cols.map(col => {
        const items = rows.filter(p => p.status === col);
        const colColor = { 'Requested':'#6b665f','Scheduled':'#2b6fd6','In progress':'#1a1814','On hold':'#b09444','Completed':'#1f9d55' }[col];
        return (
          <div key={col} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, paddingBottom: 10, borderBottom: `2px solid ${colColor}` }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink)' }}>{col}</span>
              <span style={{ fontSize: 11, background: 'var(--bg-elev)', color: 'var(--ink-3)', padding: '2px 8px', borderRadius: 999, fontWeight: 500 }}>{items.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 400 }}>
              {items.map(pr => {
                const p = getProperty(pr.propertyId), v = getVendor(pr.vendorId);
                const priCol = { Urgent: '#e74c3c', High: '#f39c12', Medium: '#3498db', Low: '#95a5a6' }[pr.priority];
                const subs = SUBPROJECTS.filter(s => s.parentId === pr.id);
                return (
                  <div key={pr.id} 
                    onClick={() => onOpen(pr.id)}
                    style={{
                      background: 'var(--bg-elev)',
                      border: '1px solid var(--line)',
                      borderRadius: 10,
                      padding: 12,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: 'none'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.borderColor = 'var(--ink-2)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--line)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: priCol }}/>
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{pr.priority}</span>
                      {pr.isLarge && <span style={{ fontSize: 9, background: 'var(--bg)', color: 'var(--ink-3)', padding: '2px 6px', borderRadius: 4 }}>Large</span>}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3, marginBottom: 8, color: 'var(--ink)' }}>
                      {pr.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginBottom: 10 }}>{p.name}</div>
                    <div className="progress-bar" style={{ marginBottom: 10, height: 4 }}>
                      <div style={{ width: pr.progress + '%', background: colColor }}/>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5, color: 'var(--ink-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--ink-2)', fontSize: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)' }}>
                          {v.company.charAt(0)}
                        </div>
                        <span>{v.company.split(' ')[0]}</span>
                      </div>
                      <span className="mono" style={{ fontSize: 9.5, color: 'var(--ink-4)' }}>{fmtCompact(pr.spent)}/{fmtCompact(pr.budget)}</span>
                    </div>
                  </div>
                );
              })}
              {items.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'center', padding: 20, opacity: 0.5 }}>No projects</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ----- Gantt (horizontal timeline) ----- */
function GanttViewV2({ rows, onOpen }) {
  const today = new Date(2026, 3, 19);
  const earliest = new Date(Math.min(...rows.map(r => new Date(r.start))));
  const latest = new Date(Math.max(...rows.map(r => new Date(r.end))));
  
  const monthStart = new Date(earliest);
  monthStart.setDate(1);
  const dayMs = 24*60*60*1000;
  const totalDays = Math.ceil((latest - monthStart) / dayMs) + 14;
  
  const pctForDate = (d) => {
    const days = (new Date(d) - monthStart) / dayMs;
    return Math.max(0, Math.min(100, (days / totalDays) * 100));
  };
  const todayPct = pctForDate(today);

  const flat = [];
  rows.forEach(p => {
    flat.push({ ...p, kind: 'project' });
    SUBPROJECTS.filter(s => s.parentId === p.id).forEach(s => {
      flat.push({ ...s, kind: 'sub', propertyId: p.propertyId });
    });
  });

  const statusColor = (s) => ({
    'Requested':'#6b665f','Scheduled':'#2b6fd6','In progress':'#1a1814',
    'On hold':'#b09444','Completed':'#1f9d55'
  })[s] || '#6b665f';

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
          <div style={{ padding: '10px 16px', borderRight: '1px solid var(--line)', fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project</div>
          <div style={{ padding: '10px 16px', fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</div>
        </div>
        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {flat.map((item, idx) => {
            const left = pctForDate(item.start);
            const right = pctForDate(item.end);
            const width = Math.max(2, right - left);
            const v = getVendor(item.vendorId);
            const isSubtask = item.kind === 'sub';
            
            return (
              <div key={item.id} style={{
                display: 'grid',
                gridTemplateColumns: '280px 1fr',
                borderBottom: '1px solid var(--line-2)',
                minHeight: isSubtask ? 36 : 44,
                background: isSubtask ? 'var(--bg)' : 'transparent'
              }}>
                <div style={{ padding: '10px 16px', borderRight: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  {isSubtask && <span style={{ color: 'var(--ink-4)', fontSize: 11 }}>↳</span>}
                  <span style={{ color: isSubtask ? 'var(--ink-3)' : 'var(--ink)', fontWeight: isSubtask ? 400 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </span>
                </div>
                <div style={{ position: 'relative', padding: '4px 0' }}>
                  <div style={{ position: 'absolute', left: todayPct + '%', top: 0, bottom: 0, width: 2, background: 'var(--accent)', zIndex: 1 }}/>
                  <div style={{
                    position: 'absolute',
                    left: left + '%',
                    top: isSubtask ? 8 : 6,
                    height: isSubtask ? 20 : 28,
                    width: width + '%',
                    background: statusColor(item.status),
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 8,
                    color: 'white',
                    fontSize: isSubtask ? 9 : 11,
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    opacity: 0.9,
                    transition: 'opacity 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.9'}
                  onClick={() => onOpen(isSubtask ? item.parentId : item.id)}
                  >
                    {item.progress > 0 && <div style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0, width: item.progress + '%',
                      background: 'rgba(255,255,255,0.25)'
                    }}/>}
                    <span style={{ position: 'relative' }}>
                      {isSubtask ? v.company.split(' ')[0] : item.title}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', fontSize: 10.5, color: 'var(--ink-4)', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: '#6b665f', borderRadius: 2, marginRight: 5 }}/>Requested</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: '#2b6fd6', borderRadius: 2, marginRight: 5 }}/>Scheduled</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: '#1a1814', borderRadius: 2, marginRight: 5 }}/>In progress</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: '#b09444', borderRadius: 2, marginRight: 5 }}/>On hold</span>
          <span><span style={{ display: 'inline-block', width: 8, height: 8, background: '#1f9d55', borderRadius: 2, marginRight: 5 }}/>Completed</span>
          <span style={{ marginLeft: 'auto' }}><span style={{ display: 'inline-block', width: 8, height: 2, background: 'var(--accent)', marginRight: 5, verticalAlign: 'middle' }}/>Today</span>
        </div>
      </div>
    </div>
  );
}

/* ----- Calendar (week view like Google Calendar) ----- */
function CalendarViewV2({ rows, onOpen }) {
  const today = new Date(2026, 3, 19); // Apr 19
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  
  const HOURS = Array.from({length: 12}, (_, i) => 8 + i); // 8 AM to 8 PM
  const dayMs = 24*60*60*1000;
  const eventsForDay = (day) => {
    const d = new Date(day);
    return rows.filter(p => {
      const s = new Date(p.start), e = new Date(p.end);
      return d >= s && d <= e;
    }).slice(0, 3);
  };
  const statusColor = (s) => ({
    'Requested':'#6b665f','Scheduled':'#2b6fd6','In progress':'#1a1814',
    'On hold':'#b09444','Completed':'#1f9d55'
  })[s];

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Week of {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][weekStart.getDay()]} {weekStart.toLocaleDateString()}</h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-ghost btn-sm">‹ Prev</button>
          <button className="btn btn-ghost btn-sm">Today</button>
          <button className="btn btn-ghost btn-sm">Next ›</button>
        </div>
      </div>
      
      <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden' }}>
        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '80px ' + days.map(() => '1fr').join(' '), borderBottom: '1px solid var(--line)', background: 'var(--bg)' }}>
          <div/>
          {days.map((d, i) => {
            const dayName = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
            const isToday = d.getTime() === today.getTime();
            return (
              <div key={i} style={{
                padding: '12px 8px',
                textAlign: 'center',
                fontSize: 12,
                fontWeight: 600,
                color: isToday ? 'var(--accent)' : 'var(--ink-3)',
                borderRight: i < 6 ? '1px solid var(--line-2)' : 'none'
              }}>
                <div style={{ fontSize: 11, color: isToday ? 'var(--accent)' : 'var(--ink-4)' }}>{dayName}</div>
                <div style={{
                  fontSize: 16,
                  fontWeight: isToday ? 700 : 600,
                  background: isToday ? 'var(--accent)' : 'transparent',
                  color: isToday ? 'white' : 'var(--ink)',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '4px auto 0'
                }}>
                  {d.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hour rows */}
        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {HOURS.map(h => (
            <div key={h} style={{ display: 'grid', gridTemplateColumns: '80px ' + days.map(() => '1fr').join(' '), minHeight: 60, borderBottom: '1px solid var(--line-2)' }}>
              <div style={{ padding: '8px 12px', fontSize: 11, color: 'var(--ink-4)', borderRight: '1px solid var(--line-2)', display: 'flex', alignItems: 'flex-start' }}>
                {h % 12 === 0 ? 12 : h % 12}{h >= 12 ? 'p' : 'a'}
              </div>
              {days.map((d, i) => {
                const cellEvents = eventsForDay(d).slice(0, 2);
                return (
                  <div key={i} style={{
                    padding: '4px',
                    borderRight: i < 6 ? '1px solid var(--line-2)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    {cellEvents.map((ev, ei) => (
                      <div key={ei}
                        onClick={() => onOpen(ev.id)}
                        style={{
                          background: statusColor(ev.status),
                          color: 'white',
                          padding: '4px 6px',
                          borderRadius: 4,
                          fontSize: 9.5,
                          fontWeight: 500,
                          cursor: 'pointer',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          opacity: 0.85,
                          transition: 'opacity 0.15s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={e => e.currentTarget.style.opacity = '0.85'}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----- Table ----- */
function TableView({ rows, onOpen, sort, toggleSort }) {
  const Th = ({ k, children, right }) => (
    <th onClick={() => toggleSort(k)} style={{ cursor: 'pointer', userSelect: 'none', textAlign: right ? 'right' : 'left' }}>
      {children} {sort.key === k ? <span style={{ color: 'var(--ink-2)' }}>{sort.dir === 'asc' ? '↑' : '↓'}</span> : <span style={{ opacity: 0.3 }}>↕</span>}
    </th>
  );
  return (
    <div className="panel">
      <table className="data-table">
        <thead>
          <tr>
            <Th k="title">Project</Th>
            <Th k="propertyId">Property</Th>
            <Th k="status">Status</Th>
            <Th k="priority">Priority</Th>
            <Th k="vendorId">Vendor</Th>
            <Th k="start">Start</Th>
            <Th k="due">Due</Th>
            <Th k="budget" right>Budget</Th>
            <Th k="spent" right>Spent</Th>
            <Th k="markup" right>Markup</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map(pr => {
            const p = getProperty(pr.propertyId), v = getVendor(pr.vendorId);
            const pri = { Urgent: 'red', High: 'yellow', Medium: 'blue', Low: 'gray' }[pr.priority];
            const stCol = { 'Completed':'green','In progress':'gray','Scheduled':'blue','On hold':'yellow','Requested':'gray' }[pr.status];
            const pct = Math.round(pr.spent/pr.budget*100);
            return (
              <tr key={pr.id} onClick={() => onOpen(pr.id)} style={{ cursor: 'pointer' }}>
                <td><strong>{pr.title}</strong>{pr.isLarge && <span className="pill gray" style={{ marginLeft: 8, fontSize: 10 }}>LARGE</span>}</td>
                <td className="muted">{p.name}</td>
                <td><span className={"pill " + stCol}><span className="dot"/>{pr.status}</span></td>
                <td><span className={"pill " + pri}>{pr.priority}</span></td>
                <td className="muted">{v.company}</td>
                <td className="muted">{pr.start}</td>
                <td className="muted">{pr.due}</td>
                <td style={{ textAlign: 'right' }}>{fmt(pr.budget)}</td>
                <td style={{ textAlign: 'right', color: pct > 90 ? 'var(--red)' : 'var(--ink)' }}>{fmt(pr.spent)} <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>({pct}%)</span></td>
                <td style={{ textAlign: 'right' }}>{pr.markup}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ----- Project detail sheet ----- */
function ProjectSheet({ projectId, onClose }) {
  const pr = PROJECTS.find(p => p.id === projectId);
  const p = getProperty(pr.propertyId);
  const v = getVendor(pr.vendorId);
  const subs = SUBPROJECTS.filter(s => s.parentId === pr.id);
  const expenses = EXPENSES.filter(e => e.projectId === pr.id);
  const totalBilled = expenses.reduce((a, e) => a + e.billed, 0);
  const totalCost = expenses.reduce((a, e) => a + e.amount, 0);
  const markupAmt = totalBilled - totalCost;
  const pri = { Urgent: 'red', High: 'yellow', Medium: 'blue', Low: 'gray' }[pr.priority];
  const stCol = { 'Completed':'green','In progress':'gray','Scheduled':'blue','On hold':'yellow','Requested':'gray' }[pr.status];

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="proj-sheet" onClick={e => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose}><Icon name="x" size={14}/></button>
        <div className="proj-sheet-head">
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <span className={"pill " + stCol}><span className="dot"/>{pr.status}</span>
            <span className={"pill " + pri}>{pr.priority}</span>
            {pr.isLarge && <span className="pill gray">LARGE RENOVATION · {subs.length} sub-projects</span>}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{pr.title}</h2>
          <div className="sub-detail" style={{ fontSize: 13.5 }}>{p.name} · {p.address} · {v.company}</div>
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Budget utilization</span>
              <span className="sub-detail">{fmt(pr.spent)} of {fmt(pr.budget)} · {Math.round(pr.spent/pr.budget*100)}% spent · {pr.markup}% markup</span>
            </div>
            <div className="budget-bar">
              <div className="seg-cost" style={{ width: (totalCost/pr.budget*100) + '%' }}/>
              <div className="seg-markup" style={{ width: (markupAmt/pr.budget*100) + '%' }}/>
              <div className="seg-remaining"/>
            </div>
            <div style={{ display: 'flex', gap: 18, fontSize: 11.5, marginTop: 8, color: 'var(--ink-3)' }}>
              <span><span style={{ display:'inline-block', width:10, height:10, background:'var(--ink)', borderRadius:3, marginRight:6 }}/>Vendor cost {fmt(totalCost)}</span>
              <span><span style={{ display:'inline-block', width:10, height:10, background:'var(--accent)', borderRadius:3, marginRight:6 }}/>Canary markup {fmt(markupAmt)}</span>
              <span style={{ marginLeft: 'auto' }}>Client bill: <strong style={{ color: 'var(--ink)' }}>{fmt(totalBilled)}</strong></span>
            </div>
          </div>
        </div>
        <div className="proj-sheet-body">
          <div>
            {subs.length > 0 && (<>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15 }}>Sub-projects</h3>
                <button className="btn btn-ghost btn-sm"><Icon name="plus" size={12}/> Add sub-project</button>
              </div>
              <div className="panel" style={{ marginBottom: 24 }}>
                <table className="data-table">
                  <thead><tr><th>Phase</th><th>Vendor</th><th>Status</th><th>Dates</th><th style={{textAlign:'right'}}>Spent / Budget</th></tr></thead>
                  <tbody>
                    {subs.map(s => {
                      const sv = getVendor(s.vendorId);
                      const sCol = { 'Completed':'green','In progress':'gray','Scheduled':'blue','Requested':'gray' }[s.status];
                      return (
                        <tr key={s.id}>
                          <td><strong>{s.title}</strong>
                            <div className="progress-bar" style={{ marginTop: 6, width: 180 }}><div style={{ width: s.progress + '%' }}/></div>
                          </td>
                          <td className="muted">{sv.company}</td>
                          <td><span className={"pill " + sCol}><span className="dot"/>{s.status}</span></td>
                          <td className="muted">{s.start} → {s.end}</td>
                          <td style={{ textAlign: 'right' }}>{fmt(s.spent)} / {fmt(s.budget)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>)}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ fontSize: 15 }}>Expenses &amp; charges</h3>
              <button className="btn btn-ghost btn-sm"><Icon name="plus" size={12}/> Log expense</button>
            </div>
            <div className="panel">
              <table className="data-table">
                <thead><tr><th>Date</th><th>Account</th><th>Description</th><th>Vendor</th><th style={{textAlign:'right'}}>Cost</th><th style={{textAlign:'right'}}>+Markup</th><th style={{textAlign:'right'}}>Billed</th><th>Status</th></tr></thead>
                <tbody>
                  {expenses.map(e => {
                    const ev = getVendor(e.vendorId);
                    return (
                      <tr key={e.id}>
                        <td className="muted mono" style={{ fontSize: 12 }}>{e.date}</td>
                        <td><span className="tag">{e.account}</span></td>
                        <td>{e.description}</td>
                        <td className="muted">{ev.company}</td>
                        <td style={{ textAlign: 'right' }}>{fmt(e.amount)}</td>
                        <td style={{ textAlign: 'right', color: 'var(--accent-ink)' }}>+{e.markup}%</td>
                        <td style={{ textAlign: 'right', fontWeight: 500 }}>{fmt(Math.round(e.billed))}</td>
                        <td><span className={"pill " + (e.status === 'Billed' ? 'green' : e.status === 'Approved' ? 'blue' : 'yellow')}><span className="dot"/>{e.status}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background: 'var(--bg)', fontWeight: 600 }}>
                    <td colSpan="4">Totals ({expenses.length} line items)</td>
                    <td style={{ textAlign: 'right' }}>{fmt(totalCost)}</td>
                    <td style={{ textAlign: 'right', color: 'var(--accent-ink)' }}>{fmt(Math.round(markupAmt))}</td>
                    <td style={{ textAlign: 'right' }}>{fmt(Math.round(totalBilled))}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div>
            <div className="panel" style={{ padding: 16 }}>
              <h4 style={{ fontSize: 13, marginBottom: 10 }}>Details</h4>
              <div style={{ fontSize: 13 }}>
                <DetailRow label="Property" val={p.name}/>
                <DetailRow label="Owner" val={getClient(p.ownerId).name}/>
                <DetailRow label="Vendor" val={v.company}/>
                <DetailRow label="Start" val={pr.start}/>
                <DetailRow label="Due" val={pr.due}/>
                <DetailRow label="Created" val={pr.created}/>
                <DetailRow label="Markup" val={`${pr.markup}% (editable)`}/>
              </div>
            </div>
            <div className="panel" style={{ padding: 16, marginTop: 12 }}>
              <h4 style={{ fontSize: 13, marginBottom: 10 }}>Activity</h4>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
                <div style={{ padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                  <div>Expense logged · $840 (Materials)</div>
                  <div className="sub-detail mono">3h ago · Aidan Flynn</div>
                </div>
                <div style={{ padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                  <div>Vendor accepted quote</div>
                  <div className="sub-detail mono">yesterday · {v.company}</div>
                </div>
                <div style={{ padding: '6px 0' }}>
                  <div>Project created</div>
                  <div className="sub-detail mono">{pr.created}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, val }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
      <span className="muted">{label}</span>
      <span style={{ textAlign: 'right' }}>{val}</span>
    </div>
  );
}

Object.assign(window, { ProjectsViewV2 });
