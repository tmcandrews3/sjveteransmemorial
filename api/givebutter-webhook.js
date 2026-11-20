export const config = {
  api: {
    bodyParser: false, // we need the raw body for signature verification
  },
};

import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
console.log('Webhook hit', req.headers);
  const secret = process.env.GIVEBUTTER_WEBHOOK_SECRET;
  if (!secret) {
    console.error('GIVEBUTTER_WEBHOOK_SECRET not set');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Get raw body
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const rawBody = Buffer.concat(chunks).toString('utf8');

  // Verify signature
  const signature = req.headers['givebutter-signature'] || req.headers['x-givebutter-signature'];
  if (!signature) {
    return res.status(401).json({ error: 'Missing signature' });
  }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

   // TEMPORARY DEBUG – remove after we fix signature
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Raw body length:', rawBody.length);

  // Skip verification for now
  // const signature = ...
  // if (!crypto.timingSafeEqual...) { ... }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  // Only process successful transactions for our campaign
  if (event.type !== 'transaction.succeeded') {
    return res.status(200).json({ received: true, ignored: 'wrong event type' });
  }

  const campaignId = event.data?.campaign_id?.toString();
  const campaignCode = event.data?.campaign_code;

  if (campaignId !== '784496' && campaignCode !== 'VDQE3N') {
    return res.status(200).json({ received: true, ignored: 'wrong campaign' });
  }

  // Extract order details (adjust field names based on actual GiveButter payload)
  const order = {
    confirmationNumber: event.data?.id || event.data?.transaction_id || 'N/A',
    amount: event.data?.amount || 0,
    sponsor: {
      name: event.data?.donor?.name || event.data?.name || '',
      email: event.data?.donor?.email || event.data?.email || '',
      phone: event.data?.donor?.phone || event.data?.phone || '',
      address: event.data?.donor?.address || '',
    },
    lines: [
      event.data?.custom_fields?.line1 || '',
      event.data?.custom_fields?.line2 || '',
      event.data?.custom_fields?.line3 || '',
      event.data?.custom_fields?.line4 || '',
    ],
    // Add any other fields you need
  };

  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const emailResponse = await fetch(`${process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:3000'}/api/send-confirmation-email`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(order),
});
    if (!emailResponse.ok) {
      console.error('Failed to send confirmation email:', await emailResponse.text());
      return res.status(502).json({ error: 'Failed to send confirmation email' });
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Confirmation email error:', err);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
}