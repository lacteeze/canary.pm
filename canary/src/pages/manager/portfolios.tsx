import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { usePortfolios } from '@hooks/use-portfolios';
import type { Portfolio } from '@server/db/schema/portfolio';
import Topbar from '@ui/topbar';

export default function Portfolios() {
  const { data: portfolios } = usePortfolios();
  const [openId, setOpenId] = useState<string | null>(null);
  const all = portfolios ?? [];

  return (
    <>
      <Topbar title="Portfolios" crumbs="Records / Portfolios"
        actions={<button className="btn btn-primary btn-sm"><Plus size={13}/> New portfolio</button>}/>
      <div className="app-content">
        <div style={{ marginBottom: 16, color: 'var(--ink-3)', fontSize: 14, maxWidth: 760 }}>
          Each portfolio is a <strong style={{ color: 'var(--ink)' }}>digital client agreement</strong>. Set leasing, long-term, and short-term management fees once — Canary applies them automatically to every lease, payment, and statement under that portfolio.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {all.map(pf => (
              <div key={pf.id} className="panel" style={{ cursor: 'pointer' }} onClick={() => setOpenId(pf.id)}>
                <div className="panel-head">
                  <div>
                    <h3 style={{ fontSize: 16 }}>{pf.name}</h3>
                    <div className="sub-detail" style={{ marginTop: 2 }}>{pf.term ?? '—'} term</div>
                  </div>
                </div>
                <div className="panel-body">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
                    <FeeTile label="Leasing" val={pf.feeLeasing + '%'} sub="of 1st month"/>
                    <FeeTile label="LT mgmt" val={pf.feeLtm + '%'} sub="monthly rent"/>
                    <FeeTile label="ST mgmt" val={pf.feeStm + '%'} sub="gross bookings"/>
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--line-2)', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-3)' }}>
                    <span>{pf.signed ? `Agreement signed ${pf.signed}` : 'Not yet signed'}</span>
                    <span style={{ color: 'var(--ink)' }}>View agreement →</span>
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
      {openId && <PortfolioAgreementSheet pf={all.find(p => p.id === openId)!} onClose={() => setOpenId(null)}/>}
    </>
  );
}

function FeeTile({ label, val, sub }: { label: string; val: string; sub: string }) {
  return (
    <div style={{ background: 'var(--bg)', border: '1px solid var(--line-2)', borderRadius: 8, padding: '10px 12px' }}>
      <div className="sub-detail" style={{ fontSize: 10, marginBottom: 3 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>{val}</div>
      <div className="sub-detail" style={{ fontSize: 10.5 }}>{sub}</div>
    </div>
  );
}

function PortfolioAgreementSheet({ pf, onClose }: { pf: Portfolio; onClose: () => void }) {
  const [fees, setFees] = useState({ leasing: pf.feeLeasing, ltm: pf.feeLtm, stm: pf.feeStm });

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="proj-sheet" onClick={e => e.stopPropagation()} style={{ maxWidth: 820 }}>
        <button className="sheet-close" onClick={onClose}><X size={14}/></button>
        <div className="proj-sheet-head">
          <div className="sub-detail" style={{ marginBottom: 6 }}>MANAGEMENT AGREEMENT · {(pf.term ?? '—').toUpperCase()}</div>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>{pf.name}</h2>
          <div className="sub-detail">{pf.signed ? `Signed ${pf.signed}` : 'Not yet signed'}</div>
        </div>
        <div style={{ padding: '24px 32px 32px' }}>
          <h3 style={{ fontSize: 15, marginBottom: 12 }}>Fee schedule</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
            <FeeCard label="Leasing fee" value={fees.leasing} max={100} suffix="%" onChange={(v: number) => setFees({...fees, leasing: v})} help="% of first month's rent, charged once when a new tenant signs."/>
            <FeeCard label="Long-term mgmt" value={fees.ltm} min={5} max={12} suffix="%" onChange={(v: number) => setFees({...fees, ltm: v})} help="% of collected rent each month on active leases > 30 days."/>
            <FeeCard label="Short-term mgmt" value={fees.stm} min={15} max={25} suffix="%" onChange={(v: number) => setFees({...fees, stm: v})} help="% of gross bookings on Airbnb/VRBO-style rentals < 30 days."/>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 28, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost btn-sm">View full PDF</button>
            <button className="btn btn-primary btn-sm">Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeeCard({ label, value, onChange, min = 0, max = 100, suffix = '%', help }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string; help: string }) {
  return (
    <div className="fee-card">
      <div className="sub-detail" style={{ fontSize: 10.5, marginBottom: 4 }}>{label.toUpperCase()}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
        {value}<span style={{ fontSize: 18, color: 'var(--ink-3)' }}>{suffix}</span>
      </div>
      <input type="range" className="fee-slider" min={min} max={max} value={value} onChange={e => onChange(+e.target.value)}/>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-4)' }} className="mono">
        <span>{min}%</span><span>{max}%</span>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.4 }}>{help}</div>
    </div>
  );
}
