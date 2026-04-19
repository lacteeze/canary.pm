/* Main app — routing + tweaks wiring */

function App() {
  const [route, setRoute] = React.useState(() => localStorage.getItem('canary_route') || '/');
  const navigate = (r) => { setRoute(r); localStorage.setItem('canary_route', r); window.scrollTo(0, 0); };

  const [tweaks, setTweaks] = React.useState(() => window.__TWEAKS);
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  // Apply accent
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    // derive accent-soft by lightening
    document.documentElement.style.setProperty('--accent-soft', tweaks.accent + '22');
    // app density
    document.body.dataset.density = tweaks.density;
  }, [tweaks]);

  // Tweaks protocol
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const setTweak = (k, v) => {
    setTweaks(prev => {
      const next = { ...prev, [k]: v };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      return next;
    });
  };

  let view;
  if (route === '/') view = <><Landing navigate={navigate}/><FABMenu/></>;
  else if (route === '/owners') view = <><Owners navigate={navigate}/><FABMenu/></>;
  else if (route === '/rentals') view = <><Rentals navigate={navigate}/><FABMenu/></>;
  else if (route === '/login') view = <Login navigate={navigate}/>;
  else if (route === '/app') view = <AppShell navigate={navigate}/>;
  else view = <><Landing navigate={navigate}/><FABMenu/></>;

  return (
    <>
      {view}
      {tweaksOpen && <Tweaks tweaks={tweaks} setTweak={setTweak}/>}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
