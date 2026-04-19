import { useRoute } from 'wouter';
import { useProperty } from '@hooks/use-properties';
import Topbar from '@ui/topbar';
import PhotoPlaceholder from '@ui/photo-placeholder';
import { Bed, Bath, Ruler, Building, MapPin, Calendar } from 'lucide-react';

const fmt = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n);

export default function Property() {
  const [, params] = useRoute('/properties/:id');
  const id = params?.id ?? '';
  const { data: property, isLoading } = useProperty(id);

  if (isLoading) {
    return (
      <>
        <Topbar title="Property" crumbs="Records / Properties" />
        <div className="app-content" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
          Loading...
        </div>
      </>
    );
  }

  if (!property) {
    return (
      <>
        <Topbar title="Not found" crumbs="Records / Properties" />
        <div className="app-content" style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)' }}>
          Property not found.
        </div>
      </>
    );
  }

  const typeLabel = property.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <Topbar title={property.name} crumbs={`Records / Properties / ${property.name}`} />
      <div className="app-content">
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
          {/* Photo + details */}
          <div className="panel">
            <div style={{ aspectRatio: '16/9', borderRadius: '10px 10px 0 0', overflow: 'hidden' }}>
              <PhotoPlaceholder seed={property.photoSeed ?? 0} label={(property.neighbourhood ?? '').toUpperCase()} />
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{property.name}</h2>
                  <div style={{ fontSize: 14, color: 'var(--ink-3)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MapPin size={13} /> {property.address}
                  </div>
                </div>
                <span className="pill gray">{typeLabel}</span>
              </div>

              <div style={{ display: 'flex', gap: 24, marginTop: 16, fontSize: 14, color: 'var(--ink-2)' }}>
                {(property.beds ?? 0) > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bed size={15} /> {property.beds} bed</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Bath size={15} /> {property.baths ?? 0} bath</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Ruler size={15} /> {(property.sqft ?? 0).toLocaleString()} sqft</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Building size={15} /> {property.units} {property.units === 1 ? 'unit' : 'units'}</span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gap: 16 }}>
            <div className="panel" style={{ padding: 20 }}>
              <div className="sub-detail" style={{ marginBottom: 8 }}>MONTHLY RENT</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {fmt(property.rent)}
              </div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 4 }}>per month</div>
            </div>

            <div className="panel" style={{ padding: 20 }}>
              <div className="sub-detail" style={{ marginBottom: 8 }}>OCCUPANCY</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`pill ${property.occupancy === 'occupied' ? 'green' : 'red'}`}>
                  <span className="dot" />{property.occupancy === 'occupied' ? 'Occupied' : 'Vacant'}
                </span>
              </div>
            </div>

            <div className="panel" style={{ padding: 20 }}>
              <div className="sub-detail" style={{ marginBottom: 8 }}>DETAILS</div>
              <div style={{ fontSize: 13, display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">Neighbourhood</span>
                  <span>{property.neighbourhood ?? '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">City</span>
                  <span>{property.city ?? "St. John's, NL"}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">Year built</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={12} /> {property.yearBuilt ?? '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">Listed</span>
                  <span>{property.listed ? <span className="pill yellow"><span className="dot" />Live</span> : <span className="pill gray">No</span>}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
