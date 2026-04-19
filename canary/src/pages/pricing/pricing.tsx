import { Link } from 'wouter';
import Wordmark from '@ui/wordmark';
import { Check, ArrowRight } from 'lucide-react';

export default function Pricing() {
  const services = [
    { name: 'Leasing', price: '50%', unit: "of one month's rent", desc: 'Advertising & tenant acquisition', popular: false, cta: 'Schedule a demo', features: ['Professional property listings','Tenant screening & vetting','Lease preparation & signing','Move-in coordination','One-time fee per lease'] },
    { name: 'Long-Term Management', price: '12%', unit: 'of monthly rent', desc: 'Complete ongoing property management', popular: true, cta: 'Schedule a demo', features: ['Rent collection & follow-up','Tenant communication & support','Maintenance coordination','Monthly owner statements',"Tax documentation (T776's)",'10% discount for 2+ units'] },
    { name: 'Short-Term Management', price: '25%', unit: 'of monthly revenue', desc: 'Airbnb & vacation rental management', popular: false, cta: 'Schedule a demo', features: ['Multi-platform listing management','Guest screening & communication','Dynamic pricing optimization','Turnover & cleaning coordination','Guest support 24/7','Revenue analytics & reporting'] },
  ];

  const plans = [
    { name: 'Nest', price: 'Free', desc: 'For owner-operators with a handful of doors.', popular: false, cta: 'Start free', features: ['Up to 3 units','Tenant & lease tracking','Online rent payments','Basic maintenance requests','Mobile tenant portal'] },
    { name: 'Flock', price: '$5', unit: 'per door / mo', desc: 'For growing PM companies in Atlantic Canada.', popular: true, cta: 'Start 30-day trial', features: ['Unlimited units & portfolios',"Owner statements & T776's",'Vendor marketplace & work orders','Listings synced to your website','Accounting export (QBO, Xero)','Priority support'] },
    { name: 'Migration', price: "Let's talk", desc: 'For established managers moving from Buildium, AppFolio, or Yardi.', popular: false, cta: 'Talk to sales', features: ['Everything in Flock','White-glove data migration','Branded tenant portal','Custom integrations','Dedicated success manager','SLA & SSO'] },
  ];

  const faqs = [
    { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.' },
    { q: 'Is there a setup fee?', a: 'No, there are no setup or hidden fees. You only pay the monthly subscription for your software or the percentage for full-service management.' },
    { q: 'Do you offer discounts for multiple properties?', a: 'Yes! Full-service management offers a 10% discount when managing 2+ properties. Software plans also include volume discounts.' },
    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, bank transfers, and ACH payments. For full-service management, fees are automatically deducted from rent collection.' },
  ];

  return (
    <div>
      <div className="topnav">
        <div className="topnav-inner">
          <Wordmark />
          <nav>
            <Link href="/">Home</Link>
            <Link href="/rentals">Rentals</Link>
            <Link href="/owners">Owners</Link>
            <a style={{ color: 'var(--ink)', fontWeight: 600 }}>Pricing</a>
          </nav>
          <div className="spacer" />
          <button className="ghost-btn">Book a demo</button>
          <Link href="/login"><button className="login-btn">Log in</button></Link>
        </div>
      </div>

      <section style={{ padding: '80px 28px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(44px, 6vw, 64px)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16 }}>Simple, transparent pricing</h1>
          <p style={{ fontSize: 18, color: 'var(--ink-3)' }}>Pay only for what you use. No hidden fees.</p>
        </div>
      </section>

      <section style={{ padding: '0 28px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 12, fontSize: 28 }}>Management Services</h2>
          <p style={{ fontSize: 16, color: 'var(--ink-3)', marginBottom: 40 }}>Full-service solutions for property owners</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {services.map(s => (
              <div key={s.name} style={{ background: s.popular ? 'var(--ink)' : 'var(--bg-elev)', borderRadius: 12, padding: 32, border: s.popular ? 'none' : '1px solid var(--line)', position: 'relative', color: s.popular ? 'white' : 'inherit' }}>
                {s.popular && <div style={{ position: 'absolute', top: -12, left: 24, background: 'var(--accent)', color: 'var(--accent-ink)', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Most Popular</div>}
                <h3 style={{ marginBottom: 8, fontSize: 18 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: s.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)', marginBottom: 24 }}>{s.desc}</p>
                <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 4 }}>{s.price}</div>
                {s.unit && <div style={{ fontSize: 13, color: s.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)', marginBottom: 32 }}>{s.unit}</div>}
                <Link href="/login" style={{ display: 'block', width: '100%', padding: '12px 24px', marginBottom: 32, border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, background: s.popular ? 'var(--accent)' : 'var(--ink)', color: s.popular ? 'var(--accent-ink)' : 'white', textAlign: 'center', textDecoration: 'none' }}>{s.cta}</Link>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {s.features.map(f => (
                    <li key={f} style={{ marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: s.popular ? 'rgba(255,255,255,0.9)' : 'inherit' }}>
                      <Check size={16} style={{ color: s.popular ? 'var(--accent)' : 'var(--green)', flexShrink: 0, marginTop: 2 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '0 28px 80px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 12, fontSize: 28 }}>Software Plans</h2>
          <p style={{ fontSize: 16, color: 'var(--ink-3)', marginBottom: 40 }}>For self-managed property owners who want professional tools</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            {plans.map(p => (
              <div key={p.name} style={{ background: p.popular ? 'var(--ink)' : 'var(--bg-elev)', borderRadius: 12, padding: 32, border: p.popular ? 'none' : '1px solid var(--line)', position: 'relative', color: p.popular ? 'white' : 'inherit' }}>
                {p.popular && <div style={{ position: 'absolute', top: -12, left: 24, background: 'var(--accent)', color: 'var(--accent-ink)', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Most Popular</div>}
                <h3 style={{ marginBottom: 8, fontSize: 18 }}>{p.name}</h3>
                <p style={{ fontSize: 13, color: p.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)', marginBottom: 24 }}>{p.desc}</p>
                <div style={{ fontSize: 48, fontWeight: 700, marginBottom: 4 }}>{p.price}</div>
                {p.unit && <div style={{ fontSize: 13, color: p.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)', marginBottom: 32 }}>{p.unit}</div>}
                <Link href="/login" style={{ display: 'block', width: '100%', padding: '12px 24px', marginBottom: 32, border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, background: p.popular ? 'var(--accent)' : 'var(--ink)', color: p.popular ? 'var(--accent-ink)' : 'white', textAlign: 'center', textDecoration: 'none' }}>{p.cta}</Link>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {p.features.map(f => (
                    <li key={f} style={{ marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: p.popular ? 'rgba(255,255,255,0.9)' : 'inherit' }}>
                      <Check size={16} style={{ color: p.popular ? 'var(--accent)' : 'var(--green)', flexShrink: 0, marginTop: 2 }} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 80, paddingTop: 80, borderTop: '1px solid var(--line)' }}>
            <h2 style={{ marginBottom: 40, textAlign: 'center', fontSize: 28 }}>Frequently asked questions</h2>
            <div style={{ maxWidth: 600, margin: '0 auto', display: 'grid', gap: 20 }}>
              {faqs.map(item => (
                <div key={item.q} style={{ background: 'var(--bg-elev)', borderRadius: 8, padding: 24 }}>
                  <h4 style={{ marginBottom: 12, fontSize: 15 }}>{item.q}</h4>
                  <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6 }}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--accent)', color: 'var(--accent-ink)', padding: '60px 0', textAlign: 'center' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px' }}>
          <h2 style={{ marginBottom: 12 }}>Ready to get started?</h2>
          <p style={{ fontSize: 16, marginBottom: 32, opacity: 0.95 }}>Choose your plan and start managing properties smarter today</p>
          <Link href="/login" style={{ background: 'var(--accent-ink)', color: 'var(--accent)', padding: '14px 28px', borderRadius: 8, border: 'none', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            Get started free <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
