function Owners({ navigate }) {
  const { useState } = React;
  const Icon = window.Icon;
  const [selectedTier, setSelectedTier] = useState('self');

  return (
    <div className="owners-page">
      {/* Hero */}
      <section className="owners-hero">
        <div className="container">
          <h1>Grow your rental portfolio with confidence</h1>
          <p className="hero-sub">Two ways to manage your properties: go hands-on with our tools, or hand it all off to us.</p>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="service-tiers">
        <div className="container">
          <div className="tier-grid">
            {/* Self-Manage Tier */}
            <div className={`tier-card ${selectedTier === 'self' ? 'selected' : ''}`} onClick={() => setSelectedTier('self')}>
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
                  <li><Icon name="check_circle" size={18}/> Tenant & lease tracking</li>
                  <li><Icon name="check_circle" size={18}/> Online rent payments</li>
                  <li><Icon name="check_circle" size={18}/> Maintenance request management</li>
                  <li><Icon name="check_circle" size={18}/> Payment reporting & statements</li>
                  <li><Icon name="check_circle" size={18}/> Mobile app access</li>
                  <li><Icon name="check_circle" size={18}/> Email & chat support</li>
                </ul>
              </div>

              <button className="cta-full" onClick={() => navigate('/login')}>
                Get started free <Icon name="arrow_right" size={14}/>
              </button>
            </div>

            {/* Full-Service Tier */}
            <div className={`tier-card featured ${selectedTier === 'fullservice' ? 'selected' : ''}`} onClick={() => setSelectedTier('fullservice')}>
              <div className="badge">Most popular</div>
              
              <div className="tier-header">
                <h2>Full-Service Management</h2>
                <p className="tier-desc">We handle everything, you relax</p>
              </div>
              
              <div className="tier-pricing">
                <div className="price-box">
                  <span className="price-label">Advertising & Leasing</span>
                  <span className="price">50%</span>
                  <span className="unit">of one month's rent</span>
                  <span className="note">100% for non-managed properties</span>
                </div>
                <div className="price-box">
                  <span className="price-label">Long-term rentals</span>
                  <span className="price">12%</span>
                  <span className="unit">of monthly rent</span>
                  <span className="note">10% for 2+ units</span>
                </div>
                <div className="price-box">
                  <span className="price-label">Short-term rentals</span>
                  <span className="price">25%</span>
                  <span className="unit">of revenue</span>
                </div>
              </div>

              <div className="tier-features">
                <h3>Complete ownership</h3>
                <div className="features-group">
                  <h4>Front-end management</h4>
                  <ul>
                    <li><Icon name="check_circle" size={18}/> Tenant screening & vetting</li>
                    <li><Icon name="check_circle" size={18}/> Lease preparation & signing</li>
                    <li><Icon name="check_circle" size={18}/> Key management & access</li>
                  </ul>
                </div>
                
                <div className="features-group">
                  <h4>Ongoing operations</h4>
                  <ul>
                    <li><Icon name="check_circle" size={18}/> Rent collection & follow-up</li>
                    <li><Icon name="check_circle" size={18}/> Tenant communication hub</li>
                    <li><Icon name="check_circle" size={18}/> Maintenance coordination</li>
                    <li><Icon name="check_circle" size={18}/> 24/7 tenant support</li>
                  </ul>
                </div>

                <div className="features-group">
                  <h4>Short-term rental (STR) support</h4>
                  <ul>
                    <li><Icon name="check_circle" size={18}/> Listed on Airbnb, VRBO, Booking.com</li>
                    <li><Icon name="check_circle" size={18}/> Direct booking management</li>
                    <li><Icon name="check_circle" size={18}/> Guest screening & communication</li>
                    <li><Icon name="check_circle" size={18}/> 24/7 guest support</li>
                    <li><Icon name="check_circle" size={18}/> Revenue optimization</li>
                  </ul>
                </div>

                <div className="features-group">
                  <h4>Reporting & compliance</h4>
                  <ul>
                    <li><Icon name="check_circle" size={18}/> Monthly owner statements</li>
                    <li><Icon name="check_circle" size={18}/> Tax documentation (T776's)</li>
                    <li><Icon name="check_circle" size={18}/> Property analytics & insights</li>
                  </ul>
                </div>
              </div>

              <button className="cta-full accent" onClick={() => navigate('/login')}>
                Schedule a demo <Icon name="arrow_right" size={14}/>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="comparison">
        <div className="container">
          <h2>Compare at a glance</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Self-Manage</th>
                <th>Full-Service</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tenant screening</td>
                <td><Icon name="close" size={20} style={{color:'var(--ink-3)'}}/></td>
                <td><Icon name="check_circle" size={20} style={{color:'var(--green)'}}/></td>
              </tr>
              <tr>
                <td>Lease & agreement prep</td>
                <td><Icon name="close" size={20} style={{color:'var(--ink-3)'}}/></td>
                <td><Icon name="check_circle" size={20} style={{color:'var(--green)'}}/></td>
              </tr>
              <tr>
                <td>Rent collection</td>
                <td><Icon name="check_circle" size={20} style={{color:'var(--green)'}}/></td>
                <td><Icon name="check_circle" size={20} style={{color:'var(--green)'}}/></td>
              </tr>
              <tr>
                <td>Tenant support</td>
                <td>Email only</td>
                <td>24/7 phone, email, chat</td>
              </tr>
              <tr>
                <td>Maintenance management</td>
                <td>Track requests</td>
                <td>Full coordination & dispatch</td>
              </tr>
              <tr>
                <td>Short-term rental management</td>
                <td><Icon name="close" size={20} style={{color:'var(--ink-3)'}}/></td>
                <td><Icon name="check_circle" size={20} style={{color:'var(--green)'}}/></td>
              </tr>
              <tr>
                <td>Monthly statements & tax docs</td>
                <td>Self-reported</td>
                <td>Provided by Canary</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why Canary */}
      <section className="why-canary">
        <div className="container">
          <h2>Why owners choose Canary</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon" style={{background:'linear-gradient(135deg, #F5C518 0%, #D4AF37 100%)'}}>
                <Icon name="trending_up" size={24} style={{color:'#000'}}/>
              </div>
              <h3>Maximize revenue</h3>
              <p>Our pricing strategies and market analysis help you get the best rents and occupancy rates.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon" style={{background:'linear-gradient(135deg, #8B7355 0%, #5C4033 100%)'}}>
                <Icon name="shield_check" size={24} style={{color:'#fff'}}/>
              </div>
              <h3>Professional screening</h3>
              <p>Thorough background and credit checks to find reliable tenants who pay on time.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon" style={{background:'linear-gradient(135deg, #1a1814 0%, #333 100%)'}}>
                <Icon name="clock" size={24} style={{color:'#fff'}}/>
              </div>
              <h3>24/7 support</h3>
              <p>Issues at 2 AM? We're here. Full-service comes with round-the-clock tenant and guest support.</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon" style={{background:'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'}}>
                <Icon name="analytics" size={24} style={{color:'#fff'}}/>
              </div>
              <h3>Complete transparency</h3>
              <p>Real-time dashboards show occupancy, revenue, expenses, and net distributions anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="owners-cta">
        <div className="container">
          <h2>Ready to take your properties to the next level?</h2>
          <div className="cta-buttons">
            <button className="cta-primary" onClick={() => navigate('/login')}>
              Start free <Icon name="arrow_right" size={14}/>
            </button>
            <button className="cta-secondary">
              Schedule a demo <Icon name="arrow_right" size={14}/>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { Owners });
