import { useState } from 'react';
import { Link } from 'wouter';
import { Plus } from 'lucide-react';
import { useProperties } from '@hooks/use-properties';
import { usePeople } from '@hooks/use-people';
import Topbar from '@ui/topbar';
import PhotoPlaceholder from '@ui/photo-placeholder';

const TYPE_LABELS: Record<string, string> = { single_family: 'Single Family', multi_family: 'Multi-Family', commercial: 'Commercial' };
const FILTER_MAP: Record<string, string> = { 'All': 'All', 'Single Family': 'single_family', 'Multi-Family': 'multi_family', 'Commercial': 'commercial' };

export default function Properties() {
  const fmt = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

  const { data: properties } = useProperties();
  const { data: owners } = usePeople('owner');
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('All');
  const all = properties ?? [];
  const rows = filter === 'All' ? all : all.filter(p => p.type === FILTER_MAP[filter]);
  return (
    <>
      <Topbar title="Properties" crumbs="Records / Properties"
        actions={<button className="btn btn-primary btn-sm"><Plus size={13}/> Add property</button>}/>
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
              <Link key={p.id} href={`/properties/${p.id}`} className="panel" style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}>
                <div style={{ aspectRatio: '16/10' }}>
                  <PhotoPlaceholder seed={p.photoSeed ?? 0} label={(p.neighbourhood ?? '').toUpperCase()}/>
                </div>
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                    <span className="pill gray">{(TYPE_LABELS[p.type] ?? p.type).split(' ')[0]}</span>
                  </div>
                  <div className="sub-detail" style={{ marginTop: 2 }}>{p.address}</div>
                  <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12, color: 'var(--ink-3)' }}>
                    <span>{p.units} {p.units > 1 ? 'units' : 'unit'}</span>
                    <span>{fmt(p.rent)}/mo</span>
                    <span style={{ marginLeft:'auto', color: p.occupancy === 'vacant' ? 'var(--red)' : 'var(--green)' }}>
                      {p.occupancy === 'occupied' ? '● Occupied' : p.occupancy === 'vacant' ? '○ Vacant' : p.occupancy}
                    </span>
                  </div>
                </div>
              </Link>
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
                    <td className="muted">{TYPE_LABELS[p.type] ?? p.type}</td>
                    <td>{p.units}</td>
                    <td>{fmt(p.rent)}</td>
                    <td>{p.occupancy === 'vacant' ? <span className="pill red"><span className="dot"/>Vacant</span> : <span className="pill green"><span className="dot"/>{p.occupancy}</span>}</td>
                    <td className="muted">{p.ownerId ? (owners?.find(o => o.id === p.ownerId)?.id ?? '—') : '—'}</td>
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
