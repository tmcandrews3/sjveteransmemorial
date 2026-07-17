import { useState } from 'react';

export default function TestOrder() {
  const [formData, setFormData] = useState({
    line1: '', line2: '', line3: '', line4: '',
    sponsor: '',
    customerName: '', phone: '', address: '', city: '', state: '', zip: '', email: '',
    amountPaid: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Order Submitted:', formData);
    alert('✅ Test order received! (Full payment + PDF + mailing coming next)');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#263b6c]">St. James Veterans Memorial</h1>
          <h2 className="text-3xl font-bold text-red-600 mt-2">BUY A BRICK PROGRAM</h2>
          <p className="text-red-600 font-medium mt-4">TEST MODE — Nothing will be charged or mailed</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Brick Engraving Instructions</h3>
            <p className="text-sm text-gray-600 mb-6">
              You may use up to 21 characters per line (up to 4 lines). All engraving will be in capital letters and centered.
            </p>
            
            <input name="line1" placeholder="Line 1 (required)" required onChange={handleChange} className="w-full p-4 border rounded-xl" />
            <input name="line2" placeholder="Line 2" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
            <input name="line3" placeholder="Line 3" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
            <input name="line4" placeholder="Line 4" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Sponsor (optional)</h3>
            <input name="sponsor" placeholder="Sponsor Name" onChange={handleChange} className="w-full p-4 border rounded-xl" />
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Your Information</h3>
            <input name="customerName" placeholder="Name" required onChange={handleChange} className="w-full p-4 border rounded-xl" />
            <input name="phone" placeholder="Phone" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
            <input name="address" placeholder="Address" required onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
            <div className="grid grid-cols-2 gap-4 mt-3">
              <input name="city" placeholder="City" required onChange={handleChange} className="w-full p-4 border rounded-xl" />
              <input name="state" placeholder="State" required onChange={handleChange} className="w-full p-4 border rounded-xl" />
            </div>
            <input name="zip" placeholder="Zip" required onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
            <input name="email" type="email" placeholder="Email" required onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#e04a38] hover:bg-red-700 text-white font-medium py-5 rounded-2xl text-xl transition-all"
          >
            Submit Order (Test Mode)
          </button>
        </form>
      </div>
    </div>
  );
}