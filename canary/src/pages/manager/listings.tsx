import { useProperties } from '@hooks/use-properties';
import Topbar from '@ui/topbar';

export default function Listings() {
  const fmt = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
  const { data: properties } = useProperties();
  const listed = (properties ?? []).filter(p => p.listed);

  return (
    <>
      <Topbar title="Public listings" crumbs="Operations / Listings"/>
      <div className="app-content">
        <div className="notice" style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🟡</span>
          <div>
            <strong>Connected to canary.pm/rentals</strong> — listings marked "Live" appear publicly. Tenant viewing requests flow to your Inbox.
          </div>
        </div>
        <div className="panel">
          <table className="data-table">
            <thead><tr><th>Property</th><th>Rent</th><th>Status</th><th>Photos</th><th>Views (7d)</th><th>Requests</th><th></th></tr></thead>
            <tbody>
              {listed.map(p => (
                <tr key={p.id}>
                  <td><div className="cell-name">{p.name}<span className="sub-detail"> · {p.address}</span></div></td>
                  <td>{fmt(p.rent)}</td>
                  <td><span className="pill yellow"><span className="dot"/>Live</span></td>
                  <td className="muted">8 photos</td>
                  <td>{120 + ((p.photoSeed ?? 0) * 17) % 400}</td>
                  <td>{((p.photoSeed ?? 0) * 3) % 12}</td>
                  <td><button className="btn btn-ghost btn-sm">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
