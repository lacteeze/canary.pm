import { useState } from 'react';
import { Plus } from 'lucide-react';
import { usePeople } from '@hooks/use-people';
import { useVendors } from '@hooks/use-vendors';
import { useProperties } from '@hooks/use-properties';
import { useLeases } from '@hooks/use-leases';
import Topbar from '@ui/topbar';

export default function People() {
  const ini = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  const [tab, setTab] = useState('Owners');
  const { data: owners } = usePeople('owner');
  const { data: tenantList } = usePeople('tenant');
  const { data: vendors } = useVendors();
  const { data: properties } = useProperties();
  const { data: leases } = useLeases();

  const ownerRows = owners ?? [];
  const tenantRows = tenantList ?? [];
  const vendorRows = vendors ?? [];

  return (
    <>
      <Topbar title="People" crumbs="Records / People"
        actions={<button className="btn btn-primary btn-sm"><Plus size={13}/> Add person</button>}/>
      <div className="app-content">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <div className="segmented">
            {['Owners','Tenants','Vendors'].map(t => (
              <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>
                {t} · {t === 'Owners' ? ownerRows.length : t === 'Tenants' ? tenantRows.length : vendorRows.length}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-ghost btn-sm">Filter</button>
          <button className="btn btn-ghost btn-sm">Export</button>
        </div>
        <div className="panel">
          {tab === 'Vendors' ? (
            <table className="data-table">
              <thead>
                <tr><th>Company</th><th>Trade</th><th>Rating</th></tr>
              </thead>
              <tbody>
                {vendorRows.map(v => (
                  <tr key={v.id}>
                    <td><div className="cell-name"><div className="avatar size-sm">{ini(v.company)}</div>{v.company}</div></td>
                    <td className="muted">{v.trade}</td>
                    <td>★ {v.rating ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>{tab === 'Owners' ? 'Properties' : 'Lease'}</th>
                  <th>Since</th>
                </tr>
              </thead>
              <tbody>
                {(tab === 'Owners' ? ownerRows : tenantRows).map(r => {
                  const name = r.name ?? '—';
                  let col4 = '—';
                  if (tab === 'Owners') {
                    col4 = (properties ?? []).filter(p => p.ownerId === r.id).length + ' properties';
                  } else {
                    const l = (leases ?? []).find(l => l.tenantId === r.id);
                    const prop = l ? properties?.find(p => p.id === l.propertyId) : undefined;
                    col4 = prop?.name ?? '—';
                  }
                  return (
                    <tr key={r.id}>
                      <td><div className="cell-name"><div className="avatar size-sm">{ini(name)}</div>{name}</div></td>
                      <td className="muted">{r.email ?? '—'}</td>
                      <td className="muted">{r.phone ?? '—'}</td>
                      <td>{col4}</td>
                      <td className="muted">{r.since ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
