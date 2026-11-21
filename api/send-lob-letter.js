export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const LOB_TEST_KEY = process.env.LOB_TEST_KEY;
  if (!LOB_TEST_KEY) return res.status(500).json({ error: 'Lob key missing' });

  const order = req.body || {};

  const inscriptionLines = [order.line1, order.line2, order.line3, order.line4]
    .filter(line => line && String(line).trim())
    .map(line => String(line).toUpperCase());

  const inscriptionHtml = inscriptionLines.length > 0
    ? inscriptionLines.join('<br>')
    : 'NO INSCRIPTION PROVIDED';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, Helvetica, sans-serif; margin: 0; padding: 0; font-size: 13px; color: #000;">
        <!-- Extra top space so Lob's address window doesn't cover content -->
        <div style="height: 2.1in;"></div>

        <div style="padding: 0 0.65in;">
          <h1 style="color: #c43834; margin: 0 0 6px 0; font-size: 22px;">St. James Veterans Memorial</h1>
          <div style="font-size: 16px; margin-bottom: 20px;">Brick Order</div>

          <p style="margin: 0 0 14px 0;">
            <strong>Confirmation:</strong> ${order.confirmationNumber || 'N/A'}
          </p>

          <p style="margin: 0 0 14px 0;">
            <strong>Inscription:</strong><br>
            <span style="display: inline-block; margin-top: 6px; line-height: 1.7;">${inscriptionHtml}</span>
          </p>

          <p style="margin: 0 0 14px 0;">
            <strong>Sponsor:</strong><br>
            ${order.customerName || ''}<br>
            ${order.phone || ''}<br>
            ${order.email || ''}<br>
            ${[order.address, order.city, order.state, order.zip].filter(Boolean).join(', ')}
          </p>

          <p style="margin-top: 28px; font-size: 11px; color: #555;">
            This order has been mailed to Tom Picinich.
          </p>
        </div>
      </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.lob.com/v1/letters', {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + Buffer.from(LOB_TEST_KEY + ':').toString('base64'),
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