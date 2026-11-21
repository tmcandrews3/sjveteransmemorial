export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const LOB_TEST_KEY = process.env.LOB_TEST_KEY;
  if (!LOB_TEST_KEY) return res.status(500).json({ error: 'Lob key missing' });

  const order = req.body;
  const lines = [order.line1, order.line2, order.line3, order.line4].filter(Boolean).join('<br>');

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; margin: 0.75in;">
        <h2 style="color: #c43834;">St. James Veterans Memorial – Brick Order</h2>
        <p><strong>Confirmation:</strong> ${order.confirmationNumber || 'N/A'}</p>
        <p><strong>Inscription:</strong><br>${lines}</p>
        <p><strong>Sponsor:</strong><br>
        ${order.customerName}<br>
        ${order.phone}<br>
        ${order.email}<br>
        ${order.address || ''} ${order.city || ''} ${order.state || ''} ${order.zip || ''}
        </p>
        <p>A copy of this order has been mailed to Tom P.</p>
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
          address_line1: 'Your Street Address',
          address_city: 'Southport',
          address_state: 'NC',
          address_zip: '28461',
        },
        from: {
          name: 'St. James Veterans Memorial',
          address_line1: 'Your Return Address',
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