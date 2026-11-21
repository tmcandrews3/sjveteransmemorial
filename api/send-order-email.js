import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const order = req.body;

  const confirmationNumber = order.confirmationNumber || 'AC-543-XXXXXX';
  const lines = [order.line1, order.line2, order.line3, order.line4]
    .filter(Boolean)
    .join('\n');

  // 1. Sponsor confirmation
  const sponsorEmail = {
    from: 'St. James Veterans Memorial <onboarding@resend.dev>', // change to your verified domain later
    to: order.email,
    subject: 'Your St. James Veterans Memorial Brick Order Confirmation',
    html: `
      <p>Hello ${order.customerName},</p>
      <p>Thank you for your order of a personalized brick for the St. James Veterans Memorial.</p>
      <p><strong>Confirmation Number:</strong> ${confirmationNumber}</p>
      <p><strong>Brick Inscription:</strong><br>${lines.replace(/\n/g, '<br>')}</p>
      <p><strong>Sponsor Information:</strong><br>
      ${order.customerName}<br>
      ${order.phone}<br>
      ${order.email}<br>
      ${order.address ? `${order.address}, ${order.city} ${order.state} ${order.zip}` : ''}</p>
      <p>Your payment has been received. We will hold your order until we have enough bricks for the next engraving run. It can take several months before the brick is installed.</p>
      <p>You may purchase additional bricks at any time at $100 each.</p>
      <p>Thank you for supporting the memorial.</p>
      <p>Richard H. Stewart, Jr. Post 543<br>
      St. James, NC<br>
      <a href="https://sjveteransmemorial.org">https://sjveteransmemorial.org</a></p>
    `,
  };

  // 2. Internal email to George & Tom
  const internalEmail = {
    from: 'St. James Veterans Memorial <onboarding@resend.dev>',
    to: ['gforce2730@gmail.com', 'tmcandrews3@gmail.com'], 
    subject: `New Brick Order – ${confirmationNumber}`,
    html: `
      <p>New memorial brick order received.</p>
      <p><strong>Confirmation Number:</strong> ${confirmationNumber}<br>
      <strong>Amount:</strong> $100<br>
      <strong>Payment Status:</strong> Paid (via GiveButter)</p>
      <p><strong>Brick Inscription:</strong><br>${lines.replace(/\n/g, '<br>')}</p>
      <p><strong>Sponsor:</strong><br>
      ${order.customerName}<br>
      ${order.phone}<br>
      ${order.email}<br>
      ${order.address ? `${order.address}, ${order.city} ${order.state} ${order.zip}` : ''}</p>
      <p><strong>Notes:</strong><br>
      - Order placed via online form<br>
      - Ready for the next engraving batch</p>
      <p>A copy of this order has been mailed to Tom P.</p>
    `,
  };

  try {
    await resend.emails.send(sponsorEmail);
    await resend.emails.send(internalEmail);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}