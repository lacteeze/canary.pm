import { useProperties } from '@hooks/use-properties';
import { useProjects } from '@hooks/use-projects';
import Topbar from '@ui/topbar';
import KpiCard from '@ui/kpi-card';
import { LineChart } from '@ui/charts';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

const fmtCompact = (n: number) =>
  n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : '$' + n;

export default function Dashboard() {
  const ownerId = 'c1';
  const { data: allProperties } = useProperties();
  const { data: allProjects } = useProjects();
  const props = (allProperties ?? []).filter(p => p.ownerId === ownerId);
  const projects = allProjects ?? [];
  const totalRent = props.reduce((a, p) => a + p.rent, 0);

  return (
    <>
      <Topbar title="Welcome back" crumbs="Owner portal" />
      <div className="app-content">
        <div className="kpi-row">
          <KpiCard label="Monthly distribution (net)" value={fmtCompact(totalRent * 0.82)} delta="+2.1%" up />
          <KpiCard label="Properties" value={String(props.length)} />
          <KpiCard label="Occupancy" value={props.length ? Math.round(props.filter(p => p.occupancy !== 'vacant').length / props.length * 100) + '%' : '—'} />
          <KpiCard label="YTD net income" value={fmtCompact(totalRent * 0.82 * 4)} delta="+$3.2k vs. plan" up />
        </div>
        <div className="dash-grid">
          <div className="panel">
            <div className="panel-head"><h3>Net to owner</h3><div className="segmented"><button>3M</button><button className="active">12M</button></div></div>
            <div className="panel-body">
              <LineChart height={220} labels={['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr']}
                series={[{ color: '#1a1814', data: [4.1,4.2,4.2,4.3,4.4,4.4,4.3,4.4,4.5,4.5,4.6,4.7].map(v => v * 1000) }]} />
            </div>
          </div>
          <div className="panel">
            <div className="panel-head"><h3>Latest statement</h3><span className="meta">March 2026</span></div>
            <div className="panel-body">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.025em' }}>{fmtCompact(totalRent * 0.82)}</div>
              <div className="sub-detail">Deposited Apr 3</div>
              <div style={{ marginTop: 16, fontSize: 13 }}>
                {[
                  { l: 'Rent collected', v: totalRent },
                  { l: 'Management fee (8%)', v: -totalRent * 0.08 },
                  { l: 'Maintenance', v: -totalRent * 0.07 },
                  { l: 'Reserves', v: -totalRent * 0.03 },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--line-2)' }}>
                    <span style={{ color: r.v < 0 ? 'var(--ink-3)' : 'var(--ink-2)' }}>{r.l}</span>
                    <span className="mono" style={{ color: r.v < 0 ? 'var(--ink-3)' : 'var(--ink)' }}>{r.v < 0 ? '−' : ''}{fmt(Math.abs(Math.round(r.v)))}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>Download PDF statement</button>
            </div>
          </div>
        </div>
        <div className="panel" style={{ marginTop: 14 }}>
          <div className="panel-head"><h3>Your properties</h3></div>
          <table className="data-table">
            <thead><tr><th>Property</th><th>Occupancy</th><th>Rent</th><th>YTD net</th><th>Open projects</th></tr></thead>
            <tbody>
              {props.map(p => (
                <tr key={p.id}>
                  <td><div className="cell-name">{p.name} <span className="sub-detail">· {p.address}</span></div></td>
                  <td>{p.occupancy === 'vacant' ? <span className="pill red"><span className="dot" />Vacant</span> : <span className="pill green"><span className="dot" />{p.occupancy}</span>}</td>
                  <td>{fmt(p.rent)}</td>
                  <td>{fmt(Math.round(p.rent * 0.82 * 4))}</td>
                  <td className="muted">{projects.filter(pr => pr.propertyId === p.id && pr.status !== 'completed').length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
