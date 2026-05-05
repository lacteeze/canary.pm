import React from 'react';
import { Icon, PhotoPlaceholder } from '../ui.jsx';
import { KpiCard, Topbar } from '../shared.jsx';
import {
  LEADS, LEAD_ACTIVITY, LEAD_SOURCES, LOSS_REASONS,
  PIPELINE_STAGES, PROPERTIES,
  getProperty, fmt, fmtCompact, initials,
} from '../data.js';

export function PipelineView() {
  const [view, setView] = React.useState(() => localStorage.getItem('canary_pipe_view') || 'kanban');
  const [openId, setOpenId] = React.useState(null);
  const [filter, setFilter] = React.useState({ assignedTo: 'All', source: 'All', property: 'All', search: '' });
  const [draggingId, setDraggingId] = React.useState(null);
  const [dragOverStage, setDragOverStage] = React.useState(null);
  const [leads, setLeads] = React.useState(LEADS.active);
  const [showAddModal, setShowAddModal] = React.useState(false);

  const setV = (v) => { setView(v); localStorage.setItem('canary_pipe_view', v); };

  let rows = leads.slice();
  if (filter.assignedTo !== 'All') rows = rows.filter(r => r.assignedTo === filter.assignedTo);
  if (filter.source !== 'All') rows = rows.filter(r => r.source === filter.source);
  if (filter.property !== 'All') rows = rows.filter(r => r.propertyId === filter.property);
  if (filter.search) {
    const q = filter.search.toLowerCase();
    rows = rows.filter(r => (r.name + ' ' + getProperty(r.propertyId).name + ' ' + r.email).toLowerCase().includes(q));
  }

  const openLead = leads.find(l => l.id === openId);

  const moveLead = (id, newStage) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: newStage, daysInStage: 0 } : l));
  };

  const addLead = (data) => {
    const id = `ld${Date.now()}`;
    const name = data.name || 'Unnamed lead';
    const prop = getProperty(data.propertyId) || PROPERTIES[0];
    const newLead = {
      id,
      name,
      initials: initials(name),
      email: data.email || '',
      phone: data.phone || '',
      stage: data.stage || 'lead',
      propertyId: prop.id,
      source: data.source || 'Direct call',
      score: data.score || 50,
      ageDays: 0,
      daysInStage: 0,
      occupants: data.occupants || 1,
      pets: data.pets || 'None',
      employer: data.employer || '—',
      income: data.income || 0,
      budget: data.budget || prop.rent,
      moveIn: data.moveIn || new Date(Date.now() + 30*86400000).toISOString().slice(0,10),
      assignedTo: data.assignedTo || 'Aidan Flynn',
      lastTouch: 'Just now',
      stale: false,
      starred: false,
      notes: data.notes || '',
      photoSeed: leads.length,
    };
    setLeads(prev => [newLead, ...prev]);
    LEAD_ACTIVITY[id] = [{ kind: 'inquiry', text: `Lead added manually${data.source ? ' · ' + data.source : ''}`, days: 0 }];
  };

  const totalProjectedRent = rows.filter(r => r.stage === 'signed' || r.stage === 'lease' || r.stage === 'approved')
    .reduce((a, l) => a + l.budget, 0);
  const conversionRate = (() => {
    const totalEntered = rows.length + LEADS.lost.length;
    return totalEntered ? Math.round((rows.filter(r => r.stage === 'signed').length / totalEntered) * 100) : 0;
  })();
  const avgScore = rows.length ? Math.round(rows.reduce((a,l)=>a+l.score,0) / rows.length) : 0;
  const stale = rows.filter(r => r.stale && r.stage !== 'signed').length;

  return (
    <>
      <Topbar title="Tenant pipeline" crumbs="Records / Pipeline"
        actions={<>
          <button className="btn btn-ghost btn-sm">Import leads</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}><Icon name="plus" size={13}/> Add lead</button>
        </>}/>
      <div className="app-content">

        <div className="kpi-row">
          <KpiCard label="Active leads" value={rows.length} delta={`+${Math.min(6, rows.length)} this week`} up/>
          <KpiCard label="Projected new rent" value={fmtCompact(totalProjectedRent)} delta="approved + lease + signed"/>
          <KpiCard label="Conversion rate" value={conversionRate + '%'} delta="lead → signed" up={conversionRate > 20}/>
          <KpiCard label="Stale leads" value={stale} delta={stale ? '5+ days no touch' : 'all fresh'} up={stale === 0}/>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <div className="segmented">
            {[['kanban','Kanban'],['list','List'],['funnel','Funnel']].map(([k,l]) => (
              <button key={k} className={view===k?'active':''} onClick={() => setV(k)}>{l}</button>
            ))}
          </div>
          <div style={{ width: '1px', height: 20, background: 'var(--line)', margin: '0 4px' }}/>
          <select value={filter.assignedTo} onChange={e => setFilter({...filter, assignedTo: e.target.value})}
            style={selectStyle}>
            <option value="All">All assignees</option>
            {['Aidan Flynn','Siobhan O\'Brien','Niamh Doyle'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={filter.source} onChange={e => setFilter({...filter, source: e.target.value})}
            style={selectStyle}>
            <option value="All">All sources</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filter.property} onChange={e => setFilter({...filter, property: e.target.value})}
            style={selectStyle}>
            <option value="All">All properties</option>
            {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div style={{ flex: 1 }}/>
          <div className="search-input" style={{ minWidth: 200 }}>
            <Icon name="search" size={13}/>
            <input placeholder="Search leads..." value={filter.search}
              onChange={e => setFilter({...filter, search: e.target.value})}/>
          </div>
        </div>

        {view === 'kanban' && (
          <PipelineKanban
            rows={rows}
            onOpen={setOpenId}
            onMove={moveLead}
            onAdd={addLead}
            draggingId={draggingId}
            setDraggingId={setDraggingId}
            dragOverStage={dragOverStage}
            setDragOverStage={setDragOverStage}/>
        )}
        {view === 'list' && <PipelineList rows={rows} onOpen={setOpenId} onMove={moveLead}/>}
        {view === 'funnel' && <PipelineFunnel rows={rows}/>}

      </div>
      {openLead && <LeadDrawer lead={openLead} onClose={() => setOpenId(null)} onMove={moveLead}/>}
      {showAddModal && <AddLeadModal onClose={() => setShowAddModal(false)} onAdd={addLead}/>}
    </>
  );
}

const selectStyle = { padding: '6px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', background: 'var(--bg-elev)', color: 'var(--ink)', cursor: 'pointer', appearance: 'none' };

function PipelineKanban({ rows, onOpen, onMove, onAdd, draggingId, setDraggingId, dragOverStage, setDragOverStage }) {
  return (
    <div className="pipe-board">
      {PIPELINE_STAGES.map((stage, stageIdx) => {
        const items = rows.filter(r => r.stage === stage.id);
        const value = items.reduce((a, l) => a + l.budget, 0);
        const isOver = dragOverStage === stage.id;
        return (
          <div
            key={stage.id}
            className={"pipe-col" + (isOver ? " over" : "")}
            onDragOver={e => { e.preventDefault(); setDragOverStage(stage.id); }}
            onDragLeave={() => setDragOverStage(null)}
            onDrop={e => {
              e.preventDefault();
              if (draggingId) onMove(draggingId, stage.id);
              setDraggingId(null);
              setDragOverStage(null);
            }}>
            <div className="pipe-col-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="pipe-stage-dot" style={{ background: stage.color }}/>
                <span className="pipe-stage-label">{stage.label}</span>
                <span className="pipe-stage-count">{items.length}</span>
              </div>
              <div className="pipe-stage-value">{fmtCompact(value)}/mo</div>
            </div>
            {stageIdx === 0 && <QuickAddLead onAdd={onAdd}/>}
            <div className="pipe-col-body">
              {items.map(ld => (
                <LeadCard key={ld.id} lead={ld} onOpen={onOpen} onMove={onMove}
                  draggable
                  onDragStart={() => setDraggingId(ld.id)}
                  onDragEnd={() => { setDraggingId(null); setDragOverStage(null); }}
                  isDragging={draggingId === ld.id}/>
              ))}
              {items.length === 0 && (
                <div className="pipe-col-empty">
                  <span style={{ fontSize: 11, color: 'var(--ink-4)' }}>Drop leads here</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuickAddLead({ onAdd }) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [propertyId, setPropertyId] = React.useState(PROPERTIES[0].id);
  const [source, setSource] = React.useState('Direct call');
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (open && inputRef.current) inputRef.current.focus(); }, [open]);

  const submit = (e) => {
    e && e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), phone: phone.trim(), propertyId, source });
    setName(''); setPhone('');
    if (inputRef.current) inputRef.current.focus();
  };

  if (!open) {
    return (
      <button className="quick-add-trigger" onClick={() => setOpen(true)}>
        <Icon name="plus" size={11}/> Add lead
      </button>
    );
  }

  return (
    <form className="quick-add-form" onSubmit={submit} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }}>
      <input ref={inputRef} placeholder="Name *" value={name} onChange={e => setName(e.target.value)}/>
      <input placeholder="Phone or email" value={phone} onChange={e => setPhone(e.target.value)}/>
      <select value={propertyId} onChange={e => setPropertyId(e.target.value)}>
        {PROPERTIES.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <select value={source} onChange={e => setSource(e.target.value)}>
        {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="quick-add-actions">
        <button type="submit" className="btn btn-primary btn-sm" disabled={!name.trim()}>Add</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>Done</button>
        <span style={{ marginLeft: 'auto', fontSize: 10.5, color: 'var(--ink-4)' }}>⏎ to add another</span>
      </div>
    </form>
  );
}

function LeadCard({ lead, onOpen, onMove, draggable, onDragStart, onDragEnd, isDragging }) {
  const prop = getProperty(lead.propertyId);
  const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === lead.stage);
  const nextStage = PIPELINE_STAGES[stageIdx + 1];
  const scoreColor = lead.score >= 80 ? 'var(--green)' : lead.score >= 60 ? '#b8860b' : 'var(--ink-3)';

  const advance = (e) => {
    e.stopPropagation();
    if (nextStage) onMove(lead.id, nextStage.id);
  };

  return (
    <div className={"lead-card" + (isDragging ? " dragging" : "")}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(lead.id)}>
      <div className="lead-card-row">
        <div className="avatar size-sm">{lead.initials}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="lead-name">
            {lead.name}
            {lead.starred && <span className="lead-star">★</span>}
          </div>
          <div className="lead-prop">{prop.name}</div>
        </div>
        {lead.stale && <span className="lead-stale" title={`${lead.daysInStage} days in stage`}/>}
      </div>
      <div className="lead-meta-row">
        <span className="lead-score" style={{ color: scoreColor }}>
          <span className="lead-score-dot" style={{ background: scoreColor }}/>
          {lead.score}
        </span>
        <span className="lead-source">{lead.source}</span>
        <span className="lead-budget mono">{fmtCompact(lead.budget)}</span>
      </div>
      <div className="lead-card-foot">
        <span className="lead-touch">
          <Icon name="message" size={11}/> {lead.lastTouch}
        </span>
        {nextStage && (
          <button className="lead-advance" onClick={advance} title={`Advance to ${nextStage.label}`}>
            <Icon name="arrow_right" size={11}/>
          </button>
        )}
      </div>
    </div>
  );
}

function PipelineList({ rows, onOpen, onMove }) {
  return (
    <div className="panel">
      <table className="data-table">
        <thead>
          <tr>
            <th>Lead</th>
            <th>Property</th>
            <th>Stage</th>
            <th>Score</th>
            <th>Source</th>
            <th>Move-in</th>
            <th>Budget</th>
            <th>Assigned</th>
            <th>Last touch</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(ld => {
            const stage = PIPELINE_STAGES.find(s => s.id === ld.stage);
            const prop = getProperty(ld.propertyId);
            const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === ld.stage);
            const nextStage = PIPELINE_STAGES[stageIdx + 1];
            return (
              <tr key={ld.id} onClick={() => onOpen(ld.id)} style={{ cursor: 'pointer' }}>
                <td>
                  <div className="cell-name">
                    <div className="avatar size-sm">{ld.initials}</div>
                    {ld.name}
                    {ld.stale && <span className="lead-stale" style={{ marginLeft: 4 }}/>}
                  </div>
                </td>
                <td className="muted">{prop.name}</td>
                <td>
                  <span className="pipe-stage-pill" style={{ borderColor: stage.color }}>
                    <span className="pipe-stage-dot" style={{ background: stage.color }}/>
                    {stage.label}
                  </span>
                </td>
                <td><strong style={{ color: ld.score >= 80 ? 'var(--green)' : ld.score >= 60 ? '#b8860b' : 'var(--ink-3)' }}>{ld.score}</strong></td>
                <td className="muted">{ld.source}</td>
                <td className="muted">{ld.moveIn}</td>
                <td className="mono">{fmt(ld.budget)}</td>
                <td className="muted">{ld.assignedTo.split(' ')[0]}</td>
                <td className="muted">{ld.lastTouch}</td>
                <td>
                  {nextStage && (
                    <button className="btn btn-ghost btn-sm" onClick={e => { e.stopPropagation(); onMove(ld.id, nextStage.id); }}>
                      → {nextStage.label}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function PipelineFunnel({ rows }) {
  const maxCount = Math.max(...PIPELINE_STAGES.map(s => rows.filter(r => r.stage === s.id).length), 1);
  const totalLost = LEADS.lost.length;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <div className="panel">
        <div className="panel-head">
          <h3>Conversion funnel</h3>
          <span className="meta">Active pipeline + lost</span>
        </div>
        <div className="panel-body">
          {PIPELINE_STAGES.map((stage, i) => {
            const items = rows.filter(r => r.stage === stage.id);
            const downstream = rows.filter(r => PIPELINE_STAGES.findIndex(s => s.id === r.stage) >= i).length;
            const w = (items.length / maxCount) * 100;
            const conv = i > 0 ? Math.round((downstream / (rows.length || 1)) * 100) : 100;
            return (
              <div key={stage.id} className="funnel-row">
                <div className="funnel-row-head">
                  <span className="pipe-stage-dot" style={{ background: stage.color }}/>
                  <span className="funnel-row-label">{stage.label}</span>
                  <span className="funnel-row-count">{items.length}</span>
                  <span className="funnel-row-pct">{conv}% reach this stage</span>
                </div>
                <div className="funnel-bar">
                  <div className="funnel-bar-fill" style={{ width: w + '%', background: stage.color }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <h3>Lost leads</h3>
          <span className="meta">{totalLost} this quarter</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {LOSS_REASONS.map(reason => {
            const c = LEADS.lost.filter(l => l.lostReason === reason).length;
            if (!c) return null;
            const w = (c / totalLost) * 100;
            return (
              <div key={reason} style={{ padding: '12px 18px', borderBottom: '1px solid var(--line-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13 }}>{reason}</span>
                  <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{c}</span>
                </div>
                <div className="funnel-bar" style={{ height: 6 }}>
                  <div className="funnel-bar-fill" style={{ width: w + '%', background: 'var(--ink-3)' }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LeadDrawer({ lead, onClose, onMove }) {
  const prop = getProperty(lead.propertyId);
  const stage = PIPELINE_STAGES.find(s => s.id === lead.stage);
  const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === lead.stage);
  const events = LEAD_ACTIVITY[lead.id] || [];

  return (
    <>
      <div className="drawer-scrim" onClick={onClose}/>
      <aside className="drawer">
        <div className="drawer-head">
          <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
          <div style={{ flex: 1 }}/>
          <button className="btn btn-ghost btn-sm">Email</button>
          <button className="btn btn-ghost btn-sm">SMS</button>
          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--red)' }}>Reject</button>
        </div>

        <div className="drawer-body">
          <div className="drawer-hero">
            <div className="avatar size-lg" style={{ width: 56, height: 56, fontSize: 18 }}>{lead.initials}</div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>{lead.name}{lead.starred && <span className="lead-star" style={{ fontSize: 18 }}>★</span>}</h2>
              <div style={{ display: 'flex', gap: 12, color: 'var(--ink-3)', fontSize: 13, marginTop: 2 }}>
                <span>{lead.email}</span><span>·</span><span>{lead.phone}</span>
              </div>
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Lead score</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: lead.score >= 80 ? 'var(--green)' : lead.score >= 60 ? '#b8860b' : 'var(--ink-3)', lineHeight: 1 }}>{lead.score}</div>
            </div>
          </div>

          <div className="stage-stepper">
            {PIPELINE_STAGES.map((s, i) => {
              const done = i < stageIdx;
              const current = i === stageIdx;
              return (
                <button key={s.id} className={"stepper-step" + (done ? " done" : "") + (current ? " current" : "")}
                  onClick={() => onMove(lead.id, s.id)}>
                  <span className="stepper-dot" style={{ background: done || current ? s.color : '' }}>
                    {done ? <Icon name="check" size={11}/> : current ? <span className="stepper-pulse"/> : i + 1}
                  </span>
                  <span className="stepper-label">{s.label}</span>
                  {i < PIPELINE_STAGES.length - 1 && <span className={"stepper-line" + (done ? " done" : "")}/>}
                </button>
              );
            })}
          </div>

          <div className="drawer-grid">
            <div>
              <DrawerSection title="About this lead">
                <div className="kv-grid">
                  <KV label="Source" v={lead.source}/>
                  <KV label="Move-in target" v={lead.moveIn}/>
                  <KV label="Occupants" v={lead.occupants}/>
                  <KV label="Pets" v={lead.pets}/>
                  <KV label="Employer" v={lead.employer}/>
                  <KV label="Income" v={fmt(lead.income) + '/yr'}/>
                  <KV label="Budget" v={fmt(lead.budget) + '/mo'}/>
                  <KV label="Assigned to" v={lead.assignedTo}/>
                </div>
              </DrawerSection>

              <DrawerSection title="Notes">
                <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5, padding: 12, background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 8 }}>
                  {lead.notes}
                </div>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 8 }}>+ Add note</button>
              </DrawerSection>

              <DrawerSection title="Screening checklist">
                <Checklist items={[
                  { l: 'ID verified', done: stageIdx >= 3 },
                  { l: 'Credit check', done: stageIdx >= 4 },
                  { l: 'Income verification', done: stageIdx >= 4 },
                  { l: 'Reference: previous landlord', done: stageIdx >= 4 },
                  { l: 'Reference: employer', done: stageIdx >= 4 },
                  { l: 'Lease drafted', done: stageIdx >= 5 },
                  { l: 'Lease signed', done: stageIdx >= 6 },
                  { l: 'First month + deposit collected', done: stageIdx >= 6 },
                ]}/>
              </DrawerSection>
            </div>

            <div>
              <DrawerSection title="Interested in">
                <div style={{ border: '1px solid var(--line)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ aspectRatio: '16/9' }}>
                    <PhotoPlaceholder seed={prop.photoSeed} label={prop.neighbourhood.toUpperCase()}/>
                  </div>
                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{prop.name}</div>
                    <div className="sub-detail">{prop.address}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 12, color: 'var(--ink-3)' }}>
                      <span>{prop.beds}bd · {prop.baths}ba</span>
                      <span>{prop.sqft} sqft</span>
                      <span style={{ marginLeft: 'auto', fontWeight: 600, color: 'var(--ink)' }}>{fmt(prop.rent)}/mo</span>
                    </div>
                  </div>
                </div>
              </DrawerSection>

              <DrawerSection title="Activity">
                <div className="lead-timeline">
                  {events.map((ev, i) => (
                    <div key={i} className="timeline-item">
                      <span className={"timeline-dot kind-" + ev.kind}>
                        <Icon name={timelineIcon(ev.kind)} size={10}/>
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13 }}>{ev.text}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-4)', marginTop: 2 }}>
                          {ev.days === 0 ? 'today' : `${ev.days}d ago`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </DrawerSection>
            </div>
          </div>
        </div>

        <div className="drawer-foot">
          <button className="btn btn-ghost btn-sm" onClick={() => stageIdx > 0 && onMove(lead.id, PIPELINE_STAGES[stageIdx - 1].id)} disabled={stageIdx === 0}>
            ← Back
          </button>
          <div style={{ flex: 1 }}/>
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>Currently in <strong>{stage.label}</strong></span>
          <div style={{ flex: 1 }}/>
          {stageIdx < PIPELINE_STAGES.length - 1 ? (
            <button className="btn btn-primary btn-sm" onClick={() => onMove(lead.id, PIPELINE_STAGES[stageIdx + 1].id)}>
              Advance to {PIPELINE_STAGES[stageIdx + 1].label} →
            </button>
          ) : (
            <button className="btn btn-primary btn-sm">Convert to tenant →</button>
          )}
        </div>
      </aside>
    </>
  );
}

function timelineIcon(kind) {
  return ({
    inquiry: 'message', reply: 'message', call: 'bell', tour: 'home',
    app: 'doc', check: 'check', doc: 'doc', sign: 'check', pay: 'card',
  })[kind] || 'message';
}

function DrawerSection({ title, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h3 style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-3)', marginBottom: 10 }}>{title}</h3>
      {children}
    </div>
  );
}

function KV({ label, v }) {
  return (
    <div className="kv-item">
      <div className="kv-label">{label}</div>
      <div className="kv-value">{v}</div>
    </div>
  );
}

function Checklist({ items }) {
  return (
    <div className="checklist">
      {items.map((it, i) => (
        <div key={i} className={"check-item" + (it.done ? " done" : "")}>
          <span className="check-box">{it.done && <Icon name="check" size={11}/>}</span>
          <span>{it.l}</span>
        </div>
      ))}
    </div>
  );
}

function AddLeadModal({ onClose, onAdd }) {
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phone: '',
    propertyId: PROPERTIES[0].id,
    source: 'Canary listing',
    stage: 'lead',
    moveIn: new Date(Date.now() + 30*86400000).toISOString().slice(0,10),
    occupants: 1,
    pets: 'None',
    employer: '',
    income: '',
    budget: '',
    assignedTo: 'Aidan Flynn',
    notes: '',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const prop = getProperty(form.propertyId);

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd({
      ...form,
      name: form.name.trim(),
      income: form.income ? parseInt(form.income, 10) : 0,
      budget: form.budget ? parseInt(form.budget, 10) : prop.rent,
      occupants: parseInt(form.occupants, 10) || 1,
    });
    onClose();
  };

  return (
    <>
      <div className="drawer-scrim" onClick={onClose}/>
      <div className="modal-shell" onClick={onClose}>
        <form className="modal-card" onClick={e => e.stopPropagation()} onSubmit={submit}>
          <div className="modal-head">
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>New tenant lead</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 2 }}>Add lead to pipeline</h2>
            </div>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={14}/></button>
          </div>

          <div className="modal-body">
            <FieldRow>
              <Field label="Full name *">
                <input value={form.name} onChange={e => set('name', e.target.value)} autoFocus placeholder="e.g. Maeve Walsh"/>
              </Field>
              <Field label="Source">
                <select value={form.source} onChange={e => set('source', e.target.value)}>
                  {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </FieldRow>

            <FieldRow>
              <Field label="Email">
                <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="name@example.com"/>
              </Field>
              <Field label="Phone">
                <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="709-555-0123"/>
              </Field>
            </FieldRow>

            <FieldRow>
              <Field label="Property of interest">
                <select value={form.propertyId} onChange={e => set('propertyId', e.target.value)}>
                  {PROPERTIES.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {fmt(p.rent)}/mo</option>
                  ))}
                </select>
              </Field>
              <Field label="Starting stage">
                <select value={form.stage} onChange={e => set('stage', e.target.value)}>
                  {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
            </FieldRow>

            <FieldRow>
              <Field label="Move-in target">
                <input type="date" value={form.moveIn} onChange={e => set('moveIn', e.target.value)}/>
              </Field>
              <Field label="Budget ($/mo)">
                <input type="number" value={form.budget} onChange={e => set('budget', e.target.value)} placeholder={String(prop.rent)}/>
              </Field>
            </FieldRow>

            <FieldRow>
              <Field label="Occupants">
                <input type="number" min="1" value={form.occupants} onChange={e => set('occupants', e.target.value)}/>
              </Field>
              <Field label="Pets">
                <select value={form.pets} onChange={e => set('pets', e.target.value)}>
                  {['None','Cat','Dog','2 cats','Dog + cat','Other'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </FieldRow>

            <FieldRow>
              <Field label="Employer">
                <input value={form.employer} onChange={e => set('employer', e.target.value)} placeholder="e.g. Eastern Health"/>
              </Field>
              <Field label="Annual income">
                <input type="number" value={form.income} onChange={e => set('income', e.target.value)} placeholder="60000"/>
              </Field>
            </FieldRow>

            <Field label="Assigned to">
              <select value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
                {['Aidan Flynn','Siobhan O\'Brien','Niamh Doyle'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>

            <Field label="Notes">
              <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
                placeholder="Anything memorable from the conversation..."/>
            </Field>
          </div>

          <div className="modal-foot">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <div style={{ flex: 1 }}/>
            <button type="submit" className="btn btn-primary btn-sm" disabled={!form.name.trim()}>
              Add to pipeline
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function FieldRow({ children }) {
  return <div className="field-row">{children}</div>;
}

function Field({ label, children }) {
  return (
    <label className="modal-field">
      <span className="modal-field-label">{label}</span>
      {children}
    </label>
  );
}
