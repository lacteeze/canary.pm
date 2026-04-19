import { type ComponentType } from 'react';
import { Link } from 'wouter';
import { useProperties } from '@hooks/use-properties';
import Wordmark from '@ui/wordmark';

const fmt = (n: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);
import {
  Users, Building, Briefcase, FileText, Wrench, CreditCard,
  ArrowRight,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import PhotoPlaceholder from '@ui/photo-placeholder';
import { LineChart, Donut } from '@ui/charts';

interface FeatureCellProps {
  num: string;
  icon: ComponentType<LucideProps>;
  title: string;
  body: string;
}

function FeatureCell({ num, icon: IconComp, title, body }: FeatureCellProps) {
  return (
    <div className="feature-cell">
      <div className="icon"><IconComp size={18} /></div>
      <h4>{title}</h4>
      <p>{body}</p>
      <div className="num">{num}</div>
    </div>
  );
}

interface PriceCardProps {
  name: string;
  price: string;
  per?: string;
  desc: string;
  items: string[];
  cta: string;
  featured?: boolean;
}

function PriceCard({ name, price, per, desc, items, cta, featured }: PriceCardProps) {
  return (
    <div className={`price-card${featured ? ' featured' : ''}`}>
      {featured && <span className="badge">Most popular</span>}
      <h4>{name}</h4>
      <div className="price">
        {price === 'Custom' ? (
          <span className="num" style={{ fontSize: 32 }}>Let&rsquo;s talk</span>
        ) : (
          <>
            <span className="num">{price === '0' ? 'Free' : `$${price}`}</span>
            {per && <span className="per">{per}</span>}
          </>
        )}
      </div>
      <div className="desc">{desc}</div>
      <ul>
        {items.map((it, i) => (
          <li key={i}><span className="check">✓</span> {it}</li>
        ))}
      </ul>
      <button className="cta-btn">{cta}</button>
    </div>
  );
}

function MiniDashPreview() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
      <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 10, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Monthly revenue</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em' }}>$61,480</div>
          </div>
          <div className="segmented">
            <button>3M</button><button className="active">12M</button><button>All</button>
          </div>
        </div>
        <LineChart height={160}
          labels={['May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr']}
          series={[{ color: '#1a1814', data: [48,51,52,55,56,58,56,58,57,60,58,62].map(v => v * 10000) }]} />
      </div>
      <div style={{ background: 'var(--bg-elev)', border: '1px solid var(--line)', borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10 }}>Occupancy by type</div>
        <Donut total="92%" segments={[
          { color: '#1a1814', value: 92 },
          { color: '#F5C518', value: 8 },
        ]} />
        <div className="donut-legend" style={{ marginTop: 10 }}>
          <div className="row"><span className="sw" style={{ background: '#1a1814' }} /> Occupied · 26</div>
          <div className="row"><span className="sw" style={{ background: '#F5C518' }} /> Vacant · 23</div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const { data: properties = [] } = useProperties();

  return (
    <div className="landing">
      <div className="topnav">
        <div className="topnav-inner">
          <Wordmark />
          <nav>
            <Link href="/rentals">Rentals</Link>
            <Link href="/owners">Owners</Link>
            <Link href="/pricing">Pricing</Link>
            <a>About</a>
          </nav>
          <div className="spacer" />
          <button className="ghost-btn">Book a demo</button>
          <Link href="/login"><button className="login-btn">Log in</button></Link>
        </div>
      </div>

      <section className="hero">
        <span className="hero-eyebrow"><span className="pulse" /> Now serving 280+ properties across Newfoundland</span>
        <h1>Property management that <span className="accent-underline">keeps you informed.</span></h1>
        <p className="hero-sub">
          Canary is the modern operating system for property managers, owners, and tenants in St. John&rsquo;s and across Atlantic Canada. Fewer spreadsheets, fewer surprises.
        </p>

        <div className="hero-split">
          <Link href="/login" className="hero-card owners">
            <span className="tag">For property owners &amp; managers</span>
            <h3>Every door, every dollar — one dashboard.</h3>
            <p>Manage portfolios of single-family, multi-family, and commercial properties. Automate rent collection, lease renewals, and maintenance.</p>
            <span className="cta">Manage your properties <ArrowRight size={14} /></span>
          </Link>
          <Link href="/rentals" className="hero-card tenants">
            <span className="tag">For tenants &amp; renters</span>
            <h3>Find a place. Pay rent. Get things fixed.</h3>
            <p>Browse rentals managed by Canary, schedule a viewing in seconds, and handle everything after you move in — from one clean portal.</p>
            <span className="cta">Browse rentals <ArrowRight size={14} /></span>
          </Link>
        </div>

        <div className="stats-strip">
          <div className="stat-cell"><div className="num">284<span className="unit"> doors</span></div><div className="label">Under management across NL</div></div>
          <div className="stat-cell"><div className="num">98.4<span className="unit">%</span></div><div className="label">On-time rent collection, last 12 mo</div></div>
          <div className="stat-cell"><div className="num">4.8<span className="unit">/5</span></div><div className="label">Avg. tenant satisfaction score</div></div>
          <div className="stat-cell"><div className="num">&lt;2<span className="unit">h</span></div><div className="label">Median maintenance response</div></div>
        </div>
      </section>

      <section className="section">
        <div className="section-head" style={{ alignItems: 'center' }}>
          <div>
            <div className="eyebrow">Available now</div>
            <h2>Find your next place in St. John&rsquo;s.</h2>
          </div>
          <p className="sub">Every property we manage, listed in one place. Book a viewing in under a minute — no landlord hide-and-seek.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {properties.filter(p => p.listed).slice(0, 4).map(p => (
            <Link key={p.id} href="/rentals" className="listing-card">
              <div className="media ph-photo">
                <PhotoPlaceholder seed={p.photoSeed ?? 0} label={(p.neighbourhood ?? '').toUpperCase()} />
                <div className="badge">{p.type}</div>
              </div>
              <div className="info">
                <div className="row1"><span>{p.neighbourhood}</span></div>
                <div className="addr">{p.address}</div>
                <div className="meta">{(p.beds ?? 0) > 0 ? `${p.beds} bd · ${p.baths} ba · ` : ''}{(p.sqft ?? 0).toLocaleString()} sqft</div>
                <div className="price">{fmt(p.rent)}<span> / mo</span></div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <Link href="/rentals" className="btn btn-accent btn-lg">
            See all {properties.filter(p => p.listed).length} available listings <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 20 }}>
        <div className="eyebrow">The Platform</div>
        <div className="section-head">
          <h2>A small, well-designed set of tools. That&rsquo;s all it takes.</h2>
          <p className="sub">Everything property managers use daily — rebuilt with the attention to detail you&rsquo;d expect from your favourite apps. Nothing more.</p>
        </div>
        <div className="feature-grid">
          <FeatureCell num="01" icon={Users} title="People, connected" body="Clients, tenants, and vendors in one rolodex. Relationships between them are modelled, not imagined — a tenant always knows which lease, property, and owner they belong to." />
          <FeatureCell num="02" icon={Building} title="Any type of door" body="Single-family homes, a 12-unit walk-up on Gower, a commercial storefront on Water St. Canary speaks all three — with the right fields and workflows for each." />
          <FeatureCell num="03" icon={Briefcase} title="Portfolios that split & merge" body="Two partners own three buildings together. One of them also owns two commercial units solo. Canary handles the math — and the paperwork." />
          <FeatureCell num="04" icon={FileText} title="Leases that remind themselves" body="Digital signing, auto-renewal nudges, escalation schedules, and a clean audit log. Your file cabinet, retired." />
          <FeatureCell num="05" icon={Wrench} title="Maintenance, triaged" body="Tenants file, vendors bid, managers approve, work gets done. Every step timestamped; every photo attached." />
          <FeatureCell num="06" icon={CreditCard} title="Payments, quietly reliable" body="Pre-authorized debit, e-transfer, credit — and a reconciliation view that doesn't make your accountant cry." />
        </div>
        <div className="preview-wrap">
          <div className="preview-chrome">
            <span className="dot" /><span className="dot" /><span className="dot" />
            <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>canary.pm / dashboard</span>
          </div>
          <div style={{ padding: 24, background: 'var(--bg)' }}>
            <MiniDashPreview />
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="eyebrow">Pricing</div>
        <div className="section-head">
          <h2>Manage your own rentals with Canary.</h2>
          <p className="sub">Plans scale by door. No per-seat gotchas, no onboarding fees, and a free tier generous enough to actually try.</p>
        </div>
        <div className="pricing-grid">
          <PriceCard name="Nest" price="0" desc="For owner-operators with a handful of doors." items={['Up to 3 units','Tenant & lease tracking','Online rent payments','Basic maintenance requests','Mobile tenant portal']} cta="Start free" />
          <PriceCard featured name="Flock" price="5" per="per door / mo" desc="For growing PM companies in Atlantic Canada." items={['Unlimited units & portfolios',"Owner statements & T776's",'Vendor marketplace & work orders','Listings synced to your website','Accounting export (QBO, Xero)','Priority support']} cta="Start 30-day trial" />
          <PriceCard name="Migration" price="Custom" desc="For established managers moving from Buildium, AppFolio, or Yardi." items={['Everything in Flock','White-glove data migration','Branded tenant portal','Custom integrations','Dedicated success manager','SLA & SSO']} cta="Talk to sales" />
        </div>
      </section>

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <Wordmark />
            <p style={{ color: 'var(--ink-3)', maxWidth: 280, marginTop: 14, fontSize: 14 }}>
              Property management software, built from a row house on Gower Street.
            </p>
            <p style={{ color: 'var(--ink-4)', fontSize: 12, fontFamily: 'var(--font-mono)', marginTop: 18 }}>
              47.5615° N, 52.7126° W
            </p>
          </div>
          <div><h5>Product</h5><ul><li>Landing</li><li>Rentals</li><li>Pricing</li><li>Changelog</li></ul></div>
          <div><h5>For Managers</h5><ul><li>Migration</li><li>Vendor network</li><li>Accounting</li><li>API</li></ul></div>
          <div><h5>Company</h5><ul><li>About</li><li>Careers</li><li>Press</li><li>Contact</li></ul></div>
          <div><h5>Legal</h5><ul><li>Terms</li><li>Privacy</li><li>Security</li><li>Accessibility</li></ul></div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Canary Property Management Inc.</span>
          <span className="mono">St. John&rsquo;s, NL &mdash; est. 2024</span>
        </div>
      </footer>
    </div>
  );
}
