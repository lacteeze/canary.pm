import { useProperties } from '@hooks/use-properties';
import Topbar from '@ui/topbar';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export default function Statements() {
  const ownerId = 'c1';
  const { data: allProperties } = useProperties();

  const props = (allProperties ?? []).filter(p => p.ownerId === ownerId);
  const totalRent = props.reduce((a, p) => a + p.rent, 0);

  return (
    <>
      <Topbar title="Statements" crumbs="Owner portal" />
      <div className="app-content">
        <div className="panel">
          <table className="data-table">
            <thead><tr><th>Month</th><th>Portfolio</th><th>Gross</th><th>Fees</th><th>Net</th><th /></tr></thead>
            <tbody>
              {['Mar 2026','Feb 2026','Jan 2026','Dec 2025','Nov 2025','Oct 2025'].map(m => (
                <tr key={m}>
                  <td><strong>{m}</strong></td>
                  <td className="muted">Harbour Holdings</td>
                  <td>{fmt(totalRent)}</td>
                  <td className="muted">−{fmt(Math.round(totalRent * 0.18))}</td>
                  <td><strong>{fmt(Math.round(totalRent * 0.82))}</strong></td>
                  <td><button className="btn btn-ghost btn-sm">Download</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
