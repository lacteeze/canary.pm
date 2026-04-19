import { usePayments } from '@hooks/use-payments';
import { useProperties } from '@hooks/use-properties';
import { usePeople } from '@hooks/use-people';
import Topbar from '@ui/topbar';
import KpiCard from '@ui/kpi-card';
import { BarChart, Donut } from '@ui/charts';

export default function Payments() {
  const fmt = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
  const ini = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  const { data: payments } = usePayments();
  const { data: properties } = useProperties();
  const { data: tenants } = usePeople('tenant');
  const recent = (payments ?? []).slice(-30).reverse();
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
                const t = tenants?.find(t => t.id === pay.tenantId);
                const p = properties?.find(p => p.id === pay.propertyId);
                const pill = pay.status === 'paid' ? <span className="pill green"><span className="dot"/>Paid</span>
                  : pay.status === 'pending' ? <span className="pill yellow"><span className="dot"/>Pending</span>
                  : pay.status === 'overdue' ? <span className="pill red"><span className="dot"/>Overdue</span>
                  : <span className="pill blue"><span className="dot"/>Late</span>;
                return (
                  <tr key={pay.id}>
                    <td className="muted">{pay.date}</td>
                    <td><div className="cell-name"><div className="avatar size-sm">{ini(t?.id ?? '??')}</div>{t?.id ?? '—'}</div></td>
                    <td className="muted">{p?.name ?? '—'}</td>
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
