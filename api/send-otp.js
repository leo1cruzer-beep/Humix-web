export default async function handler(req, res) {
  console.log('[service-sid]', process.env.TWILIO_VERIFY_SERVICE_SID);
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone } = req.body ?? {};
  if (!phone || typeof phone !== 'string') return res.status(400).json({ error: 'phone required' });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const url = `https://verify.twilio.com/v2/Services/${serviceSid}/Verifications`;
  const bodyParams = new URLSearchParams({ To: phone, Channel: 'sms' }).toString();
  console.log('[send-otp] POST', url);
  console.log('[send-otp] To:', phone);
  console.log('[send-otp] body:', bodyParams);
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyParams,
  });

  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    return res.status(400).json({ error: body.message ?? 'Failed to send code' });
  }

  return res.status(200).json({ ok: true });
}
