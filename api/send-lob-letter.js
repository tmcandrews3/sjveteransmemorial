export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const LOB_TEST_KEY = process.env.LOB_TEST_KEY; // Set this in Vercel env vars
  if (!LOB_TEST_KEY) {
    return res.status(500).json({ error: 'Lob key not configured' });
  }

  const order = req.body;

  // Simple HTML version of the locked-in form for testing
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; padding: 40px;">
        <h1 style="color: #c43834;">ST. JAMES VETERANS MEMORIAL - BRICK ORDER</h1>
        <p><strong>Confirmation:</strong> ${order.confirmation || 'TEST-001'}</p>
        <h2>Sponsor Information</h2>
        <p>Name: ${order.name}</p>
        <p>Phone: ${order.phone}</p>
        <p>Email: ${order.email}</p>
        <p>Address: ${order.address || 'N/A'}</p>
        <h2>Brick Inscription</h2>
        <p>This is how the brick should appear:</p>
        <div style="border: 2px solid #000; padding: 20px; margin: 20px 0;">
          ${order.lines?.join('<br>') || 'Sample line 1<br>Sample line 2'}
        </div>
        <p><strong>Payment Status:</strong> PAID VIA GIVEBUTTER</p>
        <p><em>The sponsor has received email confirmation</em></p>
        <hr>
        <p>American Legion Post 543</p>
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