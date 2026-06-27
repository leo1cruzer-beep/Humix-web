import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceKey  = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Server misconfigured' });
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  if (req.method === 'POST') {
    const { email, deviceId } = req.body ?? {};
    if (!email || typeof email !== 'string' || !deviceId || typeof deviceId !== 'string') {
      return res.status(400).json({ error: 'email and deviceId required' });
    }
    const { error } = await admin
      .from('device_email_bindings')
      .upsert({ email, device_id: deviceId }, { onConflict: 'email' });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'email required' });
    }
    const { data, error } = await admin
      .from('device_email_bindings')
      .select('device_id')
      .eq('email', email)
      .single();
    if (error || !data) return res.status(404).json({ error: 'not found' });
    return res.status(200).json({ deviceId: data.device_id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
