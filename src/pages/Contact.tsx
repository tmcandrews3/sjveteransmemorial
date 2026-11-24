import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const res = await fetch('/api/send-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  });
  if (res.ok) {
    setSubmitted(true);
  } else {
    alert('Something went wrong. Please try again.');
  }
};

  return (
    <div className="min-h-screen bg-white text-[#263b6c]">
      {/* Header */}
      <div className="bg-white border-b-4 border-[#e04a38]">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
          <a href="https://ncpost543.org" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <img src="/images/american-legion-logo.png" alt="American Legion" className="h-14 md:h-20" />
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
          <div className="flex items-center gap-3">
         <a 
        href="/find-a-brick"
        className="bg-[#263b6c] hover:bg-red-700 text-white px-5 py-2 rounded-xl font-medium text-sm md:text-base transition-colors whitespace-nowrap"
      >        Find a Brick
      </a>
       <a 
        href="/buy-a-brick"
        className="bg-[#e04a38] hover:bg-red-700 text-white px-5 py-2 rounded-xl font-medium text-sm md:text-base transition-colors whitespace-nowrap"
      >
        Buy a Brick
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

      {/* Title */}
      <div className="bg-[#263b6c] py-12 text-white text-center">
          <h1 className="text-3xl md:text-4xl font-normal">Need Assistance?</h1>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <p className="text-center text-lg mb-8">
          If you need assistance completing the order form or help finding a brick, please fill this out and submit. Someone will get back to you as soon as possible.
        </p>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center text-green-800">
            Thank you. Your message has been received. We’ll get back to you shortly.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input name="name" required value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input type="email" name="email" required value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message *</label>
              <textarea name="message" required rows={5} value={form.message} onChange={handleChange} className="w-full border border-gray-300 rounded-xl px-4 py-3" />
            </div>
            <button type="submit" className="w-full bg-[#e04a38] hover:bg-red-700 text-white py-4 rounded-xl font-medium text-lg">
              Submit
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 text-center text-[#263b6c]">
        <div className="max-w-7xl mx-auto px-6">
          <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
        </div>
      </footer>
    </div>
  );
}