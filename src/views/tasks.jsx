import React from 'react';
import { Icon, PhotoPlaceholder } from '../ui.jsx';
import { getProperty } from '../data.js';

/* ---------- Seed data ---------- */
const TASKS = [
  { id:'tk1',  propertyId:'p1',  type:'Cleaning',    status:'Completed',  due:'3 hours ago',      dueOrder:-3,   sameDay:false, assignee:'Aaron' },
  { id:'tk2',  propertyId:'p3',  type:'Cleaning',    status:'Accepted',   due:'In 13 hours',      dueOrder:13,   sameDay:false, assignee:'Linda' },
  { id:'tk3',  propertyId:'p7',  type:'Cleaning',    status:'Unassigned', due:'In 1 day',         dueOrder:24,   sameDay:true,  assignee:null },
  { id:'tk4',  propertyId:'p11', type:'Cleaning',    status:'Unassigned', due:'In 3 days',        dueOrder:72,   sameDay:true,  assignee:null },
  { id:'tk5',  propertyId:'p4',  type:'Cleaning',    status:'Accepted',   due:'In 3 days',        dueOrder:72,   sameDay:false, assignee:'Edelyn' },
  { id:'tk6',  propertyId:'p6',  type:'Cleaning',    status:'Accepted',   due:'May 14, 11:15 AM', dueOrder:120,  sameDay:false, assignee:'Edelyn' },
  { id:'tk7',  propertyId:'p9',  type:'Cleaning',    status:'Accepted',   due:'May 16, 11:15 AM', dueOrder:168,  sameDay:true,  assignee:'Edelyn' },
  { id:'tk8',  propertyId:'p2',  type:'Mid-stay',    status:'Unassigned', due:'May 18, 9:00 AM',  dueOrder:216,  sameDay:false, assignee:null },
  { id:'tk9',  propertyId:'p13', type:'Maintenance', status:'In progress',due:'Now',              dueOrder:0,    sameDay:false, assignee:'Conor' },
  { id:'tk10', propertyId:'p5',  type:'Inspection',  status:'Accepted',   due:'May 20, 2:00 PM',  dueOrder:264,  sameDay:false, assignee:'Aaron' },
  { id:'tk11', propertyId:'p8',  type:'Cleaning',    status:'Unassigned', due:'May 21, 11:00 AM', dueOrder:288,  sameDay:false, assignee:null },
  { id:'tk12', propertyId:'p15', type:'Restock',     status:'Accepted',   due:'May 22, 10:00 AM', dueOrder:312,  sameDay:false, assignee:'Linda' },
  { id:'tk13', propertyId:'p10', type:'Cleaning',    status:'Unassigned', due:'May 23, 11:00 AM', dueOrder:336,  sameDay:true,  assignee:null },
  { id:'tk14', propertyId:'p12', type:'Maintenance', status:'In progress',due:'Started 2h ago',   dueOrder:-2,   sameDay:false, assignee:'Conor' },
  { id:'tk15', propertyId:'p14', type:'Cleaning',    status:'Accepted',   due:'May 24, 11:00 AM', dueOrder:360,  sameDay:false, assignee:'Edelyn' },
  { id:'tk16', propertyId:'p1',  type:'Cleaning',    status:'Completed',  due:'Yesterday',        dueOrder:-24,  sameDay:false, assignee:'Aaron' },
  { id:'tk17', propertyId:'p4',  type:'Inspection',  status:'Completed',  due:'2 days ago',       dueOrder:-48,  sameDay:false, assignee:'Aaron' },
  { id:'tk18', propertyId:'p6',  type:'Cleaning',    status:'Completed',  due:'3 days ago',       dueOrder:-72,  sameDay:false, assignee:'Linda' },
];

function taskPill(status) {
  switch (status) {
    case 'Completed':    return <span className="pill green"><span className="dot"/>Completed</span>;
    case 'Accepted':     return <span className="pill green"><span className="dot"/>Accepted</span>;
    case 'In progress':  return <span className="pill blue"><span className="dot"/>In progress</span>;
    case 'Unassigned':   return <span className="pill red"><span className="dot"/>Unassigned</span>;
    default:             return <span className="pill gray">{status}</span>;
  }
}

function TaskOverviewCards({ upcomingCount, attentionCount }) {
  const week = [1, 2, 1, 0, 2, 1, 1];
  const max = Math.max(...week, 1);
  const dayLabels = ['M','T','W','T','F','S','S'];

  return (
    <div className="task-overview-row">
      <div className="task-stat-card">
        <div className="task-stat-head">
          <div>
            <div className="task-stat-label">Upcoming tasks</div>
            <div className="task-stat-sub">Scheduled in the next 7 days</div>
          </div>
          <span className="task-stat-icon"><Icon name="calendar" size={15}/></span>
        </div>
        <div className="task-stat-bottom">
          <div className="task-stat-value">{upcomingCount}</div>
          <div className="task-week-bars">
            {week.map((v, i) => (
              <div className="task-week-col" key={i}>
                <div className="task-week-bar" style={{ height: (8 + (v/max) * 32) + 'px', opacity: v ? 1 : 0.25 }}/>
                <div className="task-week-day">{dayLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={"task-stat-card attention" + (attentionCount > 0 ? ' alert' : '')}>
        <div className="task-stat-head">
          <div>
            <div className="task-stat-label">Tasks that need attention</div>
            <div className="task-stat-sub">Unassigned or need reassignment</div>
          </div>
          <span className={"task-stat-icon" + (attentionCount > 0 ? ' alert' : '')}><Icon name="bell" size={15}/></span>
        </div>
        <div className="task-stat-bottom">
          <div className="task-stat-value">{attentionCount}</div>
          <button className="btn btn-primary btn-sm task-stat-cta">
            Review queue <Icon name="arrow_right" size={12}/>
          </button>
        </div>
      </div>
    </div>
  );
}

function TaskCollapsedBar({ unassigned, total, onOpen }) {
  const previewProps = unassigned.slice(0, 2).map(t => getProperty(t.propertyId));
  return (
    <button className="task-collapsed-bar" onClick={onOpen}>
      <div className="task-collapsed-left">
        <div className="task-collapsed-title-wrap">
          <h3>All tasks</h3>
          <span className="task-collapsed-count">{total}</span>
        </div>
        <div className="task-collapsed-sub">Cleaning, maintenance, and property tasks across your portfolio</div>
      </div>
      <div className="task-collapsed-right">
        {unassigned.length > 0 ? (
          <div className="task-attn-cluster">
            <div className="task-attn-pill">
              <span className="task-attn-pulse"/>
              <strong>{unassigned.length} unassigned</strong>
              <span className="task-attn-divider"/>
              <span className="task-attn-preview">
                {previewProps.map((p, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="task-attn-sep">·</span>}
                    {p?.name || '—'}
                  </React.Fragment>
                ))}
                {unassigned.length > 2 && <span className="task-attn-more">+{unassigned.length - 2}</span>}
              </span>
            </div>
          </div>
        ) : (
          <span className="pill green"><span className="dot"/>All assigned</span>
        )}
        <span className="task-chevron"><Icon name="arrow_right" size={14}/></span>
      </div>
    </button>
  );
}

function TaskExpanded({ tasks, onClose, source, fetchedAt }) {
  const [tab, setTab] = React.useState('upcoming');

  const buckets = {
    needs:    tasks.filter(t => t.status === 'Unassigned'),
    progress: tasks.filter(t => t.status === 'In progress'),
    upcoming: tasks.filter(t => ['Accepted','Unassigned','In progress'].includes(t.status) && t.dueOrder >= -2)
                   .sort((a, b) => a.dueOrder - b.dueOrder),
    past:     tasks.filter(t => t.status === 'Completed').sort((a, b) => a.dueOrder - b.dueOrder),
  };

  const TABS = [
    { key:'needs',    label:'Needs action', count: buckets.needs.length,    alert: buckets.needs.length > 0 },
    { key:'progress', label:'In progress',  count: buckets.progress.length, alert: false },
    { key:'upcoming', label:'Upcoming',     count: buckets.upcoming.length, alert: false },
    { key:'past',     label:'Past',         count: buckets.past.length,     alert: false },
  ];

  const rows = buckets[tab] || [];

  return (
    <div className="task-expanded">
      <div className="task-expanded-head">
        <div>
          <h3>All tasks</h3>
          <div className="sub-detail" style={{ marginTop: 2 }}>
            Manage cleaning, maintenance, and property tasks in one place.
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
          <button className="btn btn-ghost btn-sm">+ New task rule</button>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            <Icon name="x" size={12}/> Collapse
          </button>
        </div>
      </div>

      <div className="task-tabs">
        {TABS.map(t => (
          <button
            key={t.key}
            className={"task-tab" + (tab === t.key ? ' active' : '') + (t.alert ? ' alert' : '')}
            onClick={() => setTab(t.key)}
          >
            <span className="task-tab-label">{t.label}</span>
            <span className={"task-tab-count" + (t.alert ? ' alert' : '')}>{t.count}</span>
          </button>
        ))}
      </div>

      <div className="task-table-wrap">
        <table className="data-table task-table">
          <thead>
            <tr>
              <th style={{ width: 150 }}>Date</th>
              <th>Property</th>
              <th style={{ width: 200 }}>Task</th>
              <th style={{ width: 140 }}>Status</th>
              <th style={{ width: 130 }}>Assignee</th>
              <th style={{ width: 100, textAlign:'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={6} className="task-empty">No tasks in this view.</td></tr>
            )}
            {rows.map(t => {
              const p = getProperty(t.propertyId);
              return (
                <tr key={t.id} className={t.status === 'Unassigned' ? 'task-row-attn' : ''}>
                  <td className="muted">{t.due}</td>
                  <td>
                    <div className="cell-name task-cell-prop">
                      <div className="task-prop-thumb">
                        <PhotoPlaceholder seed={p?.photoSeed || 0}/>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="task-prop-name">{p?.name || '—'}</div>
                        <div className="sub-detail task-prop-addr">{p?.address || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                      <span style={{ fontWeight: 500 }}>{t.type}</span>
                      {t.sameDay && <span className="pill yellow" style={{ fontSize: 10.5 }}>Same-day</span>}
                    </div>
                  </td>
                  <td>{taskPill(t.status)}</td>
                  <td className={t.assignee ? '' : 'muted'}>{t.assignee || 'None'}</td>
                  <td style={{ textAlign:'right' }}>
                    {t.status === 'Unassigned'
                      ? <button className="btn btn-accent btn-sm">Assign</button>
                      : <button className="btn btn-ghost btn-sm">Open</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="task-expanded-foot">
        <div className="sub-detail">
          Connected to <strong style={{ color:'var(--ink)' }}>Hospitable</strong> · Reservations sync every 5 min
          {source === 'live'
            ? <span className="pill green" style={{ marginLeft: 10 }}><span className="dot"/>Live</span>
            : <span className="pill gray" style={{ marginLeft: 10 }}>Sample data</span>}
        </div>
        <button className="btn btn-ghost btn-sm">View all tasks →</button>
      </div>
    </div>
  );
}

function ConnectionBadge({ source, loading, error, fetchedAt, onReload }) {
  let label, cls;
  if (loading) {
    label = 'Connecting to Hospitable…';
    cls = 'task-conn loading';
  } else if (source === 'live') {
    const t = fetchedAt ? new Date(fetchedAt) : null;
    const ago = t ? timeAgo(t) : '';
    label = `Live · synced ${ago}`;
    cls = 'task-conn live';
  } else {
    label = 'Offline · sample data';
    cls = 'task-conn offline';
  }
  return (
    <span className={cls}>
      <span className="task-conn-dot"/>
      {label}
      {!loading && (
        <button className="task-conn-reload" onClick={onReload} aria-label="Retry">↻</button>
      )}
    </span>
  );
}

function timeAgo(d) {
  const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return d.toLocaleDateString();
}

const HOSPITABLE_PROXY = 'https://canary-dashboard-kappa.vercel.app/api/hospitable/tasks';

function useHospitableTasks() {
  const [state, setState] = React.useState({
    tasks: TASKS,
    source: 'sample',
    loading: true,
    error: null,
    fetchedAt: null,
  });

  const load = React.useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const r = await fetch(HOSPITABLE_PROXY, { headers: { 'Accept': 'application/json' } });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const json = await r.json();
      const live = Array.isArray(json?.tasks) ? json.tasks : [];
      if (live.length === 0) throw new Error('Empty response');
      setState({
        tasks: live,
        source: 'live',
        loading: false,
        error: null,
        fetchedAt: json?.meta?.fetchedAt || new Date().toISOString(),
      });
    } catch {
      setState({
        tasks: TASKS,
        source: 'sample',
        loading: false,
        error: null,
        fetchedAt: null,
      });
    }
  }, []);

  React.useEffect(() => { load(); }, [load]);
  return { ...state, reload: load };
}

export function TasksSection() {
  const [expanded, setExpanded] = React.useState(false);
  const { tasks, source, loading, fetchedAt, reload } = useHospitableTasks();

  const unassigned = tasks.filter(t => t.status === 'Unassigned');
  const upcomingCount = tasks.filter(t =>
    ['Accepted','Unassigned'].includes(t.status) && t.dueOrder > 0 && t.dueOrder <= 168
  ).length;
  const attentionCount = unassigned.length + (source === 'live' ? 0 : 48);

  return (
    <div className="tasks-section">
      <div className="tasks-section-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 4, fontSize: 11, display:'flex', alignItems:'center', gap: 8 }}>
            OPERATIONS · TODAY
            <ConnectionBadge source={source} loading={loading} fetchedAt={fetchedAt} onReload={reload}/>
          </div>
          <h2 className="tasks-section-title">Tasks</h2>
          <div className="tasks-section-sub">
            Stay on top of cleaning, maintenance, and turnover across every property.
          </div>
        </div>
        <button className="btn btn-primary btn-sm">
          <Icon name="plus" size={12}/> Add task rule
        </button>
      </div>

      <TaskOverviewCards upcomingCount={upcomingCount} attentionCount={attentionCount}/>

      <div className={"task-list-shell" + (expanded ? ' open' : '')}>
        {!expanded
          ? <TaskCollapsedBar unassigned={unassigned} total={tasks.length} onOpen={() => setExpanded(true)}/>
          : <TaskExpanded tasks={tasks} onClose={() => setExpanded(false)} source={source} fetchedAt={fetchedAt}/>
        }
      </div>
    </div>
  );
}
