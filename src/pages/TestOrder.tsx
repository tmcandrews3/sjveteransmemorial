import { useState } from 'react';

export default function TestOrder() {
  const [formData, setFormData] = useState({
    line1: '', line2: '', line3: '', line4: '',
    sponsor: '',
    customerName: '', customerAddress: '', customerEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Test Order Submitted:', formData);
    alert('✅ Test order received! (Stripe + Lob will go here in the next step)');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#263b6c]">Brick Order Form</h1>
          <p className="text-red-600 font-medium mt-2">TEST MODE — Nothing will be charged or mailed</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          {/* Inscription */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#263b6c]">Brick Inscription</h2>
            <input name="line1" placeholder="Line 1 (required)" required onChange={handleChange} className="w-full p-4 border rounded-xl" />
            <input name="line2" placeholder="Line 2" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
            <input name="line3" placeholder="Line 3" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
            <input name="line4" placeholder="Line 4" onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
          </div>

          {/* Sponsor */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#263b6c]">Sponsor (optional)</h2>
            <input name="sponsor" placeholder="Sponsor Name or Organization" onChange={handleChange} className="w-full p-4 border rounded-xl" />
          </div>

          {/* Customer Info */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-[#263b6c]">Your Information</h2>
            <input name="customerName" placeholder="Full Name" required onChange={handleChange} className="w-full p-4 border rounded-xl" />
            <textarea name="customerAddress" placeholder="Full Mailing Address" required onChange={handleChange} rows={4} className="w-full p-4 border rounded-xl mt-3" />
            <input name="customerEmail" type="email" placeholder="Email Address" required onChange={handleChange} className="w-full p-4 border rounded-xl mt-3" />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#e04a38] hover:bg-red-700 text-white font-medium py-5 rounded-2xl text-xl transition-all"
          >
            Submit Test Order
          </button>
        </form>
      </div>
    </div>
  );
}