/* Tweaks panel */
function Tweaks({ tweaks, setTweak }) {
  return (
    <div className="tweaks-panel">
      <h4>Tweaks <span className="mono" style={{ fontSize: 10, color: 'var(--ink-4)' }}>LIVE</span></h4>
      <div className="tweak-row">
        <label>Accent color</label>
        <div className="color-swatches">
          {[
            { k: '#F5C518', n: 'Canary' },
            { k: '#E85D45', n: 'Puffin' },
            { k: '#2B6FD6', n: 'Harbour' },
            { k: '#4a9b7f', n: 'Fog' },
            { k: '#1a1814', n: 'Ink' },
          ].map(c => (
            <button key={c.k} title={c.n} className={tweaks.accent === c.k ? 'on' : ''} style={{ background: c.k }} onClick={() => setTweak('accent', c.k)}/>
          ))}
        </div>
      </div>
      <div className="tweak-row">
        <label>Hero variant</label>
        <div className="tweak-opts">
          <button className={tweaks.heroVariant === 'split' ? 'on' : ''} onClick={() => setTweak('heroVariant', 'split')}>Split</button>
          <button className={tweaks.heroVariant === 'stacked' ? 'on' : ''} onClick={() => setTweak('heroVariant', 'stacked')}>Stacked</button>
        </div>
      </div>
      <div className="tweak-row">
        <label>App navigation</label>
        <div className="tweak-opts">
          <button className={tweaks.navStyle === 'sidebar' ? 'on' : ''} onClick={() => setTweak('navStyle', 'sidebar')}>Sidebar</button>
          <button className={tweaks.navStyle === 'topbar' ? 'on' : ''} onClick={() => setTweak('navStyle', 'topbar')}>Topbar</button>
        </div>
      </div>
      <div className="tweak-row">
        <label>Density</label>
        <div className="tweak-opts">
          <button className={tweaks.density === 'compact' ? 'on' : ''} onClick={() => setTweak('density', 'compact')}>Compact</button>
          <button className={tweaks.density === 'roomy' ? 'on' : ''} onClick={() => setTweak('density', 'roomy')}>Roomy</button>
        </div>
      </div>
      <div className="tweak-row">
        <label>Listing cards</label>
        <div className="tweak-opts">
          <button className={tweaks.cardStyle === 'airbnb' ? 'on' : ''} onClick={() => setTweak('cardStyle', 'airbnb')}>Airbnb</button>
          <button className={tweaks.cardStyle === 'editorial' ? 'on' : ''} onClick={() => setTweak('cardStyle', 'editorial')}>Editorial</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Tweaks });
