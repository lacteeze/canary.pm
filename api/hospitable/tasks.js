const HOSPITABLE_BASE = 'https://public.api.hospitable.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const token = process.env.HOSPITABLE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'HOSPITABLE_TOKEN env var is not set on the server.' });
  }

  try {
    const url = `${HOSPITABLE_BASE}/v2/tasks?per_page=50`;
    const upstream = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      return res.status(upstream.status).json({
        error: 'Hospitable upstream error',
        status: upstream.status,
        body: text.slice(0, 500),
      });
    }

    const raw = await upstream.json();

    const items = Array.isArray(raw?.data) ? raw.data : (raw?.tasks || []);
    const tasks = items.map((t, i) => ({
      id: String(t.id || `tk${i}`),
      propertyId: String(t.property_id || t.listing_id || ''),
      propertyName: t.property?.name || t.listing?.name || 'Property',
      propertyAddress: t.property?.address || t.listing?.address?.full || '',
      photoSeed: i,
      type: prettyType(t.type || t.category),
      status: prettyStatus(t.status, t.assignee_id),
      due: t.scheduled_at || t.due_at || t.starts_at || '',
      dueOrder: t.scheduled_at ? Date.parse(t.scheduled_at) : 0,
      sameDay: !!t.same_day,
      assignee: t.assignee?.name || null,
    }));

    return res.status(200).json({
      tasks,
      meta: {
        fetchedAt: new Date().toISOString(),
        count: tasks.length,
      },
    });
  } catch (err) {
    return res.status(502).json({ error: 'Proxy fetch failed', detail: String(err) });
  }
}

function prettyType(t) {
  if (!t) return 'Task';
  const map = { cleaning: 'Cleaning', maintenance: 'Maintenance', inspection: 'Inspection', restock: 'Restock', mid_stay: 'Mid-stay' };
  return map[String(t).toLowerCase()] || t;
}

function prettyStatus(s, assigneeId) {
  const norm = String(s || '').toLowerCase();
  if (!assigneeId && (norm === '' || norm === 'pending' || norm === 'created')) return 'Unassigned';
  if (norm === 'in_progress' || norm === 'started') return 'In progress';
  if (norm === 'completed' || norm === 'done') return 'Completed';
  if (norm === 'accepted' || norm === 'scheduled' || norm === 'assigned') return 'Accepted';
  return 'Unassigned';
}
