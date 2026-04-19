/* Manager views — dashboard + all record sections */

function ManagerViews({ section, setSection }) {
  if (section === 'dashboard') return <ManagerDashboard/>;
  if (section === 'people') return <PeopleView/>;
  if (section === 'properties') return <PropertiesView/>;
  if (section === 'portfolios') return <PortfoliosView/>;
  if (section === 'leases') return <LeasesView/>;
  if (section === 'projects') return <ProjectsViewV2/>;
  if (section === 'payments') return <PaymentsView/>;
  if (section === 'listings') return <ListingsAdminView/>;
  if (section === 'inbox') return <InboxView/>;
  if (section === 'reports') return <ReportsView/>;
  return <ManagerDashboard/>;
}

function ManagerDashboard() {
  const MONTHS = ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  const REV = [48,51,52,55,56,58,56,58,57,60,58,62].map(v => v*10000);
  return (
    <>
      <Topbar title="Good morning, Aidan 👋" crumbs="Dashboard"
        actions={<button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> New</button>}/>
      <div className="app-content">
        <div className="kpi-row">
          <KpiCard label="Rent collected (April)" value="$612,480" delta="+4.1%" up spark={[52,55,54,58,56,60,58,62]}/>
          <KpiCard label="Occupancy" value="92.0%" delta="+1.4 pts" up spark={[88,89,88,90,91,91,92,92]}/>
          <KpiCard label="Open work orders" value="14" delta="-3" up spark={[22,20,19,18,17,17,15,14]}/>
          <KpiCard label="Overdue balances" value="$3,280" delta="+$820" spark={[1.4,1.6,1.2,1.0,2.1,2.4,2.4,3.3]}/>
        </div>

        <div className="dash-grid">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h3>Cash flow</h3>
                <div className="meta">Rent vs. operating expenses · last 12 months</div>
              </div>
              <div className="segmented">
                <button>3M</button><button className="active">12M</button><button>YTD</button><button>All</button>
              </div>
            </div>
            <div className="panel-body">
              <LineChart height={220} labels={MONTHS}
                series={[
                  { color: '#1a1814', data: REV },
                  { color: '#F5C518', data: REV.map(v => v * (0.28 + Math.random()*0.05)) },
                ]}/>
              <div style={{ display: 'flex', gap: 24, marginTop: 10, fontSize: 13, color: 'var(--ink-3)' }}>
                <span><span style={{display:'inline-block', width:10, height:10, background:'#1a1814', borderRadius:3, marginRight:6}}/>Revenue</span>
                <span><span style={{display:'inline-block', width:10, height:10, background:'#F5C518', borderRadius:3, marginRight:6}}/>Expenses</span>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Activity</h3>
              <span className="meta">Live</span>
            </div>
            <div className="panel-body" style={{ paddingTop: 6, paddingBottom: 6, maxHeight: 340, overflowY: 'auto' }}>
              {ACTIVITY.map((a, i) => (
                <div className="activity-item" key={i}>
                  <span className="dot-type" style={{ background: a.color }}/>
                  <div style={{ flex: 1 }}>
                    <div>{a.text}</div>
                    <div className="time">{a.time} ago</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-grid-2">
          <div className="panel">
            <div className="panel-head">
              <h3>Portfolio mix</h3>
              <span className="meta">By door count</span>
            </div>
            <div className="panel-body">
              <div className="donut-wrap">
                <Donut size={150} total={PROPERTIES.length} segments={[
                  { color: '#1a1814', value: PROPERTIES.filter(p => p.type === 'Single Family').length },
                  { color: '#F5C518', value: PROPERTIES.filter(p => p.type === 'Multi-Family').length },
                  { color: '#6b665f', value: PROPERTIES.filter(p => p.type === 'Commercial').length },
                ]}/>
                <div className="donut-legend">
                  <div className="row"><span className="sw" style={{background:'#1a1814'}}/>Single family · {PROPERTIES.filter(p => p.type === 'Single Family').length}</div>
                  <div className="row"><span className="sw" style={{background:'#F5C518'}}/>Multi-family · {PROPERTIES.filter(p => p.type === 'Multi-Family').length}</div>
                  <div className="row"><span className="sw" style={{background:'#6b665f'}}/>Commercial · {PROPERTIES.filter(p => p.type === 'Commercial').length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Upcoming renewals</h3>
              <span className="meta">Next 60 days</span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              {LEASES.slice(0, 5).map(l => {
                const t = getTenant(l.tenantId), p = getProperty(l.propertyId);
                return (
                  <div key={l.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar size-sm">{t.initials}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.name}</div>
                      <div className="sub-detail">{p.name}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--ink-3)' }}>
                      <div>{l.end}</div>
                      <span className="pill yellow" style={{ marginTop: 2 }}>Renew</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h3>Maintenance backlog</h3>
              <span className="meta">By priority</span>
            </div>
            <div className="panel-body">
              <BarChart height={160} labels={['Low','Med','High','Urg','New']}
                data={[
                  PROJECTS.filter(p=>p.priority==='Low').length,
                  PROJECTS.filter(p=>p.priority==='Medium').length,
                  PROJECTS.filter(p=>p.priority==='High').length,
                  PROJECTS.filter(p=>p.priority==='Urgent').length,
                  3
                ]}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 12, color: 'var(--ink-3)' }}>
                <span>Median resolution</span>
                <span style={{ fontWeight: 600, color: 'var(--ink)' }}>1.8 days</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <div className="panel">
            <div className="panel-head">
              <h3>Rent roll — April 2026</h3>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span className="pill green"><span className="dot"/>93% collected</span>
                <button className="btn btn-ghost btn-sm">Export CSV</button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tenant</th><th>Property</th><th>Due</th><th>Amount</th><th>Status</th><th>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {LEASES.slice(0, 8).map(l => {
                    const t = getTenant(l.tenantId), p = getProperty(l.propertyId);
                    const pill = l.balance > 0
                      ? <span className="pill red"><span className="dot"/>Overdue</span>
                      : <span className="pill green"><span className="dot"/>Paid</span>;
                    return (
                      <tr key={l.id}>
                        <td><div className="cell-name"><div className="avatar size-sm">{t.initials}</div>{t.name}</div></td>
                        <td className="muted">{p.name}</td>
                        <td className="muted">Apr 1</td>
                        <td>{fmt(l.rent)}</td>
                        <td>{pill}</td>
                        <td className={l.balance > 0 ? '' : 'muted'}>{l.balance > 0 ? fmt(l.balance) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({ label, value, delta, up, spark }) {
  return (
    <div className="kpi-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && <div className={"delta " + (up ? 'up' : 'down')}>
        <Icon name={up ? 'arrow_up' : 'arrow_down'} size={11}/> {delta}
      </div>}
      {spark && <div className="spark"><Sparkline data={spark} color={up ? '#1f9d55' : '#d14343'} fill/></div>}
    </div>
  );
}

/* ---------- People ---------- */
function PeopleView() {
  const [tab, setTab] = React.useState('Clients');
  const rows = tab === 'Clients' ? CLIENTS : tab === 'Tenants' ? TENANTS : VENDORS;
  return (
    <>
      <Topbar title="People" crumbs="Records / People"
        actions={<button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> Add person</button>}/>
      <div className="app-content">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <div className="segmented">
            {['Clients','Tenants','Vendors'].map(t => (
              <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                {t} · {t === 'Clients' ? CLIENTS.length : t === 'Tenants' ? TENANTS.length : VENDORS.length}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-ghost btn-sm">Filter</button>
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
        <div className="panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>{tab === 'Vendors' ? 'Trade' : 'Role'}</th>
                <th>Email</th>
                <th>Phone</th>
                <th>{tab === 'Clients' ? 'Properties' : tab === 'Tenants' ? 'Lease' : 'Rating'}</th>
                <th>Since</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                let col5 = '';
                if (tab === 'Clients') col5 = PROPERTIES.filter(p => p.ownerId === r.id).length + ' properties';
                else if (tab === 'Tenants') {
                  const l = LEASES.find(l => l.tenantId === r.id);
                  col5 = l ? getProperty(l.propertyId).name : '—';
                } else col5 = '★ ' + r.rating;
                return (
                  <tr key={r.id}>
                    <td><div className="cell-name"><div className="avatar size-sm">{r.initials}</div>{r.name}{tab === 'Vendors' && <span className="sub-detail"> · {r.company}</span>}</div></td>
                    <td className="muted">{tab === 'Vendors' ? r.trade : r.role}</td>
                    <td className="muted">{r.email}</td>
                    <td className="muted">{r.phone}</td>
                    <td>{col5}</td>
                    <td className="muted">{r.since}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Properties ---------- */
function PropertiesView() {
  const [view, setView] = React.useState('grid');
  const [filter, setFilter] = React.useState('All');
  const rows = filter === 'All' ? PROPERTIES : PROPERTIES.filter(p => p.type === filter);
  return (
    <>
      <Topbar title="Properties" crumbs="Records / Properties"
        actions={<button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> Add property</button>}/>
      <div className="app-content">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <div className="segmented">
            {['All','Single Family','Multi-Family','Commercial'].map(t => (
              <button key={t} className={filter === t ? 'active' : ''} onClick={() => setFilter(t)}>{t}</button>
            ))}
          </div>
          <div style={{ flex: 1 }}/>
          <div className="segmented">
            <button className={view==='grid'?'active':''} onClick={() => setView('grid')}>Grid</button>
            <button className={view==='table'?'active':''} onClick={() => setView('table')}>Table</button>
          </div>
        </div>

        {view === 'grid' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {rows.map(p => (
              <div key={p.id} className="panel" style={{ cursor: 'pointer' }}>
                <div style={{ aspectRatio: '16/10' }}>
                  <PhotoPlaceholder seed={p.photoSeed} label={p.neighbourhood.toUpperCase()}/>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                    <span className="pill gray">{p.type.split(' ')[0]}</span>
                  </div>
                  <div className="sub-detail" style={{ marginTop: 2 }}>{p.address}</div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12, color: 'var(--ink-3)' }}>
                    <span>{p.units} {p.units > 1 ? 'units' : 'unit'}</span>
                    <span>{fmt(p.rent)}/mo</span>
                    <span style={{ marginLeft:'auto', color: p.occupancy === 'Vacant' ? 'var(--red)' : 'var(--green)' }}>
                      {p.occupancy === 'Occupied' ? '● Occupied' : p.occupancy === 'Vacant' ? '○ Vacant' : p.occupancy}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="panel">
            <table className="data-table">
              <thead><tr><th>Property</th><th>Type</th><th>Units</th><th>Rent</th><th>Occupancy</th><th>Owner</th><th>Listed</th></tr></thead>
              <tbody>
                {rows.map(p => (
                  <tr key={p.id}>
                    <td><div className="cell-name">{p.name} <span className="sub-detail">· {p.address}</span></div></td>
                    <td className="muted">{p.type}</td>
                    <td>{p.units}</td>
                    <td>{fmt(p.rent)}</td>
                    <td>{p.occupancy === 'Vacant' ? <span className="pill red"><span className="dot"/>Vacant</span> : <span className="pill green"><span className="dot"/>{p.occupancy}</span>}</td>
                    <td className="muted">{getClient(p.ownerId).name}</td>
                    <td>{p.listed ? <span className="pill yellow"><span className="dot"/>Live</span> : <span className="pill gray">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* ---------- Portfolios ---------- */
function PortfoliosView() {
  const [openId, setOpenId] = React.useState(null);
  return (
    <>
      <Topbar title="Portfolios" crumbs="Records / Portfolios"
        actions={<button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> New portfolio</button>}/>
      <div className="app-content">
        <div style={{ marginBottom: 16, color: 'var(--ink-3)', fontSize: 14, maxWidth: 760 }}>
          Each portfolio is a <strong style={{ color: 'var(--ink)' }}>digital client agreement</strong>. Set leasing, long-term, and short-term management fees once — Canary applies them automatically to every lease, payment, and statement under that portfolio.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {PORTFOLIOS.map(pf => {
            const props = pf.propertyIds.map(getProperty);
            const totalRent = props.reduce((a, p) => a + p.rent, 0);
            const doors = props.reduce((a, p) => a + p.units, 0);
            return (
              <div key={pf.id} className="panel" style={{ cursor: 'pointer' }} onClick={() => setOpenId(pf.id)}>
                <div className="panel-head">
                  <div>
                    <h3 style={{ fontSize: 16 }}>{pf.name}</h3>
                    <div className="sub-detail" style={{ marginTop: 2 }}>{pf.ownerIds.length} owner{pf.ownerIds.length > 1 ? 's' : ''} · {props.length} properties · {doors} doors · {pf.term} term</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{fmt(totalRent)}</div>
                    <div className="sub-detail">monthly roll</div>
                  </div>
                </div>
                <div className="panel-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                    <FeeTile label="Leasing" val={pf.fees.leasing + '%'} sub="of 1st month"/>
                    <FeeTile label="LT mgmt" val={pf.fees.ltm + '%'} sub="monthly rent"/>
                    <FeeTile label="ST mgmt" val={pf.fees.stm + '%'} sub="gross bookings"/>
                  </div>
                  <div style={{ display: 'flex', marginBottom: 12, gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div className="sub-detail" style={{ marginBottom: 6 }}>OWNERS</div>
                      <div style={{ display: 'flex' }}>
                        {pf.ownerIds.map((oid, i) => {
                          const o = getClient(oid);
                          return <div key={i} className="avatar" style={{ marginLeft: i ? -6 : 0, border: '2px solid var(--bg-elev)' }}>{o.initials}</div>;
                        })}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--ink-2)', marginTop: 8 }}>
                        {pf.ownerIds.map(getClient).map(o => o.name).join(', ')}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="sub-detail" style={{ marginBottom: 6 }}>OCCUPANCY</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>
                        {Math.round(props.filter(p => p.occupancy !== 'Vacant').length / props.length * 100)}%
                      </div>
                      <div className="progress-bar" style={{ marginTop: 6 }}>
                        <div style={{ width: Math.round(props.filter(p => p.occupancy !== 'Vacant').length / props.length * 100) + '%' }}/>
                      </div>
                    </div>
                  </div>
                  <div className="sub-detail" style={{ marginBottom: 6 }}>PROPERTIES</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap: 6 }}>
                    {props.map(p => <span key={p.id} className="tag" style={{ background: 'var(--bg)', padding: '4px 10px' }}>{p.name}</span>)}
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)' }}>
                    <span>Agreement signed {pf.signed}</span>
                    <span style={{ color: 'var(--ink)' }}>View agreement →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {openId && <PortfolioAgreementSheet pf={PORTFOLIOS.find(p => p.id === openId)} onClose={() => setOpenId(null)}/>}
    </>
  );
}

function FeeTile({ label, val, sub }) {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--line-2)', borderRadius: 8, padding: '10px 12px' }}>
      <div className="sub-detail" style={{ fontSize: 10, marginBottom: 3 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{val}</div>
      <div className="sub-detail" style={{ fontSize: 10.5 }}>{sub}</div>
    </div>
  );
}

function PortfolioAgreementSheet({ pf, onClose }) {
  const [fees, setFees] = React.useState(pf.fees);
  const props = pf.propertyIds.map(getProperty);
  const totalRent = props.reduce((a, p) => a + p.rent, 0);
  const monthlyMgmtFee = Math.round(totalRent * fees.ltm / 100);
  const leasingFee = Math.round(totalRent / props.length * fees.leasing / 100);

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="proj-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 820 }}>
        <button className="sheet-close" onClick={onClose}><Icon name="x" size={14}/></button>
        <div className="proj-sheet-head">
          <div className="sub-detail" style={{ marginBottom: 6 }}>MANAGEMENT AGREEMENT · {pf.term.toUpperCase()}</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{pf.name}</h2>
          <div className="sub-detail">Signed {pf.signed} · {pf.ownerIds.map(getClient).map(o => o.name).join(', ')}</div>
        </div>
        <div style={{ padding: '24px 32px 32px' }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Fee schedule</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            <FeeCard label="Leasing fee" value={fees.leasing} max={100} suffix="%" onChange={v => setFees({...fees, leasing: v})} help="% of first month's rent, charged once when a new tenant signs."/>
            <FeeCard label="Long-term mgmt" value={fees.ltm} min={5} max={12} suffix="%" onChange={v => setFees({...fees, ltm: v})} help="% of collected rent each month on active leases > 30 days."/>
            <FeeCard label="Short-term mgmt" value={fees.stm} min={15} max={25} suffix="%" onChange={v => setFees({...fees, stm: v})} help="% of gross bookings on Airbnb/VRBO-style rentals < 30 days."/>
          </div>

          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Monthly projection</h3>
          <div className="panel">
            <table className="data-table">
              <tbody>
                <tr><td>Gross monthly rent ({props.length} properties)</td><td style={{ textAlign: 'right' }} className="mono">{fmt(totalRent)}</td></tr>
                <tr><td>Long-term management fee ({fees.ltm}%)</td><td style={{ textAlign: 'right', color: 'var(--accent-ink)' }} className="mono">−{fmt(monthlyMgmtFee)}</td></tr>
                <tr><td>Avg. leasing fee (per new lease, {fees.leasing}% of 1st month)</td><td style={{ textAlign: 'right' }} className="mono muted">{fmt(leasingFee)}</td></tr>
                <tr style={{ background: 'var(--bg)', fontWeight: 600 }}><td>Net to owners</td><td style={{ textAlign: 'right' }} className="mono">{fmt(totalRent - monthlyMgmtFee)}</td></tr>
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: 15, margin: '24px 0 12px' }}>Covered properties</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {props.map(p => <span key={p.id} className="tag" style={{ background: 'var(--bg)', padding: '6px 12px' }}>{p.name} · {fmt(p.rent)}/mo</span>)}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm">View full PDF</button>
            <button className="btn btn-primary btn-sm">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeCard({ label, value, onChange, min = 0, max = 100, suffix = '%', help }) {
  return (
    <div className="fee-card">
      <div className="sub-detail" style={{ fontSize: 10.5, marginBottom: 4 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {value}<span style={{ fontSize: 18, color: 'var(--ink-3)' }}>{suffix}</span>
      </div>
      <input type="range" className="fee-slider" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-4)' }} className="mono">
        <span>{min}%</span><span>{max}%</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.4 }}>{help}</div>
    </div>
  );
}

/* ---------- Leases ---------- */
function LeasesView() {
  return (
    <>
      <Topbar title="Leases" crumbs="Records / Leases"
        actions={<button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> New lease</button>}/>
      <div className="app-content">
        <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <KpiCard label="Active leases" value={LEASES.filter(l => l.status === 'Active').length}/>
          <KpiCard label="Expiring in 60d" value="3" delta="Review" spark={[2,3,2,2,3,3,3,3]}/>
          <KpiCard label="Avg. term" value="12 mo"/>
          <KpiCard label="Renewal rate (TTM)" value="88%" delta="+2 pts" up/>
        </div>
        <div className="panel" style={{ marginTop: 14 }}>
          <div className="panel-head">
            <h3>All leases</h3>
            <div style={{ display:'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm">Filter</button>
              <button className="btn btn-ghost btn-sm">Export</button>
            </div>
          </div>
          <table className="data-table">
            <thead><tr><th>Tenant</th><th>Property</th><th>Term</th><th>Rent</th><th>Status</th><th>Balance</th></tr></thead>
            <tbody>
              {LEASES.map(l => {
                const t = getTenant(l.tenantId), p = getProperty(l.propertyId);
                return (
                  <tr key={l.id}>
                    <td><div className="cell-name"><div className="avatar size-sm">{t.initials}</div>{t.name}</div></td>
                    <td className="muted">{p.name} <span className="sub-detail">· {p.address}</span></td>
                    <td className="muted">{l.start} → {l.end}</td>
                    <td>{fmt(l.rent)}/mo</td>
                    <td>{l.status === 'Active' ? <span className="pill green"><span className="dot"/>Active</span> : l.status === 'Ending soon' ? <span className="pill yellow"><span className="dot"/>{l.status}</span> : <span className="pill blue"><span className="dot"/>{l.status}</span>}</td>
                    <td className={l.balance > 0 ? '' : 'muted'}>{l.balance > 0 ? fmt(l.balance) : '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Projects ---------- */
function ProjectsView() {
  const cols = ['Requested','Scheduled','In progress','On hold','Completed'];
  return (
    <>
      <Topbar title="Projects &amp; maintenance" crumbs="Operations / Projects"
        actions={<button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> New project</button>}/>
      <div className="app-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {cols.map(col => {
            const items = PROJECTS.filter(p => p.status === col);
            return (
              <div key={col} style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 10, padding: 12, minHeight: 300 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-2)' }}>{col}</div>
                  <span className="count" style={{ fontSize: 11, background: 'var(--bg)', padding: '2px 7px', borderRadius: 999, color: 'var(--ink-3)' }}>{items.length}</span>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {items.map(pr => {
                    const p = getProperty(pr.propertyId), v = getVendor(pr.vendorId);
                    const pri = { Urgent: 'red', High: 'yellow', Medium: 'blue', Low: 'gray' }[pr.priority];
                    return (
                      <div key={pr.id} style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8, padding: 10 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{pr.title}</div>
                          <span className={"pill " + pri} style={{ fontSize: 10, padding: '1px 6px' }}>{pr.priority}</span>
                        </div>
                        <div className="sub-detail" style={{ marginTop: 6, fontSize: 12 }}>{p.name}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 8 }}>
                          <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                            <div className="avatar size-sm" style={{ background:'var(--ink-2)' }}>{v.initials}</div>
                            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{v.company}</span>
                          </div>
                          <span className="mono" style={{ fontSize: 10.5, color: 'var(--ink-4)' }}>${pr.spent} / ${pr.budget}</span>
                        </div>
                      </div>
                    );
                  })}
                  {items.length === 0 && <div style={{ fontSize: 12, color: 'var(--ink-4)', textAlign: 'center', padding: 14 }}>None</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ---------- Payments ---------- */
function PaymentsView() {
  const recent = PAYMENTS.slice(-30).reverse();
  return (
    <>
      <Topbar title="Payments" crumbs="Operations / Payments"
        actions={<button className="btn btn-primary btn-sm">Run collection</button>}/>
      <div className="app-content">
        <div className="kpi-row">
          <KpiCard label="Collected this month" value="$612,480" delta="+4.1%" up spark={[52,55,54,58,56,60,58,62]}/>
          <KpiCard label="Outstanding" value="$3,280"/>
          <KpiCard label="Avg days to pay" value="0.8" delta="-0.3" up/>
          <KpiCard label="Payment methods" value="PAD · 78%"/>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14, marginTop: 14 }}>
          <div className="panel">
            <div className="panel-head"><h3>Collection by property type</h3><span className="meta">Last 6 months</span></div>
            <div className="panel-body">
              <BarChart height={180} labels={['Nov','Dec','Jan','Feb','Mar','Apr']} data={[58,57,60,59,61,62]}/>
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><h3>Method mix</h3></div>
            <div className="panel-body">
              <div className="donut-wrap">
                <Donut size={140} total="100%" segments={[
                  { color: '#1a1814', value: 78 },
                  { color: '#F5C518', value: 14 },
                  { color: '#6b665f', value: 8 },
                ]}/>
                <div className="donut-legend">
                  <div className="row"><span className="sw" style={{background:'#1a1814'}}/>Pre-auth debit · 78%</div>
                  <div className="row"><span className="sw" style={{background:'#F5C518'}}/>E-transfer · 14%</div>
                  <div className="row"><span className="sw" style={{background:'#6b665f'}}/>Credit card · 8%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="panel" style={{ marginTop: 14 }}>
          <div className="panel-head"><h3>Recent transactions</h3><button className="btn btn-ghost btn-sm">Export</button></div>
          <table className="data-table">
            <thead><tr><th>Date</th><th>Tenant</th><th>Property</th><th>Month</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              {recent.slice(0, 14).map(pay => {
                const t = getTenant(pay.tenantId), p = getProperty(pay.propertyId);
                const pill = pay.status === 'Paid' ? <span className="pill green"><span className="dot"/>Paid</span>
                  : pay.status === 'Pending' ? <span className="pill yellow"><span className="dot"/>Pending</span>
                  : pay.status === 'Overdue' ? <span className="pill red"><span className="dot"/>Overdue</span>
                  : <span className="pill blue"><span className="dot"/>Late</span>;
                return (
                  <tr key={pay.id}>
                    <td className="muted">{pay.date}</td>
                    <td><div className="cell-name"><div className="avatar size-sm">{t.initials}</div>{t.name}</div></td>
                    <td className="muted">{p.name}</td>
                    <td className="muted">{pay.month}</td>
                    <td>{fmt(pay.amount)}</td>
                    <td>{pill}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Listings (public) ---------- */
function ListingsAdminView() {
  return (
    <>
      <Topbar title="Public listings" crumbs="Operations / Listings"/>
      <div className="app-content">
        <div className="notice" style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🟡</span>
          <div>
            <strong>Connected to canary.pm/rentals</strong> — listings marked "Live" appear publicly. Tenant viewing requests flow to your Inbox.
          </div>
        </div>
        <div className="panel">
          <table className="data-table">
            <thead><tr><th>Property</th><th>Rent</th><th>Status</th><th>Photos</th><th>Views (7d)</th><th>Requests</th><th></th></tr></thead>
            <tbody>
              {PROPERTIES.filter(p => p.listed).map(p => (
                <tr key={p.id}>
                  <td><div className="cell-name">{p.name}<span className="sub-detail"> · {p.address}</span></div></td>
                  <td>{fmt(p.rent)}</td>
                  <td><span className="pill yellow"><span className="dot"/>Live</span></td>
                  <td className="muted">8 photos</td>
                  <td>{120 + (p.photoSeed * 17) % 400}</td>
                  <td>{(p.photoSeed * 3) % 12}</td>
                  <td><button className="btn btn-ghost btn-sm">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ---------- Inbox ---------- */
function InboxView() {
  const messages = [
    { from: 'Maeve Walsh', subject: 'Request: new dishwasher', preview: 'The one here started making a grinding sound — no leak, but...', time: '14m', unread: true, tag: 'Maintenance' },
    { from: 'Niamh Fitzpatrick', subject: 'Viewing: 42 Duckworth St', preview: 'Hi! I saw the Battery Heights listing. Available Saturday afternoon?', time: '1h', unread: true, tag: 'Viewing' },
    { from: 'Declan Murphy', subject: 'March statement — question', preview: 'Can you walk me through the line item on the Gower Heights entry?', time: '3h', unread: true, tag: 'Owner' },
    { from: 'Avalon Plumbing', subject: 'Quote: burst pipe repair', preview: 'Parts in, can start 8am Thursday. $840 all-in.', time: '5h', unread: true, tag: 'Vendor' },
    { from: 'Conor Doyle', subject: 'Re: April rent', preview: 'Hey, sorry for the delay — sending an e-transfer tonight.', time: '1d', unread: false, tag: 'Payment' },
    { from: 'Ciara Power', subject: 'Lease renewal', preview: 'Happy to sign for another year!', time: '2d', unread: false, tag: 'Lease' },
  ];
  return (
    <>
      <Topbar title="Inbox" crumbs="Overview / Inbox"/>
      <div className="app-content">
        <div className="panel">
          {messages.map((m, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-2)', display:'grid', gridTemplateColumns: '30px 180px 1fr 90px', alignItems:'center', gap: 14, background: m.unread ? 'var(--bg-elev)' : 'var(--bg)' }}>
              <div className="avatar size-sm">{initials(m.from)}</div>
              <div style={{ fontWeight: m.unread ? 600 : 500, fontSize: 13.5 }}>{m.from}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                <span className={"pill " + (m.tag === 'Viewing' ? 'yellow' : m.tag === 'Maintenance' ? 'blue' : m.tag === 'Payment' ? 'green' : 'gray')}>{m.tag}</span>
                <strong style={{ fontSize: 13.5, fontWeight: m.unread ? 600 : 500 }}>{m.subject}</strong>
                <span style={{ color: 'var(--ink-3)', fontSize: 13.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>— {m.preview}</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', textAlign:'right' }}>{m.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- Reports ---------- */
function ReportsView() {
  return (
    <>
      <Topbar title="Reports" crumbs="Operations / Reports"/>
      <div className="app-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { title: 'Owner statements', desc: 'Monthly rent distribution, expenses, and net-to-owner payout by portfolio.', tag: 'Monthly' },
            { title: 'Rent roll', desc: 'Current active leases, balances, and upcoming renewals.', tag: 'Live' },
            { title: 'Vacancy report', desc: 'Units available, days-on-market, and prospect pipeline.', tag: 'Weekly' },
            { title: 'Maintenance ledger', desc: 'Projects by property, vendor spend, and average close times.', tag: 'Quarterly' },
            { title: 'T776 / Schedule E pack', desc: 'Tax-ready export of rental income & expenses, per owner.', tag: 'Annual' },
            { title: 'Delinquency aging', desc: '30/60/90-day aging buckets with escalation recommendations.', tag: 'Weekly' },
          ].map((r, i) => (
            <div key={i} className="panel" style={{ padding: 20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <h3 style={{ fontSize: 16 }}>{r.title}</h3>
                <span className="pill gray">{r.tag}</span>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: '8px 0 16px' }}>{r.desc}</p>
              <button className="btn btn-ghost btn-sm">Generate</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ManagerViews });
