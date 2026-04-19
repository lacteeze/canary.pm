import { Plus } from 'lucide-react';
import { useProperties } from '@hooks/use-properties';
import { useLeases } from '@hooks/use-leases';
import { useProjects } from '@hooks/use-projects';
import { usePeople } from '@hooks/use-people';
import Topbar from '@ui/topbar';
import KpiCard from '@ui/kpi-card';
import { LineChart, Donut, BarChart } from '@ui/charts';

export default function Dashboard() {
  const fmt = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
  const ini = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  const { data: properties } = useProperties();
  const { data: leases } = useLeases();
  const { data: projects } = useProjects();
  const { data: tenants } = usePeople('tenant');

  const MONTHS = ['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr'];
  const REV = [48,51,52,55,56,58,56,58,57,60,58,62].map(v => v*10000);
  return (
    <>
      <Topbar title="Good morning, Aidan 👋" crumbs="Dashboard"
        actions={<button className="btn btn-primary btn-sm"><Plus size={13}/> New</button>}/>
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
              <div style={{ fontSize: 13, color: 'var(--ink-4)', textAlign: 'center', padding: 32 }}>Activity feed coming soon</div>
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
                <Donut size={150} total={(properties ?? []).length} segments={[
                  { color: '#1a1814', value: (properties ?? []).filter(p => p.type === 'single_family').length },
                  { color: '#F5C518', value: (properties ?? []).filter(p => p.type === 'multi_family').length },
                  { color: '#6b665f', value: (properties ?? []).filter(p => p.type === 'commercial').length },
                ]}/>
                <div className="donut-legend">
                  <div className="row"><span className="sw" style={{background:'#1a1814'}}/>Single family · {(properties ?? []).filter(p => p.type === 'single_family').length}</div>
                  <div className="row"><span className="sw" style={{background:'#F5C518'}}/>Multi-family · {(properties ?? []).filter(p => p.type === 'multi_family').length}</div>
                  <div className="row"><span className="sw" style={{background:'#6b665f'}}/>Commercial · {(properties ?? []).filter(p => p.type === 'commercial').length}</div>
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
              {(leases ?? []).slice(0, 5).map(l => {
                const t = tenants?.find(t => t.id === l.tenantId);
                const p = properties?.find(p => p.id === l.propertyId);
                return (
                  <div key={l.id} style={{ padding: '10px 18px', borderBottom: '1px solid var(--line-2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="avatar size-sm">{ini(t?.id ?? '??')}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t?.id ?? '—'}</div>
                      <div className="sub-detail">{p?.name ?? '—'}</div>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--ink-3)' }}>
                      <div>{l.endDate}</div>
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
                  (projects ?? []).filter(p=>p.priority==='low').length,
                  (projects ?? []).filter(p=>p.priority==='medium').length,
                  (projects ?? []).filter(p=>p.priority==='high').length,
                  (projects ?? []).filter(p=>p.priority==='urgent').length,
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
                  {(leases ?? []).slice(0, 8).map(l => {
                    const t = tenants?.find(t => t.id === l.tenantId);
                    const p = properties?.find(p => p.id === l.propertyId);
                    const pill = l.balance > 0
                      ? <span className="pill red"><span className="dot"/>Overdue</span>
                      : <span className="pill green"><span className="dot"/>Paid</span>;
                    return (
                      <tr key={l.id}>
                        <td><div className="cell-name"><div className="avatar size-sm">{ini(t?.id ?? '??')}</div>{t?.id ?? '—'}</div></td>
                        <td className="muted">{p?.name ?? '—'}</td>
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
