import { useState, useEffect } from 'react';

interface FormData {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export default function TestOrder() {
  const [formData, setFormData] = useState<FormData>({
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true' || params.get('success') === '1') {
      setShowSuccess(true);
      window.history.replaceState({}, '', '/test-order');
      return;
    }

    if (sessionStorage.getItem('orderAnother') === 'true') {
      const saved = sessionStorage.getItem('savedSponsor');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setFormData(prev => ({
            ...prev,
            customerName: data.customerName || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zip: data.zip || '',
          }));
        } catch (e) {}
      }
      sessionStorage.removeItem('orderAnother');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sponsor = {
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
    };
    sessionStorage.setItem('savedSponsor', JSON.stringify(sponsor));

      window.location.href = 'https://givebutter.com/memorial-brick-sales-vdqe3n/?amount=100';
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-[#263b6c] mb-4">Order Successful!</h2>
          <p className="text-gray-600 mb-8">You should receive a confirmation email shortly.</p>
          <div className="space-y-4">
            <button
              onClick={() => {
                sessionStorage.setItem('orderAnother', 'true');
                window.location.href = '/test-order';
              }}
              className="w-full bg-[#c43834] text-white px-8 py-3 rounded-xl font-medium"
            >
              Order Another Brick
            </button>
            <button
              onClick={() => window.close()}
              className="w-full bg-gray-200 text-gray-800 px-8 py-3 rounded-xl font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-[#263b6c] mb-2 text-center">Memorial Brick Order</h1>
        <p className="text-center text-gray-600 mb-8">St. James Veterans Memorial • Post 543</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brick lines */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Line 1</label>
            <input name="line1" value={formData.line1} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" maxLength={20} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Line 2</label>
            <input name="line2" value={formData.line2} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" maxLength={20} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Line 3</label>
            <input name="line3" value={formData.line3} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" maxLength={20} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Line 4</label>
            <input name="line4" value={formData.line4} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" maxLength={20} />
          </div>

          <hr className="my-6" />

          {/* Sponsor info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
            <input name="customerName" value={formData.customerName} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <input name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input name="city" value={formData.city} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input name="state" value={formData.state} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
            <input name="zip" value={formData.zip} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" />
          </div>

          <button type="submit" className="w-full bg-[#c43834] text-white py-3 rounded-xl font-medium text-lg">
            Continue to GiveButter
          </button>
        </form>
      </div>
    </div>
  );
}