export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY missing' });
  }

  const order = req.body || {};
  console.log('Sending emails for:', order.confirmationNumber || 'no-confirmation');

  const lines = [order.line1, order.line2, order.line3, order.line4]
    .filter(Boolean)
    .join('<br>') || 'No inscription';

  const html = `
    <h2>St. James Veterans Memorial – Brick Order</h2>
    <p><strong>Confirmation #:</strong> ${order.confirmationNumber || 'N/A'}</p>
    <p><strong>Inscription:</strong><br>${lines}</p>
    <p><strong>Sponsor:</strong><br>
      ${order.customerName || ''}<br>
      ${order.phone || ''}<br>
      ${order.email || ''}
    </p>
    <p>Thank you for supporting the memorial.</p>
  `;

  try {
    const sponsorRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'St. James Veterans Memorial <orders@sjveteransmemorial.org>',
        to: [order.email || 'tmcandrews3@gmail.com'],
        subject: `Brick Order Confirmation ${order.confirmationNumber || ''}`,
        html,
      }),
    });
    const sponsorData = await sponsorRes.json();

    const internalRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'St. James Veterans Memorial <orders@sjveteransmemorial.org>',
        to: ['gforce2730@gmail.com', 'tmcandrews3@gmail.com'],
        subject: `New Brick Order ${order.confirmationNumber || ''}`,
        html: html + '<p><strong>Internal copy</strong></p>',
      }),
    });
    const internalData = await internalRes.json();

    console.log('Sponsor result:', sponsorData);
    console.log('Internal result:', internalData);

    return res.status(200).json({ success: true, sponsor: sponsorData, internal: internalData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}