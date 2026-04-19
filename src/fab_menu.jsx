/* Floating Action Button + Universal Add Menu */

function FABMenu() {
  const [open, setOpen] = React.useState(false);
  const [formType, setFormType] = React.useState(null);

  const items = [
    { icon: '👤', label: 'Create new Person', type: 'person' },
    { icon: '📋', label: 'Create new Portfolio', type: 'portfolio' },
    { icon: '🏠', label: 'Create new Property', type: 'property' },
    { icon: '🛠', label: 'Create new Project', type: 'project' },
    { icon: '📄', label: 'Create new Lease', type: 'lease' },
    { icon: '💰', label: 'Record new Payment', type: 'payment' },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button 
        className="fab-button"
        onClick={() => setOpen(!open)}
        title="Create new..."
      >
        +
      </button>

      {/* FAB Menu */}
      {open && (
        <div className="fab-menu">
          {items.map(item => (
            <div
              key={item.type}
              className="fab-menu-item"
              onClick={() => {
                setFormType(item.type);
                setOpen(false);
              }}
            >
              <span className="fab-menu-item-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Close menu when clicking outside */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 49 }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Form Modal */}
      {formType && (
        <CreateFormModal
          type={formType}
          onClose={() => setFormType(null)}
        />
      )}
    </>
  );
}

function CreateFormModal({ type, onClose }) {
  const [data, setData] = React.useState({});

  const formDefs = {
    person: {
      title: 'Create new Person',
      fields: [
        { id: 'name', label: 'Full Name', placeholder: 'John Smith', type: 'text' },
        { id: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
        { id: 'phone', label: 'Phone', placeholder: '(555) 123-4567', type: 'tel' },
        { id: 'role', label: 'Role', type: 'select', options: ['Owner', 'Tenant', 'Vendor', 'Staff'] },
      ],
    },
    portfolio: {
      title: 'Create new Portfolio',
      fields: [
        { id: 'name', label: 'Portfolio Name', placeholder: 'Harbour Holdings', type: 'text' },
        { id: 'owners', label: 'Owners (select multiple)', type: 'text', placeholder: 'Comma-separated names' },
        { id: 'term', label: 'Management Term', type: 'select', options: ['1-year', '2-year', '3-year', '5-year'] },
      ],
    },
    property: {
      title: 'Create new Property',
      fields: [
        { id: 'name', label: 'Property Name', placeholder: 'Downtown Duplex', type: 'text' },
        { id: 'address', label: 'Address', placeholder: '123 Water St, St. John\'s, NL', type: 'text' },
        { id: 'units', label: 'Number of Units', type: 'number', placeholder: '2' },
        { id: 'type', label: 'Property Type', type: 'select', options: ['Single Family', 'Duplex', 'Triplex', 'Apartment', 'Commercial'] },
      ],
    },
    project: {
      title: 'Create new Project',
      fields: [
        { id: 'title', label: 'Project Title', placeholder: 'Kitchen Renovation', type: 'text' },
        { id: 'property', label: 'Property', type: 'text', placeholder: 'Select property...' },
        { id: 'budget', label: 'Budget', type: 'number', placeholder: '5000' },
        { id: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Urgent'] },
      ],
    },
    lease: {
      title: 'Create new Lease',
      fields: [
        { id: 'tenant', label: 'Tenant', placeholder: 'Select tenant...', type: 'text' },
        { id: 'property', label: 'Property', placeholder: 'Select property...', type: 'text' },
        { id: 'rent', label: 'Monthly Rent', type: 'number', placeholder: '1500' },
        { id: 'start', label: 'Start Date', type: 'date' },
      ],
    },
    payment: {
      title: 'Record new Payment',
      fields: [
        { id: 'payer', label: 'From (Tenant)', placeholder: 'Select tenant...', type: 'text' },
        { id: 'property', label: 'Property', placeholder: 'Select property...', type: 'text' },
        { id: 'amount', label: 'Amount', type: 'number', placeholder: '1500' },
        { id: 'date', label: 'Payment Date', type: 'date' },
      ],
    },
  };

  const form = formDefs[type];
  const handleChange = (id, value) => setData({ ...data, [id]: value });
  const handleSubmit = () => {
    console.log(`Creating ${type}:`, data);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'flex-end',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 500,
        background: 'var(--bg-elev)',
        borderRadius: '16px 16px 0 0',
        padding: '24px',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>{form.title}</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 24, color: 'var(--ink-3)', padding: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {form.fields.map(field => (
            <div key={field.id}>
              <label style={{
                display: 'block', fontSize: 12.5, fontWeight: 600,
                color: 'var(--ink-3)', marginBottom: 6, textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {field.label}
              </label>
              {field.type === 'select' ? (
                <select
                  value={data[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', fontSize: 13.5,
                    border: '1px solid var(--line)', borderRadius: 8,
                    background: 'var(--bg)', color: 'var(--ink)',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="">Select...</option>
                  {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={data[field.id] || ''}
                  onChange={e => handleChange(field.id, e.target.value)}
                  style={{
                    width: '100%', padding: '10px 12px', fontSize: 13.5,
                    border: '1px solid var(--line)', borderRadius: 8,
                    background: 'var(--bg)', color: 'var(--ink)',
                    fontFamily: 'inherit',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { FABMenu });
