function Pricing({ navigate }) {
  const { useState } = React;
  const Icon = window.Icon;

  return (
    <div>
      <div className="topnav">
        <div className="topnav-inner">
          <Wordmark />
          <nav>
            <a onClick={() => navigate('/')} style={{cursor:'pointer'}}>Home</a>
            <a onClick={() => navigate('/rentals')} style={{cursor:'pointer'}}>Rentals</a>
            <a onClick={() => navigate('/owners')} style={{cursor:'pointer'}}>Owners</a>
            <a style={{color:'var(--ink)', fontWeight:600}}>Pricing</a>
          </nav>
          <div className="spacer"></div>
          <button className="ghost-btn">Book a demo</button>
          <button className="login-btn" onClick={() => navigate('/login')}>Log in</button>
        </div>
      </div>

      <section className="pricing-hero">
        <div className="container">
          <h1>Simple, transparent pricing</h1>
          <p className="subtitle">Pay only for what you use. No hidden fees.</p>
        </div>
      </section>

      {/* Service Management Pricing */}
      <section className="pricing-section">
        <div className="container">
          <div style={{marginBottom: 48}}>
            <h2 style={{marginBottom: 24}}>Management Services</h2>
            <p style={{fontSize: 16, color: 'var(--ink-3)', marginBottom: 40}}>Full-service solutions for property owners</p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
              {[
                {
                  name: 'Leasing',
                  price: '50%',
                  unit: 'of one month\'s rent',
                  desc: 'Advertising & tenant acquisition',
                  features: [
                    'Professional property listings',
                    'Tenant screening & vetting',
                    'Lease preparation & signing',
                    'Move-in coordination',
                    'One-time fee per lease'
                  ],
                  cta: 'Schedule a demo',
                  ctaStyle: {background: 'var(--ink)', color: 'white'}
                },
                {
                  name: 'Long-Term Management',
                  price: '12%',
                  unit: 'of monthly rent',
                  desc: 'Complete ongoing property management',
                  features: [
                    'Rent collection & follow-up',
                    'Tenant communication & support',
                    'Maintenance coordination',
                    'Monthly owner statements',
                    'Tax documentation (T776\'s)',
                    '10% discount for 2+ units'
                  ],
                  cta: 'Schedule a demo',
                  ctaStyle: {background: 'var(--accent)', color: 'var(--accent-ink)'},
                  popular: true
                },
                {
                  name: 'Short-Term Management',
                  price: '25%',
                  unit: 'of monthly revenue',
                  desc: 'Airbnb & vacation rental management',
                  features: [
                    'Multi-platform listing management',
                    'Guest screening & communication',
                    'Dynamic pricing optimization',
                    'Turnover & cleaning coordination',
                    'Guest support 24/7',
                    'Revenue analytics & reporting'
                  ],
                  cta: 'Schedule a demo',
                  ctaStyle: {background: 'var(--ink)', color: 'white'}
                }
              ].map((service, idx) => (
                <div key={idx} style={{
                  background: service.popular ? 'var(--ink)' : 'var(--bg-elev)',
                  borderRadius: 12,
                  padding: 32,
                  border: service.popular ? 'none' : '1px solid var(--line)',
                  position: 'relative',
                  color: service.popular ? 'white' : 'inherit'
                }}>
                  {service.popular && (
                    <div style={{position: 'absolute', top: -12, left: 24, background: 'var(--accent)', color: 'var(--accent-ink)', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{marginBottom: 8, fontSize: 18}}>{service.name}</h3>
                  <p style={{fontSize: 13, color: service.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)', marginBottom: 24}}>{service.desc}</p>
                  <div style={{marginBottom: 32}}>
                    <div style={{fontSize: 48, fontWeight: 700, marginBottom: 4}}>{service.price}</div>
                    {service.unit && <div style={{fontSize: 13, color: service.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)'}}>{service.unit}</div>}
                  </div>
                  <button onClick={() => navigate('/login')} style={{width: '100%', padding: '12px 24px', marginBottom: 32, border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, ...service.ctaStyle}}>
                    {service.cta}
                  </button>
                  <div>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                      {service.features.map((feat, i) => (
                        <li key={i} style={{marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: service.popular ? 'rgba(255,255,255,0.9)' : 'inherit'}}>
                          <Icon name="check" size={16} style={{color: service.popular ? 'var(--accent)' : 'var(--green)', flexShrink: 0, marginTop: 2}}/>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Software Pricing */}
          <div style={{marginTop: 80}}>
            <h2 style={{marginBottom: 24}}>Software Plans</h2>
            <p style={{fontSize: 16, color: 'var(--ink-3)', marginBottom: 40}}>For self-managed property owners who want professional tools</p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
              {[
                {
                  name: 'Nest',
                  price: 'Free',
                  desc: 'For owner-operators with a handful of doors.',
                  features: [
                    'Up to 3 units',
                    'Tenant & lease tracking',
                    'Online rent payments',
                    'Basic maintenance requests',
                    'Mobile tenant portal'
                  ],
                  cta: 'Start free',
                  ctaStyle: {background: 'var(--ink)', color: 'white'}
                },
                {
                  name: 'Flock',
                  price: '$5',
                  unit: 'per door / mo',
                  desc: 'For growing PM companies in Atlantic Canada.',
                  features: [
                    'Unlimited units & portfolios',
                    'Owner statements & T776\'s',
                    'Vendor marketplace & work orders',
                    'Listings synced to your website',
                    'Accounting export (QBO, Xero)',
                    'Priority support'
                  ],
                  cta: 'Start 30-day trial',
                  ctaStyle: {background: 'var(--accent)', color: 'var(--accent-ink)'},
                  popular: true
                },
                {
                  name: 'Migration',
                  price: 'Let\'s talk',
                  desc: 'For established managers moving from Buildium, AppFolio, or Yardi.',
                  features: [
                    'Everything in Flock',
                    'White-glove data migration',
                    'Branded tenant portal',
                    'Custom integrations',
                    'Dedicated success manager',
                    'SLA & SSO'
                  ],
                  cta: 'Talk to sales',
                  ctaStyle: {background: 'var(--ink)', color: 'white'}
                }
              ].map((plan, idx) => (
                <div key={idx} style={{
                  background: plan.popular ? 'var(--ink)' : 'var(--bg-elev)',
                  borderRadius: 12,
                  padding: 32,
                  border: plan.popular ? 'none' : '1px solid var(--line)',
                  position: 'relative',
                  color: plan.popular ? 'white' : 'inherit'
                }}>
                  {plan.popular && (
                    <div style={{position: 'absolute', top: -12, left: 24, background: 'var(--accent)', color: 'var(--accent-ink)', padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{marginBottom: 8, fontSize: 18}}>{plan.name}</h3>
                  <p style={{fontSize: 13, color: plan.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)', marginBottom: 24}}>{plan.desc}</p>
                  <div style={{marginBottom: 32}}>
                    <div style={{fontSize: 48, fontWeight: 700, marginBottom: 4}}>{plan.price}</div>
                    {plan.unit && <div style={{fontSize: 13, color: plan.popular ? 'rgba(255,255,255,0.7)' : 'var(--ink-3)'}}>{plan.unit}</div>}
                  </div>
                  <button style={{width: '100%', padding: '12px 24px', marginBottom: 32, border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer', fontSize: 14, ...plan.ctaStyle}}>
                    {plan.cta}
                  </button>
                  <div>
                    <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
                      {plan.features.map((feat, i) => (
                        <li key={i} style={{marginBottom: 12, display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: plan.popular ? 'rgba(255,255,255,0.9)' : 'inherit'}}>
                          <Icon name="check" size={16} style={{color: plan.popular ? 'var(--accent)' : 'var(--green)', flexShrink: 0, marginTop: 2}}/>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div style={{marginTop: 80, paddingTop: 80, borderTop: '1px solid var(--line)'}}>
            <h2 style={{marginBottom: 40, textAlign: 'center'}}>Frequently asked questions</h2>
            <div style={{maxWidth: 600, margin: '0 auto', display: 'grid', gap: 20}}>
              {[
                {
                  q: 'Can I switch plans anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.'
                },
                {
                  q: 'Is there a setup fee?',
                  a: 'No, there are no setup or hidden fees. You only pay the monthly subscription for your software or the percentage for full-service management.'
                },
                {
                  q: 'Do you offer discounts for multiple properties?',
                  a: 'Yes! Full-service management offers a 10% discount when managing 2+ properties. Software plans also include volume discounts.'
                },
                {
                  q: 'What payment methods do you accept?',
                  a: 'We accept all major credit cards, bank transfers, and ACH payments. For full-service management, fees are automatically deducted from rent collection.'
                }
              ].map((item, idx) => (
                <div key={idx} style={{background: 'var(--bg-elev)', borderRadius: 8, padding: 24}}>
                  <h4 style={{marginBottom: 12, fontSize: 15}}>{item.q}</h4>
                  <p style={{margin: 0, fontSize: 14, color: 'var(--ink-3)', lineHeight: 1.6}}>{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{background: 'var(--accent)', color: 'var(--accent-ink)', padding: '60px 0', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{marginBottom: 12}}>Ready to get started?</h2>
          <p style={{fontSize: 16, marginBottom: 32, opacity: 0.95}}>Choose your plan and start managing properties smarter today</p>
          <button className="cta-full" onClick={() => navigate('/login')} style={{background: 'var(--accent-ink)', color: 'var(--accent)'}}>
            Get started free <Icon name="arrow_right" size={14}/>
          </button>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Pricing });