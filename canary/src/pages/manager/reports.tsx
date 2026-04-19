import Topbar from '@ui/topbar';

export default function Reports() {
  return (
    <>
      <Topbar title="Reports" crumbs="Operations / Reports"/>
      <div className="app-content">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {[
            { title: 'Owner statements', desc: 'Monthly rent distribution, expenses, and net-to-owner payout by portfolio.', tag: 'Monthly' },
            { title: 'Rent roll', desc: 'Current active leases, balances, and upcoming renewals.', tag: 'Live' },
            { title: 'Vacancy report', desc: 'Units available, days-on-market, and prospect pipeline.', tag: 'Weekly' },
            { title: 'Maintenance ledger', desc: 'Projects by property, vendor spend, and average close times.', tag: 'Quarterly' },
            { title: 'T776 / Schedule E pack', desc: 'Tax-ready export of rental income & expenses, per owner.', tag: 'Annual' },
            { title: 'Delinquency aging', desc: '30/60/90-day aging buckets with escalation recommendations.', tag: 'Weekly' },
          ].map((r, i) => (
            <div key={i} className="panel" style={{ padding: 20 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <h3 style={{ fontSize: 16 }}>{r.title}</h3>
                <span className="pill gray">{r.tag}</span>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: '8px 0 16px' }}>{r.desc}</p>
              <button className="btn btn-ghost btn-sm">Generate</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
