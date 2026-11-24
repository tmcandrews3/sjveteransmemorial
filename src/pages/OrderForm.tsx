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

export default function OrderForm() {
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
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true' || params.get('success') === '1') {
  setShowSuccess(true);
  window.history.replaceState({}, '', '/buy-a-brick');

  // Pull the saved data for emails + Lob
  const saved = sessionStorage.getItem('savedSponsor');
  const order = saved ? JSON.parse(saved) : {};
  order.confirmationNumber = 'AC-543-' + Date.now().toString().slice(-6);

  // Send emails
  fetch('/api/send-order-emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }).catch(console.error);

  // Send to Lob
  fetch('/api/send-lob-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }).catch(console.error);

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

  // Basic validation – at least one brick line
  if (!formData.line1 && !formData.line2 && !formData.line3 && !formData.line4) {
    alert('Please enter at least one line for the brick inscription.');
    return;
  }

  // Save sponsor info for later
  const sponsor = {
    line1: formData.line1,
    line2: formData.line2,
    line3: formData.line3,
    line4: formData.line4,
    customerName: formData.customerName,
    phone: formData.phone,
    email: formData.email,
    address: formData.address,
    city: formData.city,
    state: formData.state,
    zip: formData.zip,
  };
  sessionStorage.setItem('savedSponsor', JSON.stringify(sponsor));

  // Show preview instead of jumping to payment
  setShowPreview(true);
};

  
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b-4 border-[#e04a38]">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
            <a href="https://ncpost543.org" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
              <img src="/images/american-legion-logo.png" alt="American Legion" className="h-14 md:h-20" />
            </a>
            <div className="text-center flex-1 px-4">
              <div className="text-[#e04a38] text-xl md:text-3xl font-bold tracking-widest">
                Richard H. Stewart, Jr. Post 543
              </div>
              <div className="text-[#e04a38] text-sm md:text-lg font-bold tracking-widest">
                St. James, NC 28461
              </div>
            </div>
            <div className="text-center py-4 text-sm">
          <a href="/find-a-brick" className="text-[#e04a38] hover:underline mx-3">Find a Brick</a>
          <a href="/buy-a-brick" className="text-[#e04a38] hover:underline mx-3">Buy a Brick</a>
          <a href="https://ncpost543.org" target="_blank" className="text-[#e04a38] hover:underline mx-3">Post 543</a>
        </div>
            <a href="https://ncpost543.org" className="bg-[#e04a38] hover:bg-red-700 text-white px-5 md:px-8 py-2.5 rounded-xl font-medium text-sm md:text-base transition-colors whitespace-nowrap">
              Home
            </a>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold text-[#263b6c] mb-4">Order Successful!</h2>
            <p className="text-gray-600 mb-8">You should receive a confirmation email shortly.</p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  sessionStorage.setItem('orderAnother', 'true');
                  window.location.href = '/buy-a-brick';
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

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8 text-center text-[#263b6c]">
          <div className="max-w-7xl mx-auto px-6">
            <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
            <div className="mt-2">
              For questions or to report issues, please visit our{" "}
              <a href="https://sjveteransmemorial.org/contact" target="_blank" rel="noopener noreferrer" className="text-[#e04a38] hover:underline">
                Contact Page
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#e04a38]">
  <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
    <a href="https://ncpost543.org" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
      <img 
        src="/images/american-legion-logo.png" 
        alt="American Legion" 
        className="h-14 md:h-20"
      />
    </a>
    
    <div className="text-center flex-1 px-4 hidden sm:block">
      <div className="text-[#e04a38] text-xl md:text-3xl font-bold tracking-widest">
        Richard H. Stewart, Jr. Post 543
      </div>
      <div className="text-[#e04a38] text-sm md:text-lg font-bold tracking-widest">
        St. James, NC 28461
      </div>
    </div>

    <div className="text-center flex-1 px-4 sm:hidden">
      <div className="text-[#e04a38] text-lg font-bold tracking-widest">
        Post 543
      </div>
    </div>

    <div className="flex items-center gap-3">
      <a 
        href="/find-a-brick"
        className="bg-[#263b6c] hover:bg-[#1e2f4d] text-white px-5 py-2 rounded-xl font-medium text-sm md:text-base transition-colors whitespace-nowrap"
      >
        Find a Brick
      </a>
      <a 
        href="https://ncpost543.org" 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-white border-2 border-[#e04a38] text-[#e04a38] hover:bg-[#e04a38] hover:text-white px-5 py-2 rounded-xl font-medium text-sm md:text-base transition-colors whitespace-nowrap"
      >
        Post 543
      </a>
    </div>
  </div>
</div>

      <div className="flex-1 py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-[#263b6c] mb-2 text-center">Memorial Brick Order</h1>
          <p className="text-center text-gray-600 mb-8">St. James Veterans Memorial • Post 543</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line 1</label>
              <input 
  name="line1" 
  value={formData.line1} 
  onChange={(e) => setFormData({ ...formData, line1: e.target.value.toUpperCase() })} 
  className="w-full border rounded-lg px-4 py-2" 
  maxLength={20} 
/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line 2</label>
              <input 
  name="line2" 
  value={formData.line2} 
  onChange={(e) => setFormData({ ...formData, line2: e.target.value.toUpperCase() })} 
  className="w-full border rounded-lg px-4 py-2" 
  maxLength={20} 
/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line 3</label>
              <input 
  name="line3" 
  value={formData.line3} 
  onChange={(e) => setFormData({ ...formData, line3: e.target.value.toUpperCase() })} 
  className="w-full border rounded-lg px-4 py-2" 
  maxLength={20} 
/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Line 4</label>
              <input 
  name="line4" 
  value={formData.line4} 
  onChange={(e) => setFormData({ ...formData, line4: e.target.value.toUpperCase() })} 
  className="w-full border rounded-lg px-4 py-2" 
  maxLength={20} 
/>
            </div>

            <hr className="my-6" />

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
              Preview Order & Pay
            </button>
          </form>
          {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <h3 className="text-2xl font-bold text-[#263b6c] mb-4">Order Preview</h3>
            <div className="bg-gray-50 p-6 rounded-xl mb-6 text-sm">
              <p className="font-semibold">Brick Inscription:</p>
              <p>{formData.line1 || '—'}</p>
              <p>{formData.line2 || '—'}</p>
              <p>{formData.line3 || '—'}</p>
              <p>{formData.line4 || '—'}</p>
              <p className="mt-4 font-semibold">Sponsor:</p>
              <p>{formData.customerName}</p>
              <p>{formData.phone}</p>
              <p>{formData.email}</p>
              {formData.address && <p>{formData.address}, {formData.city} {formData.state} {formData.zip}</p>}
            </div>
            <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h3 className="text-xl font-bold text-[#263b6c] mb-3 text-center">Before You Continue to Payment</h3>
              <p className="text-[#263b6c] mb-4 text-center text-sm">You’ll be taken to GiveButter to complete your $100 payment. Please follow these steps:</p>
              <ol className="space-y-2 text-[#263b6c] text-sm list-decimal list-inside">
                <li>Click <strong>“Donate”</strong></li>
                <li>Select <strong>$100</strong> and complete your information</li>
                <li>You can unselect any optional fees or extra donations</li>
                <li>Click <strong>“Continue”</strong> and finish payment</li>
              </ol>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
  onClick={() => {
 
    window.location.href = 'https://givebutter.com/memorial-brick-sales-vdqe3n/?amount=100';
}}
  className="flex-1 bg-[#c43834] text-white py-3 rounded-xl font-medium"
>
  Continue to GiveButter
</button>
              <button onClick={() => setShowPreview(false)} className="flex-1 border border-gray-300 py-3 rounded-xl font-medium">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-[#263b6c]">
        <div className="max-w-7xl mx-auto px-6">
          <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
          <div className="mt-2">
            For questions or to report issues, please visit our{" "}
            <a href="https://sjveteransmemorial.org/contact" target="_blank" rel="noopener noreferrer" className="text-[#e04a38] hover:underline">
              Contact Page
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}