import { Plus } from 'lucide-react';
import { useProjects } from '@hooks/use-projects';
import { useProperties } from '@hooks/use-properties';
import { useVendors } from '@hooks/use-vendors';
import Topbar from '@ui/topbar';

const STATUS_LABELS: Record<string, string> = { requested: 'Requested', scheduled: 'Scheduled', in_progress: 'In progress', on_hold: 'On hold', completed: 'Completed' };
const PRIORITY_PILLS: Record<string, string> = { urgent: 'red', high: 'yellow', medium: 'blue', low: 'gray' };

export default function Projects() {
  const ini = (name: string) => name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);

  const { data: projects } = useProjects();
  const { data: properties } = useProperties();
  const { data: vendors } = useVendors();
  const all = projects ?? [];

  const cols = ['requested','scheduled','in_progress','on_hold','completed'] as const;
  return (
    <>
      <Topbar title="Projects & maintenance" crumbs="Operations / Projects"
        actions={<button className="btn btn-primary btn-sm"><Plus size={13}/> New project</button>}/>
      <div className="app-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
          {cols.map(col => {
            const items = all.filter(p => p.status === col);
            return (
              <div key={col} style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 10, padding: 12, minHeight: 300 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-2)' }}>{STATUS_LABELS[col] ?? col}</div>
                  <span className="count" style={{ fontSize: 11, background: 'var(--bg)', padding: '2px 7px', borderRadius: 999, color: 'var(--ink-3)' }}>{items.length}</span>
                </div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {items.map(pr => {
                    const p = properties?.find(p => p.id === pr.propertyId);
                    const v = vendors?.find(v => v.id === pr.vendorId);
                    const pri = PRIORITY_PILLS[pr.priority] ?? 'gray';
                    return (
                      <div key={pr.id} style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8, padding: 10 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap: 6 }}>
                          <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.3 }}>{pr.title}</div>
                          <span className={"pill " + pri} style={{ fontSize: 10, padding: '1px 6px' }}>{pr.priority}</span>
                        </div>
                        <div className="sub-detail" style={{ marginTop: 6, fontSize: 12 }}>{p?.name ?? '—'}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 8 }}>
                          <div style={{ display:'flex', alignItems:'center', gap: 6 }}>
                            <div className="avatar size-sm" style={{ background:'var(--ink-2)' }}>{ini(v?.company ?? '??')}</div>
                            <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{v?.company ?? '—'}</span>
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
