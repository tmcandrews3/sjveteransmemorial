export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const LOB_KEY = process.env.LOB_LIVE_KEY || process.env.LOB_TEST_KEY;
if (!LOB_KEY) return res.status(500).json({ error: 'Lob key missing' });
  const order = req.body || {};

  const lines = [order.line1, order.line2, order.line3, order.line4]
    .filter(l => l && String(l).trim())
    .map(l => String(l).toUpperCase());

  const inscriptionHtml = lines.length > 0
    ? lines.map(l => `<div style="margin: 4px 0;">${l}</div>`).join('')
    : '<div>NO INSCRIPTION</div>';

  const html = `
    <!DOCTYPE html>
    <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #1a1a1a; font-size: 13px; }
      .header { text-align: center; border-bottom: 3px solid #c43834; padding-bottom: 12px; margin-bottom: 20px; }
      .title { font-size: 20px; font-weight: bold; color: #c43834; margin: 6px 0; }
      .section-title { color: #c43834; font-weight: bold; font-size: 15px; margin: 16px 0 6px 0; border-bottom: 1px solid #c43834; display: inline-block; }
    </style>
  </head>
  <body>
    <!-- Spacer so Lob address window doesn't cover content -->
    <div style="height: 1.9in;"></div>

    <div style="padding: 0 0.65in;">
      <div class="header">
        <img src="https://sjveteransmemorial.org/images/american-legion-emblem.png" alt="American Legion" style="height: 72px; margin-bottom: 6px;" />
        <div class="title">St. James Veterans Memorial</div>
        <div style="font-size: 14px; margin-bottom: 8px;">Brick Order</div>
        <p style="margin: 8px 0 0 0;">
          <strong>ORDER DATE:</strong> ${new Date().toLocaleDateString()} &nbsp;&nbsp;&nbsp;
          <strong>CONFIRMATION NUMBER:</strong> ${order.confirmationNumber || 'N/A'}
        </p>
      </div>

      <div class="section-title">SPONSOR INFORMATION</div>
          <div style="margin-bottom: 18px; line-height: 1.5;">
            <strong>NAME:</strong> ${order.customerName || ''}<br>
            <strong>PHONE:</strong> ${order.phone || ''}<br>
            <strong>EMAIL:</strong> ${order.email || ''}<br>
            <strong>ADDRESS:</strong> ${[order.address, order.city, order.state, order.zip].filter(Boolean).join(', ')}
          </div>

          <div style="font-weight: bold; color: #c43834; border-bottom: 1px solid #c43834; padding-bottom: 4px; margin-bottom: 10px;">
            BRICK INSCRIPTION
          </div>
          <div style="text-align: center; margin-bottom: 6px; font-size: 12px;">This is how the brick should appear:</div>
          <div style="border: 2px solid #000; padding: 16px 12px; text-align: center; min-height: 90px; margin-bottom: 22px; line-height: 1.6;">
            ${inscriptionHtml}
          </div>

          <div style="font-weight: bold; color: #c43834; border-bottom: 1px solid #c43834; padding-bottom: 4px; margin-bottom: 10px;">
            PAYMENT STATUS
          </div>
          <div style="margin-bottom: 18px;">
            ☑ PAID VIA GIVEBUTTER
          </div>

          <div style="background: #f3f3f3; padding: 8px 12px; font-size: 11px; font-style: italic; margin-bottom: 20px;">
            Note: The sponsor has received email confirmation
          </div>

          <div style="border-top: 3px solid #c43834; border-bottom: 1px solid #c43834; text-align: center; padding: 8px 0; font-size: 11px; margin-top: 10px;">
            American Legion Post 543
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.lob.com/v1/letters', {
  method: 'POST',
  headers: {
    Authorization: 'Basic ' + Buffer.from(LOB_KEY + ':').toString('base64'),
    'Content-Type': 'application/json',
  },
      body: JSON.stringify({
        to: {
          name: 'Tom Picinich',
          address_line1: '4355 Tidemarsh Ct',
          address_city: 'Southport',
          address_state: 'NC',
          address_zip: '28461',
        },
        from: {
          name: 'St. James Veterans Memorial',
          address_line1: 'Unit B 4136 Southport Supply Rd SE',
          address_city: 'St. James',
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