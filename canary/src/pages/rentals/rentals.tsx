import { useState } from 'react';
import { Link } from 'wouter';
import type { Property } from '@server/db/schema/property';
import { useProperties } from '@hooks/use-properties';
import Wordmark from '@ui/wordmark';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

const fmtCompact = (n: number) =>
  n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : '$' + n;
import { X, Bed, Bath, Ruler, Building, Check, DollarSign, MapPin, Calendar, Heart, Plus } from 'lucide-react';
import PhotoPlaceholder from '@ui/photo-placeholder';
// MapBG was removed — using inline placeholder instead

const PROPERTY_IMAGES = [
  '/uploads/Copy+of+IMG_0113.webp',
  '/uploads/IMG_9913.webp',
  '/uploads/JGD_0407-HDR-Edit-post.webp',
  '/uploads/IMG_3237.webp',
  '/uploads/Copy+of+IMG_9767.webp',
  '/uploads/IMG_6707.webp',
  '/uploads/IMG_4335.webp',
  '/uploads/IMG_5372.webp',
  '/uploads/IMG_0542.webp',
  '/uploads/Copy+of+IMG_2495.webp',
  '/uploads/IMG_6902.webp',
];

interface ListingSheetProps {
  property: Property;
  onClose: () => void;
}

function ListingSheet({ property, onClose }: ListingSheetProps) {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: 'Afternoon', note: '' });

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <button className="sheet-close" onClick={onClose}><X size={14} /></button>
        <div className="sheet-gallery">
          <div className="ph-photo"><PhotoPlaceholder seed={(property.photoSeed ?? 0)} label={property.name.toUpperCase()} /></div>
          <div className="ph-photo"><PhotoPlaceholder seed={(property.photoSeed ?? 0) + 1} /></div>
          <div className="ph-photo"><PhotoPlaceholder seed={(property.photoSeed ?? 0) + 2} /></div>
          <div className="ph-photo"><PhotoPlaceholder seed={(property.photoSeed ?? 0) + 3} /></div>
          <div className="ph-photo"><PhotoPlaceholder seed={(property.photoSeed ?? 0) + 4} /></div>
        </div>
        <div className="sheet-body">
          <div>
            <h2>{property.name}</h2>
            <div className="addr">{property.address}{property.neighbourhood ? ` · ${property.neighbourhood}` : ''}, St. John&rsquo;s NL</div>
            <div className="stats">
              {(property.beds ?? 0) > 0 && <span><Bed size={14} /> {property.beds} bed</span>}
              <span><Bath size={14} /> {property.baths} bath</span>
              <span><Ruler size={14} /> {(property.sqft ?? 0).toLocaleString()} sqft</span>
              <span><Building size={14} /> {property.type}</span>
            </div>
            <div className="tag-row">
              <span className="tag">Hardwood</span>
              <span className="tag">In-unit laundry</span>
              <span className="tag">Pet-friendly</span>
              <span className="tag">Parking</span>
              <span className="tag">Heat included</span>
            </div>
            <p className="desc">
              A {property.yearBuilt} {property.type.replace(/_/g, ' ')} in {property.neighbourhood ?? 'St. John\u2019s'}, steps from George Street and a 12-minute walk to the harbour.
              Recently refreshed with refinished floors, original mouldings intact. South-facing, bright even on a grey day in February.
              Managed directly by Canary — expect a reply within the hour on weekdays.
            </p>
            <h3>What&rsquo;s included</h3>
            <div className="amenities">
              <div>Heat &amp; hot water</div><div>Snow clearing</div>
              <div>Laundry (in-unit)</div><div>Off-street parking</div>
              <div>High-speed fibre ready</div><div>Secure entry</div>
              <div>Storage locker</div><div>Pets allowed (max 2)</div>
            </div>
          </div>
          <div>
            <div className="view-form-card">
              {!sent ? (
                <>
                  <div className="price-row">
                    <div>
                      <div className="amt">{fmt(property.rent)} <span>/ mo</span></div>
                      <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Available {new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })}</div>
                    </div>
                    <span className="pill green"><span className="dot" /> Available</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Request a viewing</div>
                  <div className="field-group">
                    <div className="field">
                      <label>Full name</label>
                      <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Niamh Fitzpatrick" />
                    </div>
                    <div className="field row2">
                      <div><label>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="niamh@..." /></div>
                      <div><label>Phone</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="709-..." /></div>
                    </div>
                    <div className="field row2">
                      <div><label>Preferred date</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
                      <div>
                        <label>Time of day</label>
                        <select value={form.time} onChange={e => setForm({ ...form, time: e.target.value })}>
                          <option>Morning</option><option>Afternoon</option><option>Evening</option>
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Anything we should know?</label>
                      <textarea rows={2} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Pet, move-in date, questions..." />
                    </div>
                  </div>
                  <button className="submit-btn" onClick={() => setSent(true)}>Request viewing</button>
                  <div style={{ fontSize: 11, color: 'var(--ink-3)', textAlign: 'center', marginTop: 10 }}>
                    You won&rsquo;t be charged. Canary replies within a few hours.
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 10px' }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-ink)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <Check size={22} />
                  </div>
                  <h3 style={{ fontSize: 20, marginBottom: 6 }}>Viewing requested</h3>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-3)', margin: '0 0 14px' }}>
                    We&rsquo;ll text {form.phone || 'you'} to confirm a time. Keep an eye on your email.
                  </p>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-4)' }}>
                    REF · CNRY-{Math.floor(Math.random() * 90000 + 10000)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Rentals() {
  const { data: properties = [] } = useProperties();
  const [type, setType] = useState('All');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const listed = properties.filter(p => p.listed);
  const filtered = type === 'All' ? listed : listed.filter(p => p.type === type);
  const open = openId ? properties.find(p => p.id === openId) : null;

  return (
    <div>
      <div className="topnav">
        <div className="topnav-inner">
          <Wordmark />
          <nav>
            <Link href="/">Home</Link>
            <a style={{ color: 'var(--ink)', fontWeight: 600 }}>Rentals</a>
            <Link href="/owners">Owners</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
          <div className="spacer" />
          <button className="ghost-btn">Book a demo</button>
          <Link href="/login"><button className="login-btn">Log in</button></Link>
        </div>
      </div>

      <div className="rentals-filters">
        <div style={{ fontSize: 13, color: 'var(--ink-3)', marginRight: 12 }}>
          <strong style={{ color: 'var(--ink)' }}>{filtered.length}</strong> rentals in St. John&rsquo;s, NL
        </div>
        {[['All','All'],['single_family','Single Family'],['multi_family','Multi-Family'],['commercial','Commercial']].map(([val, label]) => (
          <button key={val} className={`filter-chip${type === val ? ' active' : ''}`} onClick={() => setType(val)}>{label}</button>
        ))}
        <div style={{ width: 12 }} />
        <button className="filter-chip"><Bed size={13} /> Any beds</button>
        <button className="filter-chip"><DollarSign size={13} /> Any price</button>
        <button className="filter-chip"><MapPin size={13} /> Any neighbourhood</button>
        <button className="filter-chip"><Calendar size={13} /> Move-in date</button>
        <div style={{ flex: 1 }} />
        <button className="filter-chip">More filters</button>
      </div>

      <div className="rentals-layout">
        <div className="rentals-grid-wrap">
          <div className="rentals-grid">
            {filtered.map((p, idx) => (
              <div key={p.id} className="listing-card"
                onMouseEnter={() => setActiveId(p.id)}
                onMouseLeave={() => setActiveId(null)}
                onClick={() => setOpenId(p.id)}>
                <div className="media ph-photo">
                  <img src={PROPERTY_IMAGES[idx % PROPERTY_IMAGES.length]} alt={p.address} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div className="badge">{p.type}</div>
                  <div className="like"><Heart size={14} /></div>
                </div>
                <div className="info">
                  <div className="row1"><span>{p.neighbourhood}</span></div>
                  <div className="addr">{p.address}</div>
                  <div className="meta">{(p.beds ?? 0) > 0 ? `${p.beds} bed · ${p.baths} bath · ` : ''}{(p.sqft ?? 0).toLocaleString()} sqft</div>
                  <div className="price">{fmt(p.rent)}<span> / month</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rentals-map">
          <div style={{ width: '100%', height: '100%', background: 'var(--bg-elev)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-4)', fontSize: 13 }}>Map view</div>
          {filtered.map(p => (
            <button key={p.id}
              className={`map-pin${activeId === p.id || openId === p.id ? ' active' : ''}`}
              style={{ left: (p.mapX ?? 0) + '%', top: (p.mapY ?? 0) + '%' }}
              onMouseEnter={() => setActiveId(p.id)}
              onMouseLeave={() => setActiveId(null)}
              onClick={() => setOpenId(p.id)}>
              {fmtCompact(p.rent)}
            </button>
          ))}
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button className="filter-chip" style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}><Plus size={14} /></button>
            <button className="filter-chip" style={{ width: 36, height: 36, padding: 0, justifyContent: 'center' }}><span style={{ fontSize: 16 }}>–</span></button>
          </div>
          <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(255,255,255,0.9)', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--ink-3)' }}>
            MAP — ST. JOHN&rsquo;S, NL
          </div>
        </div>
      </div>

      {open && <ListingSheet property={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
