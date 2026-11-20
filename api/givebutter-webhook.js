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
     const signature = req.headers['signature'];
  if (!signature) {
    console.error('Missing signature header');
    return res.status(401).json({ error: 'Missing signature' });
  }

  // GiveButter sends the signing secret itself in the signature header
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(secret))) {
    console.error('Signature mismatch');
    return res.status(401).json({ error: 'Invalid signature' });
  }
    let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  console.log('Full event keys:', Object.keys(event));
  console.log('event.type:', event.type);
  console.log('event.event:', event.event);
  console.log('event.name:', event.name);
  console.log('Event type:', event.type);
  console.log('Campaign ID:', event.data?.campaign_id);
  console.log('Campaign code:', event.data?.campaign_code);

  // Only process successful transactions for our campaign
    if (event.event !== 'transaction.succeeded') {
    console.log('Ignoring – wrong event type');
    return res.status(200).json({ received: true, ignored: 'wrong event type' });
  }

  const campaignId = event.data?.campaign_id?.toString();
  const campaignCode = event.data?.campaign_code;

  if (campaignId !== '784496' && campaignCode !== 'VDQE3N') {
    console.log('Ignoring – wrong campaign');
    return res.status(200).json({ received: true, ignored: 'wrong campaign' });
  }

  console.log('Campaign matched – proceeding to email');

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
      : 'https://sjveteransmemorial.org';

    console.log('Calling confirmation email at:', `${baseUrl}/api/send-confirmation-email`);

    const emailResponse = await fetch(`${baseUrl}/api/send-confirmation-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    console.log('Email response status:', emailResponse.status);
    const emailText = await emailResponse.text();
    console.log('Email response body:', emailText);

    if (!emailResponse.ok) {
      console.error('Failed to send confirmation email:', await emailResponse.text());
    }

    // Send Lob letter
    const lobResponse = await fetch(`${baseUrl}/api/send-lob-letter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (!lobResponse.ok) {
      console.error('Failed to send Lob letter:', await lobResponse.text());
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
}