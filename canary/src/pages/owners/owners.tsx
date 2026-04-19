import { useState, type ComponentType } from 'react';
import { Link } from 'wouter';
import { Check, X, ArrowRight, BarChart3, Bell } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

export default function Owners() {
  const [selectedTier, setSelectedTier] = useState<'self' | 'fullservice'>('self');

  return (
    <div className="owners-page">
      <section className="owners-hero">
        <div className="container">
          <h1>Grow your rental portfolio with confidence</h1>
          <p className="hero-sub">Two ways to manage your properties: go hands-on with our tools, or hand it all off to us.</p>
        </div>
      </section>

      <section className="service-tiers">
        <div className="container">
          <div className="tier-grid">
            <div className={`tier-card${selectedTier === 'self' ? ' selected' : ''}`} onClick={() => setSelectedTier('self')}>
              <div className="tier-header">
                <h2>Self-Manage</h2>
                <p className="tier-desc">Stay in control with our platform</p>
              </div>
              <div className="tier-pricing">
                <div className="price-box">
                  <span className="price">Free</span>
                  <span className="unit">for first 3 units</span>
                </div>
                <div className="price-box">
                  <span className="price">$5</span>
                  <span className="unit">per door / month</span>
                  <span className="note">after 3 units</span>
                </div>
              </div>
              <div className="tier-features">
                <h3>What you get</h3>
                <ul>
                  {['Tenant & lease tracking','Online rent payments','Maintenance request management','Payment reporting & statements','Mobile app access','Email & chat support'].map(f => (
                    <li key={f}><Check size={18} /> {f}</li>
                  ))}
                </ul>
              </div>
              <Link href="/login" className="cta-full">
                Get started free <ArrowRight size={14} />
              </Link>
            </div>

            <div className={`tier-card featured${selectedTier === 'fullservice' ? ' selected' : ''}`} onClick={() => setSelectedTier('fullservice')}>
              <div className="badge">Most popular</div>
              <div className="tier-header">
                <h2>Full-Service Management</h2>
                <p className="tier-desc">We handle everything, you relax</p>
              </div>
              <div className="tier-pricing">
                <div className="price-box"><span className="price-label">Advertising & Leasing</span><span className="price">50%</span><span className="unit">of one month&rsquo;s rent</span><span className="note">100% for non-managed properties</span></div>
                <div className="price-box"><span className="price-label">Long-term rentals</span><span className="price">12%</span><span className="unit">of monthly rent</span><span className="note">10% for 2+ units</span></div>
                <div className="price-box"><span className="price-label">Short-term rentals</span><span className="price">25%</span><span className="unit">of revenue</span></div>
              </div>
              <div className="tier-features">
                <h3>Complete ownership</h3>
                {[
                  { heading: 'Front-end management', items: ['Tenant screening & vetting','Lease preparation & signing','Key management & access'] },
                  { heading: 'Ongoing operations', items: ['Rent collection & follow-up','Tenant communication hub','Maintenance coordination','24/7 tenant support'] },
                  { heading: 'Short-term rental (STR) support', items: ['Listed on Airbnb, VRBO, Booking.com','Direct booking management','Guest screening & communication','24/7 guest support','Revenue optimization'] },
                  { heading: 'Reporting & compliance', items: ['Monthly owner statements',"Tax documentation (T776's)",'Property analytics & insights'] },
                ].map(g => (
                  <div key={g.heading} className="features-group">
                    <h4>{g.heading}</h4>
                    <ul>{g.items.map(item => <li key={item}><Check size={18} /> {item}</li>)}</ul>
                  </div>
                ))}
              </div>
              <Link href="/login" className="cta-full accent">
                Schedule a demo <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="comparison">
        <div className="container">
          <h2>Compare at a glance</h2>
          <table className="comparison-table">
            <thead><tr><th>Feature</th><th>Self-Manage</th><th>Full-Service</th></tr></thead>
            <tbody>
              {[
                ['Tenant screening', false, true],
                ['Lease & agreement prep', false, true],
                ['Rent collection', true, true],
                ['Tenant support', 'Email only', '24/7 phone, email, chat'],
                ['Maintenance management', 'Track requests', 'Full coordination & dispatch'],
                ['Short-term rental management', false, true],
                ['Monthly statements & tax docs', 'Self-reported', 'Provided by Canary'],
              ].map(([feat, self, full]) => (
                <tr key={String(feat)}>
                  <td>{feat}</td>
                  <td>{typeof self === 'boolean' ? (self ? <Check size={20} style={{ color: 'var(--green)' }} /> : <X size={20} style={{ color: 'var(--ink-3)' }} />) : self}</td>
                  <td>{typeof full === 'boolean' ? (full ? <Check size={20} style={{ color: 'var(--green)' }} /> : <X size={20} style={{ color: 'var(--ink-3)' }} />) : full}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="why-canary">
        <div className="container">
          <h2>Why owners choose Canary</h2>
          <div className="benefits-grid">
            {([
              { bg: 'linear-gradient(135deg, #F5C518 0%, #D4AF37 100%)', iconColor: '#000', icon: BarChart3, title: 'Maximize revenue', body: 'Our pricing strategies and market analysis help you get the best rents and occupancy rates.' },
              { bg: 'linear-gradient(135deg, #8B7355 0%, #5C4033 100%)', iconColor: '#fff', icon: Check, title: 'Professional screening', body: 'Thorough background and credit checks to find reliable tenants who pay on time.' },
              { bg: 'linear-gradient(135deg, #1a1814 0%, #333 100%)', iconColor: '#fff', icon: Bell, title: '24/7 support', body: 'Issues at 2 AM? We\u2019re here. Full-service comes with round-the-clock tenant and guest support.' },
              { bg: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', iconColor: '#fff', icon: BarChart3, title: 'Complete transparency', body: 'Real-time dashboards show occupancy, revenue, expenses, and net distributions anytime.' },
            ] as { bg: string; iconColor: string; icon: ComponentType<LucideProps>; title: string; body: string }[]).map(b => {
              const BenefitIcon = b.icon;
              return (
                <div key={b.title} className="benefit-card">
                  <div className="benefit-icon" style={{ background: b.bg }}>
                    <BenefitIcon size={24} style={{ color: b.iconColor }} />
                  </div>
                  <h3>{b.title}</h3>
                  <p>{b.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="owners-cta">
        <div className="container">
          <h2>Ready to take your properties to the next level?</h2>
          <div className="cta-buttons">
            <Link href="/login" className="cta-primary">Start free <ArrowRight size={14} /></Link>
            <Link href="/login" className="cta-secondary">Schedule a demo <ArrowRight size={14} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
