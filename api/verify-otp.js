export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { phone, code } = req.body ?? {};
  if (!phone || !code) return res.status(400).json({ error: 'phone and code required' });

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  const auth = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
  const url = `https://verify.twilio.com/v2/Services/${serviceSid}/VerificationChecks`;
  const bodyParams = new URLSearchParams({ To: phone, Code: code }).toString();
  console.log('[verify-otp] POST', url);
  console.log('[verify-otp] To:', phone, '| Code:', code);
  console.log('[verify-otp] body:', bodyParams);
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyParams,
  });

  const body = await r.json().catch(() => ({}));
  if (!r.ok || body.status !== 'approved') {
    return res.status(400).json({ error: body.message ?? 'Invalid or expired code' });
  }

  return res.status(200).json({ ok: true });
}
