export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend key not configured' });
  }

  const order = req.body;

  const lines = Array.isArray(order.lines)
    ? order.lines
    : (order.lines || '').split('|').filter(Boolean);

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; background: #f8f9fa; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .header { background: #263b6c; color: white; padding: 24px; text-align: center; }
    .header img { height: 70px; margin-bottom: 12px; }
    .content { padding: 32px; }
    .section-title { color: #263b6c; font-size: 18px; margin: 24px 0 12px 0; font-weight: bold; }
    .brick { background: #f05f33; color: black; padding: 28px; border-radius: 12px; text-align: center; font-size: 18px; font-weight: bold; line-height: 1.5; margin: 16px 0; }
    .footer { background: #f1f1f1; padding: 20px; text-align: center; font-size: 14px; color: #555; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://sjveteransmemorial.org/images/american-legion-emblem.png" alt="American Legion">
      <h1 style="margin:0; font-size:24px;">St. James Veterans Memorial</h1>
      <p style="margin:8px 0 0 0;">Brick Order Confirmation</p>
    </div>
    <div class="content">
      <p>Thank you for your order. Here is a copy of your brick inscription:</p>
      
      <div class="section-title">This is how your brick will appear</div>
      <div class="brick">
        ${lines.map(line => line).join('<br>')}
      </div>

      <div class="section-title">Sponsor Information</div>
      <p><strong>Name:</strong> ${order.name || ''}<br>
      <strong>Phone:</strong> ${order.phone || ''}<br>
      <strong>Email:</strong> ${order.email || ''}</p>

      <p>A confirmation has also been sent to the brick order coordinator. It may take several months before your brick is installed.</p>
    </div>
    <div class="footer">
      American Legion Post 543 • St. James, NC<br>
      Thank you for honoring our veterans.
    </div>
  </div>
</body>
</html>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'St. James Veterans Memorial <onboarding@resend.dev>',
        to: order.email,
        subject: 'Your Brick Order Confirmation – St. James Veterans Memorial',
        html,
      }),
    });
// Notification email to Tom & George
const notifyHtml = `
  <h2>New Brick Order Received</h2>
  <p><strong>Payment to GiveButter successful.</strong><br>
  <strong>Letter in the mail to Tom Picinich.</strong></p>
  <hr>
  <p><strong>Sponsor:</strong> ${order.name || ''}<br>
  <strong>Phone:</strong> ${order.phone || ''}<br>
  <strong>Email:</strong> ${order.email || ''}<br>
  <strong>Address:</strong> ${order.address || 'N/A'}</p>
  <p><strong>Brick Inscription:</strong><br>
  ${lines.map(line => line).join('<br>')}</p>
  <p><strong>Confirmation:</strong> ${order.confirmation || ''}</p>
`;

await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'onboarding@resend.dev',
    to: ['tmcandrews3@gmail.com', 'gforce2730@gmail.com'],
    subject: `New Brick Order – ${order.name || 'Unknown'}`,
    html: notifyHtml,
  }),
});
    const data = await response.json();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}