function VendorViews({ section }) {
  const vendor = VENDORS[0];
  const orders = PROJECTS.map(pr => ({ ...pr, _p: getProperty(pr.propertyId) }));

  if (section === 'dashboard') {
    return (<>
      <Topbar title={vendor.company} crumbs="Vendor portal"/>
      <div className="app-content">
        <div className="kpi-row">
          <KpiCard label="Open work orders" value="6"/>
          <KpiCard label="This week's schedule" value="4 jobs"/>
          <KpiCard label="Outstanding invoices" value="$4,240"/>
          <KpiCard label="Rating" value={"★ " + vendor.rating}/>
        </div>
        <div className="panel" style={{ marginTop: 14 }}>
          <div className="panel-head"><h3>Assigned work orders</h3></div>
          <table className="data-table">
            <thead><tr><th>Job</th><th>Property</th><th>Priority</th><th>Due</th><th>Budget</th><th>Status</th></tr></thead>
            <tbody>
              {orders.slice(0, 8).map(o => {
                const pri = { Urgent: 'red', High: 'yellow', Medium: 'blue', Low: 'gray' }[o.priority];
                return (
                  <tr key={o.id}>
                    <td><strong>{o.title}</strong></td>
                    <td className="muted">{o._p.name} <span className="sub-detail">· {o._p.address}</span></td>
                    <td><span className={"pill " + pri}>{o.priority}</span></td>
                    <td className="muted">{o.due}</td>
                    <td>{fmt(o.budget)}</td>
                    <td className="muted">{o.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>);
  }
  return (<>
    <Topbar title={section[0].toUpperCase() + section.slice(1)} crumbs="Vendor portal"/>
    <div className="app-content">
      <div className="empty-hint">Vendor "{section}" view placeholder.</div>
    </div>
  </>);
}

Object.assign(window, { VendorViews });
