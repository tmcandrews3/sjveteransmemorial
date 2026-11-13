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
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; color: #1a1a1a; }
    .header { text-align: center; border-bottom: 3px solid #c43834; padding-bottom: 12px; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: bold; color: #c43834; margin: 8px 0; }
    .section-title { color: #c43834; font-weight: bold; font-size: 16px; margin: 18px 0 8px 0; border-bottom: 1px solid #c43834; display: inline-block; }
    .brick-box { border: 2px solid #333; padding: 16px; margin: 12px 0; text-align: center; font-weight: bold; line-height: 1.4; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; border-top: 2px solid #c43834; padding-top: 10px; }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://sjveteransmemorial.org/images/american-legion-emblem.png" alt="American Legion" style="height: 80px; margin-bottom: 8px;" />
  <p><strong>ORDER DATE:</strong> ${new Date().toLocaleDateString()} &nbsp;&nbsp;&nbsp; <strong>CONFIRMATION NUMBER:</strong> ${order.confirmationNumber || 'AC-543-TEMP'}</p>

  <div class="section-title">SPONSOR INFORMATION</div>
  <p><strong>NAME:</strong> ${order.customerName || ''}</p>
  <p><strong>PHONE:</strong> ${order.phone || ''}</p>
  <p><strong>EMAIL:</strong> ${order.email || ''}</p>
  <p><strong>ADDRESS:</strong> ${[order.address, order.city, order.state, order.zip].filter(Boolean).join(', ')}</p>

  <div class="section-title">BRICK INSCRIPTION</div>
  <p>This is how the brick should appear:</p>
  <div class="brick-box">
    ${[order.line1, order.line2, order.line3, order.line4].filter(Boolean).join('<br>')}
  </div>

  <div class="section-title">PAYMENT STATUS</div>
  <p>☑ PAID VIA GIVEBUTTER</p>
  <p style="background:#f5f5f5; padding:8px; font-size:13px;"><em>Note: The sponsor has received email confirmation</em></p>

  <div class="footer">American Legion Post 543</div>
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