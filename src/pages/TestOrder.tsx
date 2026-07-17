import { useState } from 'react';

export default function TestOrder() {
  const [formData, setFormData] = useState({
    line1: '', line2: '', line3: '', line4: '',
    customerName: '', phone: '', address: '', city: '', state: '', zip: '', email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValid = () => {
    return (formData.line1 || formData.line2 || formData.line3 || formData.line4) &&
           formData.customerName && formData.phone && formData.email;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) {
      alert("Please fill at least one engraving line, name, phone, and email.");
      return;
    }
    console.log('Order Submitted:', formData);
    alert('✅ Test order received!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#263b6c]">St. James Veterans Memorial</h1>
          <h2 className="text-3xl font-bold text-red-600 mt-2">BUY A BRICK PROGRAM</h2>
          <p className="text-red-600 font-medium mt-4">TEST MODE</p>
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
            
            <div className="mt-6 text-sm text-gray-500">
              Mailing address is optional but helpful
            </div>
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
      </div>
    </div>
  );
}