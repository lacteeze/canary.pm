import React from 'react';
import { Icon, Sparkline } from './ui.jsx';

export function KpiCard({ label, value, delta, up, spark }) {
  return (
    <div className="kpi-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && <div className={"delta " + (up ? 'up' : 'down')}>
        <Icon name={up ? 'arrow_up' : 'arrow_down'} size={11}/> {delta}
      </div>}
      {spark && <div className="spark"><Sparkline data={spark} color={up ? '#1f9d55' : '#d14343'} fill/></div>}
    </div>
  );
}

export function Topbar({ title, crumbs, actions }) {
  return (
    <div className="app-topbar">
      <div>
        {crumbs && <div className="crumbs">{crumbs}</div>}
        <h1>{title}</h1>
      </div>
      <div style={{ flex: 1 }}/>
      <div className="search-input">
        <Icon name="search" size={13}/>
        <input placeholder="Search anything..."/>
        <span className="kbd">⌘K</span>
      </div>
      <button className="btn btn-ghost btn-sm"><Icon name="bell" size={14}/></button>
      {actions}
    </div>
  );
}
