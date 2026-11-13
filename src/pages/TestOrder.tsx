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
setTimeout(() => {
  document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}, 100);
  };

  const confirmAndSend = async () => {
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
            onClick={() => {
              setIsSuccess(false);
              setShowPreview(false);
              setFormData({
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
            }}
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
    <div className="min-h-screen bg-gray-50 text-[#263b6c]">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#e04a38]">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <a href="https://ncpost543.org" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <img
              src="/images/american-legion-emblem.png"
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
            <div className="text-[#e04a38] text-lg font-bold tracking-widest">Post 543</div>
          </div>
          <a
            href="https://ncpost543.org"
            className="bg-[#e04a38] hover:bg-red-700 text-white px-5 md:px-8 py-2.5 rounded-xl font-medium text-sm md:text-base transition-colors whitespace-nowrap"
          >
            Home
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#263b6c]">St. James Veterans Memorial</h1>
          <h2 className="text-3xl font-bold text-red-600 mt-2">BUY A BRICK PROGRAM</h2>
          <p className="text-red-600 font-medium mt-4">TEST MODE</p>
        </div>

        <div className="mb-10 text-center">
          <p className="text-[#263b6c] font-semibold mb-4">Example Bricks</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <div className="bg-[#f05f33] text-black rounded-lg p-6 w-full max-w-xs shadow-lg">
              <div className="font-bold text-lg leading-tight">
                SGT. JAMES R. THOMPSON<br />
                U.S. ARMY<br />
                1967–1969<br />
                VIETNAM VETERAN
              </div>
            </div>
            <div className="bg-[#f05f33] text-black rounded-lg p-6 w-full max-w-xs shadow-lg">
              <div className="font-bold text-lg leading-tight">
                IN HONOR OF<br />
                CPL. LINDA M. JOHNSON<br />
                US ARMY NURSE CORPS<br />
                THANK YOU FOR YOUR SERVICE
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 text-sm leading-relaxed text-gray-700">
          You may purchase as many personalized bricks as you wish at $100.00 per brick.
          It could take several months before your brick is installed into the memorial.
          <br /><br />
          You may use up to 21 characters per line up to 4 lines.
          Any symbol, period, comma, dash, and blank spaces are considered one space.
          All engraving will be in capital letters and centered.
          <br /><br />
          QUESTIONS? Contact Tom Picinich at 201-218-8753 or tapicinich@ATMC.NET
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Brick Engraving (at least one line required)</h3>
            <div className="space-y-4">
              <input name="line1" placeholder="Line 1" value={formData.line1} onChange={handleChange} className="w-full p-4 border rounded-xl" />
              <input name="line2" placeholder="Line 2" value={formData.line2} onChange={handleChange} className="w-full p-4 border rounded-xl" />
              <input name="line3" placeholder="Line 3" value={formData.line3} onChange={handleChange} className="w-full p-4 border rounded-xl" />
              <input name="line4" placeholder="Line 4" value={formData.line4} onChange={handleChange} className="w-full p-4 border rounded-xl" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Your Information (required)</h3>
            <div className="space-y-4">
              <input name="customerName" placeholder="Full Name" value={formData.customerName} onChange={handleChange} className="w-full p-4 border rounded-xl" required />
              <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-4 border rounded-xl" required />
              <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-4 border rounded-xl" required />
              <p className="text-sm text-gray-500">Mailing address is optional but helpful</p>
              <input name="address" placeholder="Address (optional)" value={formData.address} onChange={handleChange} className="w-full p-4 border rounded-xl" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="city" placeholder="City (optional)" value={formData.city} onChange={handleChange} className="w-full p-4 border rounded-xl" />
                <input name="state" placeholder="State (optional)" value={formData.state} onChange={handleChange} className="w-full p-4 border rounded-xl" />
                <input name="zip" placeholder="Zip (optional)" value={formData.zip} onChange={handleChange} className="w-full p-4 border rounded-xl" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#c43834] hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold transition-colors">
            Preview Order
          </button>
        </form>

        {showPreview && !isSuccess && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-auto">
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
        {formData.address && (
          <p>{formData.address}, {formData.city} {formData.state} {formData.zip}</p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={confirmAndSend}
          className="flex-1 bg-[#c43834] text-white py-3 rounded-xl font-semibold"
        >
          Submit
        </button>
        <button
          onClick={() => setShowPreview(false)}
          className="flex-1 border border-gray-300 py-3 rounded-xl"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
)}

      <footer className="bg-white border-t border-gray-200 py-12 text-center text-[#263b6c] mt-12">
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
    </div>
  );
}