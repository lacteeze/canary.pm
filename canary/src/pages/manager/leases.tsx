import { Plus } from 'lucide-react';
import { useLeases } from '@hooks/use-leases';
import { useProperties } from '@hooks/use-properties';
import { usePeople } from '@hooks/use-people';
import Topbar from '@ui/topbar';
import KpiCard from '@ui/kpi-card';

export default function Leases() {
  const fmt = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
  const ini = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  const { data: leases } = useLeases();
  const { data: properties } = useProperties();
  const { data: tenants } = usePeople('tenant');
  const all = leases ?? [];

  return (
    <>
      <Topbar title="Leases" crumbs="Records / Leases"
        actions={<button className="btn btn-primary btn-sm"><Plus size={13}/> New lease</button>}/>
      <div className="app-content">
        <div className="kpi-row" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          <KpiCard label="Active leases" value={all.filter(l => l.status === 'active').length}/>
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
              {all.map(l => {
                const t = tenants?.find(t => t.id === l.tenantId);
                const p = properties?.find(p => p.id === l.propertyId);
                return (
                  <tr key={l.id}>
                    <td><div className="cell-name"><div className="avatar size-sm">{ini(t?.id ?? '??')}</div>{t?.id ?? '—'}</div></td>
                    <td className="muted">{p?.name ?? '—'} <span className="sub-detail">· {p?.address ?? ''}</span></td>
                    <td className="muted">{l.startDate} → {l.endDate}</td>
                    <td>{fmt(l.rent)}/mo</td>
                    <td>{l.status === 'active' ? <span className="pill green"><span className="dot"/>Active</span> : l.status === 'ending_soon' ? <span className="pill yellow"><span className="dot"/>Ending soon</span> : <span className="pill blue"><span className="dot"/>{l.status}</span>}</td>
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
