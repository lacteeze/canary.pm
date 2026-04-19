import { useVendors } from '@hooks/use-vendors';
import { useProjects } from '@hooks/use-projects';
import { useProperties } from '@hooks/use-properties';
import Topbar from '@ui/topbar';
import KpiCard from '@ui/kpi-card';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');

export default function Dashboard() {
  const { data: allVendors } = useVendors();
  const { data: allProjects } = useProjects();
  const { data: allProperties } = useProperties();

  const vendor = allVendors?.[0];
  const properties = allProperties ?? [];
  const orders = (allProjects ?? []).map(pr => {
    const _p = properties.find(p => p.id === pr.propertyId);
    return { ...pr, _p };
  });

  return (<>
    <Topbar title={vendor?.company ?? 'Vendor'} crumbs="Vendor portal"/>
    <div className="app-content">
      <div className="kpi-row">
        <KpiCard label="Open work orders" value="6"/>
        <KpiCard label="This week's schedule" value="4 jobs"/>
        <KpiCard label="Outstanding invoices" value="$4,240"/>
        <KpiCard label="Rating" value={vendor ? "★ " + (vendor.rating ?? 0) : '—'}/>
      </div>
      <div className="panel" style={{ marginTop: 14 }}>
        <div className="panel-head"><h3>Assigned work orders</h3></div>
        <table className="data-table">
          <thead><tr><th>Job</th><th>Property</th><th>Priority</th><th>Due</th><th>Budget</th><th>Status</th></tr></thead>
          <tbody>
            {orders.slice(0, 8).map(o => {
              const pri = { urgent: 'red', high: 'yellow', medium: 'blue', low: 'gray' }[o.priority] as string;
              return (
                <tr key={o.id}>
                  <td><strong>{o.title}</strong></td>
                  <td className="muted">{o._p?.name ?? '—'} <span className="sub-detail">· {o._p?.address ?? ''}</span></td>
                  <td><span className={"pill " + pri}>{capitalize(o.priority)}</span></td>
                  <td className="muted">{o.dueDate ?? '—'}</td>
                  <td>{fmt(o.budget)}</td>
                  <td className="muted">{capitalize(o.status)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  </>);
}
