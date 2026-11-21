export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const LOB_TEST_KEY = process.env.LOB_TEST_KEY;
  if (!LOB_TEST_KEY) return res.status(500).json({ error: 'Lob key missing' });

  const order = req.body || {};

  const lines = [order.line1, order.line2, order.line3, order.line4]
    .filter(line => line && line.trim())
    .map(line => line.toUpperCase())
    .join('<br>') || 'No inscription provided';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, Helvetica, sans-serif; margin: 0.6in; font-size: 13px; color: #000; }
          h1 { color: #c43834; font-size: 22px; margin-bottom: 4px; }
          .label { font-weight: bold; }
          .section { margin: 16px 0; }
        </style>
      </head>
      <body>
        <h1>St. James Veterans Memorial</h1>
        <div style="font-size: 16px; margin-bottom: 20px;">Brick Order</div>

        <div class="section">
          <span class="label">Confirmation:</span> ${order.confirmationNumber || 'N/A'}
        </div>

        <div class="section">
          <div class="label">Inscription:</div>
          <div style="margin-top: 6px; line-height: 1.5;">${lines}</div>
        </div>

        <div class="section">
          <div class="label">Sponsor:</div>
          <div style="margin-top: 6px;">
            ${order.customerName || ''}<br>
            ${order.phone || ''}<br>
            ${order.email || ''}<br>
            ${[order.address, order.city, order.state, order.zip].filter(Boolean).join(', ')}
          </div>
        </div>

        <div style="margin-top: 30px; font-size: 11px; color: #555;">
          This order has been mailed to Tom Picinich.
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