import Topbar from '@ui/topbar';
import { Plus } from 'lucide-react';

export default function Requests() {
  return (<>
    <Topbar title="Maintenance" crumbs="Tenant portal"
      actions={<button className="btn btn-primary btn-sm"><Plus size={13}/> New request</button>}/>
    <div className="app-content">
      <div className="panel">
        <table className="data-table">
          <thead><tr><th>Request</th><th>Filed</th><th>Vendor</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { t: 'Dishwasher making noise', d: 'Apr 16', v: 'Avalon Plumbing', s: 'Scheduled', c: 'blue' },
              { t: 'Bathroom light replacement', d: 'Apr 5', v: 'East Coast Electric', s: 'Completed', c: 'green' },
              { t: 'Stuck window — bedroom', d: 'Mar 22', v: 'Canary maintenance', s: 'Completed', c: 'green' },
            ].map((r, i) => (
              <tr key={i}>
                <td><strong>{r.t}</strong></td>
                <td className="muted">{r.d}</td>
                <td className="muted">{r.v}</td>
                <td><span className={"pill " + r.c}><span className="dot"/>{r.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>);
}
