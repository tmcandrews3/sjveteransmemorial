import { Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#263b6c]">
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
            <a href="https://ncpost543.org" className="bg-[#e04a38] hover:bg-red-700 text-white px-5 md:px-8 py-2.5 rounded-xl font-medium text-sm md:text-base transition-colors whitespace-nowrap">
              Home
            </a>
          </div>
        </div>

      {/* Main content – two big buttons */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="grid md:grid-cols-2 gap-8">
          <a
            href="/find-a-brick"
            className="bg-[#263b6c] hover:bg-[#1e2f4d] text-white rounded-3xl p-12 shadow-xl transition-all"
          >
            <Award className="w-16 h-16 mx-auto mb-6" />
            <div className="text-3xl font-bold">Find a Brick</div>
          </a>

          <a
            href="/buy-a-brick"
            className="bg-[#e04a38] hover:bg-red-700 text-white rounded-3xl p-12 shadow-xl transition-all"
          >
            <Award className="w-16 h-16 mx-auto mb-6" />
            <div className="text-3xl font-bold">Buy a Brick</div>
          </a>
        </div>
      </div>

      {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8 text-center text-[#263b6c]">
          <div className="max-w-7xl mx-auto px-6">
            <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
            <div className="mt-2">
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