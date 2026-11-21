import { useState, useEffect } from 'react';

const STORAGE_KEY = 'pendingBrickOrder';
const SPONSOR_KEY = 'brickSponsorInfo';

export default function TestOrder() {
  const [formData, setFormData] = useState({
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

  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState('');

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get('success') === 'true') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const order = JSON.parse(saved);          // ← order is declared here
      setConfirmationNumber(order.confirmationNumber || 'AC-543-XXXXXX');
      setShowSuccess(true);

      // Send emails
      fetch('/api/send-order-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      }).catch(console.error);
    }
  } else {
    // Only restore sponsor info if they just clicked "Order Another"
    const savedSponsor = localStorage.getItem(SPONSOR_KEY);
    if (savedSponsor && sessionStorage.getItem('orderAnother') === 'true') {
      const sponsor = JSON.parse(savedSponsor);
      setFormData(prev => ({ ...prev, ...sponsor }));
      sessionStorage.removeItem('orderAnother');
    } else {
      localStorage.removeItem(SPONSOR_KEY);
    }
  }
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    setShowPreview(true);
  };

  const orderAnother = () => {
  sessionStorage.setItem('orderAnother', 'true');
    setShowSuccess(false);
    setShowPreview(false);
    setFormData(prev => ({
      ...prev,
      line1: '',
      line2: '',
      line3: '',
      line4: '',
    }));
  };

  const done = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SPONSOR_KEY);
    setShowSuccess(false);
    window.location.href = '/';
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white text-[#263b6c]">
        {/* Header */}
        <div className="bg-white border-b-4 border-[#e04a38]">
          <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
            <a href="https://ncpost543.org" target="_blank" rel="noopener noreferrer">
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
            <a href="/" className="bg-[#e04a38] hover:bg-red-700 text-white px-5 md:px-8 py-2.5 rounded-xl font-medium text-sm md:text-base">
              Home
            </a>
          </div>
        </div>

        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <h1 className="text-4xl font-bold text-[#c43834] mb-4">Order Successful!</h1>
            <p className="text-xl mb-6">Your order was successful!</p>
            <p className="text-2xl font-bold mb-8">
              Confirmation #: <span className="text-[#c43834]">{confirmationNumber}</span>
            </p>
            <p className="mb-8">
              You should receive a copy of your invoice from GiveButter shortly, and a confirmation email from us with your brick details.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={orderAnother} className="bg-[#c43834] text-white px-8 py-3 rounded-xl font-medium">
                Order Another Brick
              </button>
              <button onClick={done} className="border border-gray-300 px-8 py-3 rounded-xl font-medium">
                Done
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-12 text-center text-[#263b6c]">
          <div className="max-w-7xl mx-auto px-6">
            <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
            <div className="mt-3">
              For questions or to report issues, please visit our{" "}
              <a href="https://ncpost543.org/contact-2/" target="_blank" rel="noopener noreferrer" className="text-[#e04a38] hover:underline">
                Contact Page
              </a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#263b6c]">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#e04a38]">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <a href="https://ncpost543.org" target="_blank" rel="noopener noreferrer">
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
          <a href="/" className="bg-[#e04a38] hover:bg-red-700 text-white px-5 md:px-8 py-2.5 rounded-xl font-medium text-sm md:text-base">
            Home
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold text-[#c43834] text-center mb-2">Order a Memorial Brick</h1>
        <p className="text-center mb-8">Richard H. Stewart, Jr. Post 543 • St. James, NC</p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-3xl shadow-sm">
          <div>
            <h2 className="text-2xl font-bold mb-4">Brick Inscription</h2>
            <p className="text-sm text-gray-600 mb-4">Up to 4 lines. All engraving will be in capital letters and centered.</p>
            <input name="line1" value={formData.line1} onChange={handleChange} placeholder="Line 1" className="w-full p-3 border rounded-xl mb-3" />
            <input name="line2" value={formData.line2} onChange={handleChange} placeholder="Line 2" className="w-full p-3 border rounded-xl mb-3" />
            <input name="line3" value={formData.line3} onChange={handleChange} placeholder="Line 3" className="w-full p-3 border rounded-xl mb-3" />
            <input name="line4" value={formData.line4} onChange={handleChange} placeholder="Line 4" className="w-full p-3 border rounded-xl" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Your Information</h2>
            <input name="customerName" value={formData.customerName} onChange={handleChange} placeholder="Full Name *" required className="w-full p-3 border rounded-xl mb-3" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone *" required className="w-full p-3 border rounded-xl mb-3" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email *" required className="w-full p-3 border rounded-xl mb-3" />
            <input name="address" value={formData.address} onChange={handleChange} placeholder="Mailing Address (optional)" className="w-full p-3 border rounded-xl mb-3" />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" value={formData.city} onChange={handleChange} placeholder="City" className="p-3 border rounded-xl" />
              <input name="state" value={formData.state} onChange={handleChange} placeholder="State" className="p-3 border rounded-xl" />
            </div>
            <input name="zip" value={formData.zip} onChange={handleChange} placeholder="ZIP" className="w-full p-3 border rounded-xl mt-3" />
          </div>

          <button type="submit" className="w-full bg-[#c43834] text-white py-4 rounded-xl text-lg font-medium">
            Submit Order
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-8">
          You may purchase as many personalized bricks as you wish at $100.00 per brick.<br />
          It could take several months before your brick is installed into the memorial.
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-[#263b6c]">
        <div className="max-w-7xl mx-auto px-6">
          <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
          <div className="mt-3">
            For questions or to report issues, please visit our{" "}
            <a href="https://ncpost543.org/contact-2/" target="_blank" rel="noopener noreferrer" className="text-[#e04a38] hover:underline">
              Contact Page
            </a>
          </div>
        </div>
      </footer>

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
                  const orderToSave = {
                    ...formData,
                    confirmationNumber: 'AC-543-' + Date.now().toString().slice(-6),
                    amount: '100',
                  };
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(orderToSave));
                  const sponsorInfo = {
                    customerName: formData.customerName,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                  };
                  localStorage.setItem(SPONSOR_KEY, JSON.stringify(sponsorInfo));
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
  );
}