import { useState } from 'react';

export default function TestOrder() {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const sendToLob = async (orderData: Record<string, string>) => {
    try {
      const res = await fetch('/api/send-lob-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const result = await res.json();
      console.log('Lob result:', result);
      return result;
    } catch (err) {
      console.error('Lob error:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid =
      formData.customerName &&
      formData.phone &&
      formData.email &&
      (formData.line1 || formData.line2 || formData.line3 || formData.line4);

    if (!isValid) {
      alert('Please fill in your name, phone, email, and at least one brick line.');
      return;
    }

    console.log('Order Submitted:', formData);
    setShowPreview(true);

    await sendToLob({
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      line1: formData.line1,
      line2: formData.line2,
      line3: formData.line3,
      line4: formData.line4,
      confirmationNumber: 'AC-543-' + Date.now().toString().slice(-6),
    });

    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-lg text-center">
          <h1 className="text-3xl font-bold text-[#c43834] mb-4">Order Successful!</h1>
          <p className="text-lg text-[#263b6c] mb-6">
            Your order was successful! You should receive a copy of your invoice shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setIsSuccess(false);
                setShowPreview(false);
                setFormData(prev => ({
                  ...prev,
                  line1: '',
                  line2: '',
                  line3: '',
                  line4: '',
                }));
              }}
              className="bg-[#c43834] text-white px-8 py-3 rounded-xl font-medium"
            >
              Order Another Brick
            </button>
            <button
              onClick={() => window.close()}
              className="border border-gray-300 px-8 py-3 rounded-xl font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#263b6c]">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center text-[#c43834] mb-8">
          Brick Order Form
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brick Lines */}
          <div>
            <label className="block font-semibold mb-1">Line 1</label>
            <input name="line1" value={formData.line1} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Line 2</label>
            <input name="line2" value={formData.line2} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Line 3</label>
            <input name="line3" value={formData.line3} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Line 4</label>
            <input name="line4" value={formData.line4} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>

          {/* Sponsor Info */}
          <div className="pt-4 border-t">
            <h2 className="text-xl font-semibold text-[#c43834] mb-4">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Name *</label>
                <input name="customerName" value={formData.customerName} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Phone *</label>
                <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email *</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className="border rounded-lg px-4 py-2" />
                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} className="border rounded-lg px-4 py-2" />
                <input name="zip" placeholder="Zip" value={formData.zip} onChange={handleChange} className="border rounded-lg px-4 py-2" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#c43834] text-white py-4 rounded-xl text-lg font-semibold mt-6">
            Submit Order
          </button>
        </form>

        {showPreview && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm">
            Preview sent to Lob (check dashboard).
          </div>
        )}
      </div>
    </div>
  );
}