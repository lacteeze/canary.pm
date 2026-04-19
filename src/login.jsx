function Login({ navigate }) {
  const [role, setRole] = React.useState("manager");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const go = (r) => {
    localStorage.setItem('canary_role', r);
    navigate('/app');
  };
  return (
    <div className="login-screen">
      <div className="login-side">
        <Wordmark/>
        <div className="quote">
          <h2>"It finally feels like software that was designed by people who&rsquo;ve actually managed a building in the rain."</h2>
          <p>— Declan Murphy, Harbour Holdings (5 buildings on Gower St)</p>
        </div>
        <div className="stamp">ST. JOHN&rsquo;S · NL · EST. 2024</div>
      </div>
      <div className="login-form-side">
        <div className="login-form">
          <h1>Welcome back.</h1>
          <p className="sub">Sign in to your Canary account.</p>
          <div className="role-tabs">
            {[
              { k: 'manager', l: 'Manager' },
              { k: 'owner', l: 'Owner' },
              { k: 'tenant', l: 'Tenant' },
              { k: 'vendor', l: 'Vendor' },
            ].map(r => (
              <button key={r.k} className={"role-tab" + (role === r.k ? " active" : "")} onClick={() => setRole(r.k)}>{r.l}</button>
            ))}
          </div>
          <input className="login-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/>
          <input className="login-input" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12.5, color: 'var(--ink-3)', margin: '6px 2px 0' }}>
            <label style={{ display:'flex', alignItems:'center', gap: 6 }}>
              <input type="checkbox" defaultChecked/> Keep me signed in
            </label>
            <a style={{ cursor:'pointer' }}>Forgot password?</a>
          </div>
          <button className="login-submit" onClick={() => go(role)}>Sign in</button>
          <div className="login-alt">
            New to Canary? <a style={{ color: 'var(--ink)', fontWeight: 500, cursor: 'pointer' }} onClick={() => navigate('/')}>Back to home</a>
          </div>
          <div style={{ marginTop: 32, padding: 14, background: 'var(--bg-elev)', border: '1px dashed var(--line)', borderRadius: 10, fontSize: 12, color: 'var(--ink-3)' }}>
            <div style={{ fontWeight: 600, color: 'var(--ink-2)', marginBottom: 4 }}>Demo prototype</div>
            Any email / password works. Pick a role above to preview that view.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Login });
