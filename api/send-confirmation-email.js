import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const order = req.body;

  if (!order?.sponsor?.email) {
    return res.status(400).json({ error: 'No email address' });
  }

  const lines = (order.lines || []).filter(Boolean).join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #e04a38;">Thank You for Your Memorial Brick Order</h2>
      <p>Your order was successful! You should receive a copy of your invoice from GiveButter shortly.</p>
      
      <h3>Brick Inscription</h3>
      <pre style="background: #f5f5f5; padding: 12px; border-radius: 6px;">${lines || '(no inscription lines provided)'}</pre>
      
      <p><strong>Confirmation #:</strong> ${order.confirmationNumber || 'N/A'}</p>
      <p><strong>Amount:</strong> $${order.amount || '100.00'}</p>
      
      <p>It could take several months before your brick is installed into the memorial.</p>
      
      <p>Questions? Contact Tom Picinich at 201-218-8753 or tapicinich@ATMC.NET</p>
      
      <hr>
      <p style="color: #666; font-size: 12px;">
        Richard H. Stewart, Jr. Post 543 • St. James Veterans Memorial • St. James, NC
      </p>
    </div>
  `;

  try {
    const { data, error } = await resend.emails.send({
      from: 'St. James Veterans Memorial <onboarding@resend.dev>',
      to: order.sponsor.email,
      subject: 'Your Memorial Brick Order Confirmation',
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}