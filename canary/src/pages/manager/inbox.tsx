import Topbar from '@ui/topbar';

export default function Inbox() {
  const messages = [
    { from: 'Maeve Walsh', subject: 'Request: new dishwasher', preview: 'The one here started making a grinding sound — no leak, but...', time: '14m', unread: true, tag: 'Maintenance' },
    { from: 'Niamh Fitzpatrick', subject: 'Viewing: 42 Duckworth St', preview: 'Hi! I saw the Battery Heights listing. Available Saturday afternoon?', time: '1h', unread: true, tag: 'Viewing' },
    { from: 'Declan Murphy', subject: 'March statement — question', preview: 'Can you walk me through the line item on the Gower Heights entry?', time: '3h', unread: true, tag: 'Owner' },
    { from: 'Avalon Plumbing', subject: 'Quote: burst pipe repair', preview: 'Parts in, can start 8am Thursday. $840 all-in.', time: '5h', unread: true, tag: 'Vendor' },
    { from: 'Conor Doyle', subject: 'Re: April rent', preview: 'Hey, sorry for the delay — sending an e-transfer tonight.', time: '1d', unread: false, tag: 'Payment' },
    { from: 'Ciara Power', subject: 'Lease renewal', preview: 'Happy to sign for another year!', time: '2d', unread: false, tag: 'Lease' },
  ];
  return (
    <>
      <Topbar title="Inbox" crumbs="Overview / Inbox"/>
      <div className="app-content">
        <div className="panel">
          {messages.map((m, i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--line-2)', display:'grid', gridTemplateColumns: '30px 180px 1fr 90px', alignItems:'center', gap: 14, background: m.unread ? 'var(--bg-elev)' : 'var(--bg)' }}>
              <div className="avatar size-sm">{m.from.split(' ').map(p => p[0]).join('').slice(0, 2)}</div>
              <div style={{ fontWeight: m.unread ? 600 : 500, fontSize: 13.5 }}>{m.from}</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', minWidth: 0 }}>
                <span className={"pill " + (m.tag === 'Viewing' ? 'yellow' : m.tag === 'Maintenance' ? 'blue' : m.tag === 'Payment' ? 'green' : 'gray')}>{m.tag}</span>
                <strong style={{ fontSize: 13.5, fontWeight: m.unread ? 600 : 500 }}>{m.subject}</strong>
                <span style={{ color: 'var(--ink-3)', fontSize: 13.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>— {m.preview}</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-4)', textAlign:'right' }}>{m.time}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
