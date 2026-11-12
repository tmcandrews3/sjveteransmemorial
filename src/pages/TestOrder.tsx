import { useState, type ChangeEvent, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function TestOrder() {
  const [searchParams] = useSearchParams();
  const isSuccess = searchParams.get('success') === '1';

  const [formData, setFormData] = useState({
    line1: '',
    line2: '',
    line3: '',
    line4: '',
    customerName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    email: '',
  });

  // 1. Save the form every time it changes
  useEffect(() => {
    sessionStorage.setItem('brickOrderForm', JSON.stringify(formData));
  }, [formData]);

  // 2. Restore the form when the page loads
  useEffect(() => {
    const saved = sessionStorage.getItem('brickOrderForm');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Could not restore form', e);
      }
    }
  }, []);

  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValid = () => {
    return (
      (formData.line1 || formData.line2 || formData.line3 || formData.line4) &&
      formData.customerName &&
      formData.phone &&
      formData.email
    );
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
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      };
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValid()) {
      alert('Please fill at least one engraving line, name, phone, and email.');
      return;
    }

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

    console.log('Order Submitted:', formData);
    setShowPreview(true);
    await sendToLob(orderData);
  };
if (isSuccess) {
  return (
    <div className="max-w-2xl mx-auto text-center py-12 px-6">
      {/* Logo */}
      <div className="mb-8">
        <img
          src="/images/american-legion-primary.png"
          alt="American Legion"
          className="h-16 md:h-20 mx-auto"
        />
      </div>

      <div className="bg-[#f8f9fa] border border-[#263b6c] rounded-2xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-[#263b6c] mb-3">
          Your order was successful!
        </h2>
        <p className="text-[#263b6c] text-lg">
          You should receive a copy of your invoice shortly.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => {
            window.history.replaceState({}, '', '/test-order');
            window.location.reload();
          }}
          className="bg-[#e04a38] hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg font-medium"
        >
          Order Another Brick
        </button>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl text-lg font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-white text-[#263b6c]">
    {/* Logo */}
    <div className="text-center pt-8 pb-4">
      <img
        src="/images/american-legion-primary.png"
        alt="American Legion"
        className="h-16 md:h-20 mx-auto"
      />
    </div>

    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        {showPreview ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-[#263b6c]">Preview Your Brick</h2>
            <div className="mt-6 rounded-2xl bg-[#f05f33] p-6 text-black shadow-lg max-w-md mx-auto">
              <div className="font-bold text-lg leading-tight whitespace-pre-line">
                {[
                  formData.line1,
                  formData.line2,
                  formData.line3,
                  formData.line4,
                ]
                  .filter(Boolean)
                  .join('\n') || 'Your Brick Message'}
              </div>
            </div>
            <p className="mt-4 text-gray-600">
              {isSuccess ? 'Order submitted successfully.' : 'This is a test preview only.'}
            </p>
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="mt-6 text-blue-600 underline"
            >
              ← Back to edit
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold text-[#263b6c]">St. James Veterans Memorial</h1>
              <h2 className="text-3xl font-bold text-red-600 mt-2">BUY A BRICK PROGRAM</h2>
              <p className="text-red-600 font-medium mt-4">TEST MODE</p>
            </div>

            <div className="max-w-3xl mx-auto mb-10 text-center">
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
                <input name="line1" placeholder="Line 1" onChange={handleChange} className="w-full p-4 border rounded-xl" />
                <input name="line2" placeholder="Line 2" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
                <input name="line3" placeholder="Line 3" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
                <input name="line4" placeholder="Line 4" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Your Information (required)</h3>
                <input name="customerName" placeholder="Full Name" required onChange={handleChange} className="w-full p-4 border rounded-xl" />
                <input name="phone" placeholder="Phone" required onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
                <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />

                <div className="mt-6 text-sm text-gray-500">Mailing address is optional but helpful</div>
                <input name="address" placeholder="Address (optional)" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <input name="city" placeholder="City (optional)" onChange={handleChange} className="w-full p-4 border rounded-xl" />
                  <input name="state" placeholder="State (optional)" onChange={handleChange} className="w-full p-4 border rounded-xl" />
                  <input name="zip" placeholder="Zip (optional)" onChange={handleChange} className="w-full p-4 border rounded-xl" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#e04a38] hover:bg-red-700 text-white font-medium py-5 rounded-2xl text-xl transition-all"
              >
                Submit Order (Test Mode)
              </button>
            </form>

            <footer className="bg-white border-t border-gray-200 py-12 text-center text-[#263b6c]">
              <div className="max-w-7xl mx-auto px-6">
                <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
                <div className="mt-3">
                  For questions or to report issues, please visit our{' '}
                  <a
                    href="https://ncpost543.org/contact-2/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e04a38] hover:underline"
                  >
                    Contact Page
                  </a>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  </div>
);
}