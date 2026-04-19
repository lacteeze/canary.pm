import { usePeople } from '@hooks/use-people';
import { useLeases } from '@hooks/use-leases';
import { useProperties } from '@hooks/use-properties';
import Topbar from '@ui/topbar';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export default function Pay() {
  const { data: tenants } = usePeople('tenant');
  const { data: allLeases } = useLeases();
  const { data: allProperties } = useProperties();

  const tenant = tenants?.[0];
  const lease = (allLeases ?? []).find(l => l.tenantId === tenant?.id);
  const property = (allProperties ?? []).find(p => p.id === lease?.propertyId);

  const rent = lease?.rent ?? 0;

  return (<>
    <Topbar title="Pay rent" crumbs="Tenant portal"/>
    <div className="app-content" style={{ maxWidth: 720 }}>
      <div className="panel" style={{ padding: 28 }}>
        <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Due May 1, 2026</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', margin: '6px 0' }}>{fmt(rent)}</div>
        <div className="sub-detail">for {property?.name ?? '—'}</div>
        <div style={{ marginTop: 24 }}>
          <div className="sub-detail" style={{ marginBottom: 8 }}>PAYMENT METHOD</div>
          {[
            { l: 'CIBC Chequing ••4521', sub: 'Pre-authorized debit · no fee', on: true },
            { l: 'Interac e-Transfer', sub: 'rent@canary.pm · no fee' },
            { l: 'Visa ••8821', sub: '2.4% processing fee' },
          ].map((m, i) => (
            <div key={i} style={{ padding: '14px 16px', border: '1px solid ' + (m.on ? 'var(--ink)' : 'var(--line)'), background: m.on ? 'var(--bg-elev)' : 'transparent', borderRadius: 10, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + (m.on ? 'var(--ink)' : 'var(--line)'), background: m.on ? 'var(--ink)' : 'transparent', boxShadow: m.on ? 'inset 0 0 0 2px var(--bg-elev)' : 'none' }}/>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14 }}>{m.l}</div>
                <div className="sub-detail">{m.sub}</div>
              </div>
            </div>
          ))}
          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Pay {fmt(rent)}</button>
        </div>
      </div>
    </div>
  </>);
}
