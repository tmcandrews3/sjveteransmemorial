import { useState } from 'react';

export default function TestOrder() {
  const formData = {
    line1: '', line2: '', line3: '', line4: '',
    customerName: '', phone: '', address: '', city: '', state: '', zip: '', email: '',
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
    return { success: false, error: err };
  }
};

  const isValid = () => {
    return (formData.line1 || formData.line2 || formData.line3 || formData.line4) &&
           formData.customerName && formData.phone && formData.email;
  };
const [showPreview, setShowPreview] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      alert("Please fill at least one engraving line, name, phone, and email.");
      return;
    }
    setShowPreview(true);
    console.log('Order Submitted:', formData);
const orderData = {
  name: formData.customerName || '',
  phone: formData.phone || '',
  email: formData.email || '',
  address: formData.address || '',
  lines: [formData.line1, formData.line2, formData.line3, formData.line4]
    .filter(Boolean)
    .join('|'),
  confirmation: 'SJVM-' + Date.now().toString().slice(-8),
};

await sendToLob(orderData);
  };
return (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-2xl mx-auto px-6">
      {showPreview ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-[#263b6c]">Preview Your Brick</h2>
          <p className="mt-4 text-gray-600">Preview content will go here.</p>
          <button 
            type="button"
            onClick={() => setShowPreview(false)}
            className="mt-6 text-blue-600 underline"
          >
            ← Back to edit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* All your existing form fields and the Submit button go here */}
          <button 
            type="submit"
            className="w-full bg-[#e04a38] hover:bg-red-700 text-white font-medium py-5 rounded-2xl text-xl transition-all"
          >
            Submit Order (Test Mode)
          </button>
        </form>
      )}
    </div>
  </div>
);
}