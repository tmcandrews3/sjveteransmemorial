export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const LOB_TEST_KEY = process.env.LOB_TEST_KEY; // Set this in Vercel env vars
  if (!LOB_TEST_KEY) {
    return res.status(500).json({ error: 'Lob key not configured' });
  }

  const order = req.body;

 // Handle lines whether they arrive as an array or a joined string
const lines = Array.isArray(order.lines)
  ? order.lines
  : (order.lines || '').split('|').filter(Boolean);

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, Helvetica, sans-serif; padding: 40px; color: #111; line-height: 1.4; }
    h1 { color: #c43834; font-size: 22px; margin-bottom: 4px; }
    .section-title { color: #c43834; font-size: 16px; margin: 24px 0 8px 0; border-bottom: 1px solid #c43834; padding-bottom: 4px; }
    .info-row { margin: 4px 0; }
    .label { font-weight: bold; display: inline-block; width: 90px; }
    .inscription-box { border: 2px solid #333; padding: 24px; margin: 16px 0; text-align: center; font-size: 16px; line-height: 1.6; }
    .note { background: #f5f5f5; padding: 10px 16px; margin: 16px 0; font-style: italic; }
    .footer { margin-top: 32px; text-align: center; font-size: 14px; }
  </style>
</head>
<body>
  <h1>ST. JAMES VETERANS MEMORIAL - BRICK ORDER</h1>
  <p><strong>Confirmation Number:</strong> ${order.confirmation || 'TEST-001'}</p>

  <div class="section-title">SPONSOR INFORMATION</div>
  <div class="info-row"><span class="label">Name:</span> ${order.name || ''}</div>
  <div class="info-row"><span class="label">Phone:</span> ${order.phone || ''}</div>
  <div class="info-row"><span class="label">Email:</span> ${order.email || ''}</div>
  <div class="info-row"><span class="label">Address:</span> ${order.address || 'N/A'}</div>

  <div class="section-title">BRICK INSCRIPTION</div>
  <p>This is how the brick should appear:</p>
  <div class="inscription-box">
    ${lines.map(line => line).join('<br>')}
  </div>

  <div class="section-title">PAYMENT STATUS</div>
  <p><strong>☑ PAID VIA GIVEBUTTER</strong></p>
  <div class="note">Note: The sponsor has received email confirmation</div>

  <div class="footer">
    American Legion Post 543
  </div>
</body>
</html>
`;

  try {
    const response = await fetch('https://api.lob.com/v1/letters', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(LOB_TEST_KEY + ':').toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description: 'Brick Order - Test',
        to: {
          name: 'Tom Picinich',
          address_line1: '4355 Tidemarsh Ct',
          address_city: 'Southport',
          address_state: 'NC',
          address_zip: '28461',
        },
        from: {
          name: 'St. James Veterans Memorial',
          address_line1: '4355 Tidemarsh Ct',
          address_city: 'Southport',
          address_state: 'NC',
          address_zip: '28461',
        },
        file: html,
        color: true,
        use_type: 'operational',
      }),
    });

    const data = await response.json();
    return res.status(200).json({ success: true, letter: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}