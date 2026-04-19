import { usePeople } from '@hooks/use-people';
import { useLeases } from '@hooks/use-leases';
import { useProperties } from '@hooks/use-properties';
import Topbar from '@ui/topbar';
import { Bed, Bath, Ruler, Plus } from 'lucide-react';
import PhotoPlaceholder from '@ui/photo-placeholder';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export default function Dashboard() {
  const { data: tenants } = usePeople('tenant');
  const { data: allLeases } = useLeases();
  const { data: allProperties } = useProperties();

  const tenant = tenants?.[0];
  const lease = (allLeases ?? []).find(l => l.tenantId === tenant?.id);
  const property = (allProperties ?? []).find(p => p.id === lease?.propertyId);

  return (<>
    <Topbar title="Hi there 👋" crumbs="Tenant portal"/>
    <div className="app-content">
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
        <div className="tenant-lease">
          <div style={{ fontSize: 13, opacity: .7 }}>Next rent payment</div>
          <div className="amt">{fmt(lease?.rent ?? 0)}</div>
          <div className="due">Due May 1 · Auto-debit from CIBC ••4521</div>
          <button className="pay-btn">Pay now instead</button>
          <div className="bg-num">${Math.round((lease?.rent ?? 0) / 100)}</div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Your place</h3></div>
          <div style={{ aspectRatio: '16/9' }}>
            <PhotoPlaceholder seed={property?.photoSeed ?? 0} label={property?.neighbourhood?.toUpperCase() ?? ''}/>
          </div>
          <div className="panel-body">
            <div style={{ fontWeight: 600, fontSize: 15 }}>{property?.name ?? ''}</div>
            <div className="sub-detail">{property?.address ?? ''} · {property?.neighbourhood ?? ''}</div>
            <div style={{ display:'flex', gap: 16, marginTop: 10, fontSize: 13, color: 'var(--ink-3)' }}>
              <span><Bed size={13}/> {property?.beds ?? 0} bed</span>
              <span><Bath size={13}/> {property?.baths ?? 0} bath</span>
              <span><Ruler size={13}/> {(property?.sqft ?? 0).toLocaleString()} sqft</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-grid-2" style={{ marginTop: 14 }}>
        <div className="panel">
          <div className="panel-head"><h3>Open requests</h3><button className="btn btn-ghost btn-sm"><Plus size={12}/> New</button></div>
          <div className="panel-body" style={{ padding: 0 }}>
            {[
              { title: 'Dishwasher making noise', status: 'Scheduled', when: 'Thu, Apr 23' },
              { title: 'Bathroom light replacement', status: 'Completed', when: 'Apr 8' },
            ].map((r, i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: '1px solid var(--line-2)' }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <div style={{ fontWeight: 500, fontSize: 13.5 }}>{r.title}</div>
                  <span className={"pill " + (r.status === 'Completed' ? 'green' : 'blue')}><span className="dot"/>{r.status}</span>
                </div>
                <div className="sub-detail" style={{ marginTop: 4 }}>{r.when}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Messages</h3></div>
          <div className="panel-body" style={{ padding: 0 }}>
            {[
              { from: 'Canary (Aidan)', msg: 'Hey — Avalon Plumbing is coming Thursday 8am. Anyone can let them in?', t: '2h' },
              { from: 'Canary (Aidan)', msg: 'Rent receipt for March has been emailed.', t: '4d' },
            ].map((m, i) => (
              <div key={i} style={{ padding: '14px 18px', borderBottom: '1px solid var(--line-2)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{m.from}</div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--ink-4)' }}>{m.t}</span>
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{m.msg}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <div className="panel-head"><h3>Lease summary</h3></div>
          <div className="panel-body">
            <div style={{ fontSize: 13 }}>
              <div style={{ display:'flex', justifyContent:'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                <span className="muted">Term</span><span>{lease?.startDate ?? '—'} → {lease?.endDate ?? '—'}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                <span className="muted">Rent</span><span>{fmt(lease?.rent ?? 0)}/mo</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                <span className="muted">Deposit</span><span>{fmt(lease?.rent ?? 0)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding: '6px 0' }}>
                <span className="muted">Status</span><span className="pill green"><span className="dot"/>Active</span>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 14, width:'100%', justifyContent:'center' }}>View full lease</button>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 14 }}>
        <div className="panel-head"><h3>Payment history</h3></div>
        <table className="data-table">
          <thead><tr><th>Month</th><th>Method</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {['Apr 2026','Mar 2026','Feb 2026','Jan 2026','Dec 2025','Nov 2025'].map(m => (
              <tr key={m}>
                <td><strong>{m}</strong></td>
                <td className="muted">Pre-auth debit</td>
                <td className="muted">{m.slice(0,3)} 1</td>
                <td>{fmt(lease?.rent ?? 0)}</td>
                <td><span className="pill green"><span className="dot"/>Paid</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>);
}
