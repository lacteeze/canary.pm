function TenantViews({ section }) {
  const tenant = TENANTS[0];
  const lease = LEASES.find(l => l.tenantId === tenant.id);
  const property = getProperty(lease.propertyId);

  if (section === 'dashboard') {
    return (<>
      <Topbar title={`Hi ${tenant.name.split(' ')[0]} 👋`} crumbs="Tenant portal"/>
      <div className="app-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
          <div className="tenant-lease">
            <div style={{ fontSize: 13, opacity: .7 }}>Next rent payment</div>
            <div className="amt">{fmt(lease.rent)}</div>
            <div className="due">Due May 1 · Auto-debit from CIBC ••4521</div>
            <button className="pay-btn">Pay now instead</button>
            <div className="bg-num">${Math.round(lease.rent/100)}</div>
          </div>
          <div className="panel">
            <div className="panel-head"><h3>Your place</h3></div>
            <div style={{ aspectRatio: '16/9' }}>
              <PhotoPlaceholder seed={property.photoSeed} label={property.neighbourhood.toUpperCase()}/>
            </div>
            <div className="panel-body">
              <div style={{ fontWeight: 600, fontSize: 15 }}>{property.name}</div>
              <div className="sub-detail">{property.address} · {property.neighbourhood}</div>
              <div style={{ display:'flex', gap: 16, marginTop: 10, fontSize: 13, color: 'var(--ink-3)' }}>
                <span><Icon name="bed" size={13}/> {property.beds} bed</span>
                <span><Icon name="bath" size={13}/> {property.baths} bath</span>
                <span><Icon name="ruler" size={13}/> {property.sqft.toLocaleString()} sqft</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-grid-2" style={{ marginTop: 14 }}>
          <div className="panel">
            <div className="panel-head"><h3>Open requests</h3><button className="btn btn-ghost btn-sm"><Icon name="plus" size={12}/> New</button></div>
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
                { from: 'Canary (Aidan)', msg: 'Hey Maeve — Avalon Plumbing is coming Thursday 8am. Anyone can let them in?', t: '2h' },
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
                  <span className="muted">Term</span><span>{lease.start} → {lease.end}</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                  <span className="muted">Rent</span><span>{fmt(lease.rent)}/mo</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', padding: '6px 0', borderBottom: '1px solid var(--line-2)' }}>
                  <span className="muted">Deposit</span><span>{fmt(lease.rent)}</span>
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
              {['Apr 2026','Mar 2026','Feb 2026','Jan 2026','Dec 2025','Nov 2025'].map((m, i) => (
                <tr key={m}>
                  <td><strong>{m}</strong></td>
                  <td className="muted">Pre-auth debit</td>
                  <td className="muted">{m.slice(0,3)} 1</td>
                  <td>{fmt(lease.rent)}</td>
                  <td><span className="pill green"><span className="dot"/>Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>);
  }

  if (section === 'pay') {
    return (<>
      <Topbar title="Pay rent" crumbs="Tenant portal"/>
      <div className="app-content" style={{ maxWidth: 720 }}>
        <div className="panel" style={{ padding: 28 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Due May 1, 2026</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', margin: '6px 0' }}>{fmt(lease.rent)}</div>
          <div className="sub-detail">for {property.name}</div>
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
            <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>Pay {fmt(lease.rent)}</button>
          </div>
        </div>
      </div>
    </>);
  }

  if (section === 'requests') {
    return (<>
      <Topbar title="Maintenance" crumbs="Tenant portal"
        actions={<button className="btn btn-primary btn-sm"><Icon name="plus" size={13}/> New request</button>}/>
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

  return (<>
    <Topbar title={section === 'lease' ? 'My lease' : 'Messages'} crumbs="Tenant portal"/>
    <div className="app-content">
      <div className="empty-hint">Details for "{section}" go here.</div>
    </div>
  </>);
}

Object.assign(window, { TenantViews });
