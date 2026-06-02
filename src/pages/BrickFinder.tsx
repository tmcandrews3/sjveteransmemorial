import { useState, useEffect, useMemo } from 'react';
import { Search, Award, X } from 'lucide-react';

interface Brick {
  id: string;
  lines: string[];
  sponsor?: string;
  designator: string;
  side: string;
  section: number;
  sectRow: number;
  purchased: boolean;
}

export default function BrickFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrick, setSelectedBrick] = useState<Brick | null>(null);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    fetch('/data/bricks.json')
      .then(res => res.json())
      .then(data => setBricks(data));
  }, []);

  const suggestions = useMemo(() => {
    if (searchTerm.length < 2 || selectedBrick) return [];
    return bricks
      .filter(brick => 
        brick.lines.some(line => line.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (brick.sponsor && brick.sponsor.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .slice(0, 12);
  }, [bricks, searchTerm, selectedBrick]);

  const handleSelect = (brick: Brick) => {
    setSelectedBrick(brick);
    setSearchTerm(brick.lines[0] || '');
  };

  const clearSelection = () => {
    setSelectedBrick(null);
    setSearchTerm('');
    setShowShare(false);
  };

  return (
    <div className="min-h-screen bg-[#0a1625] text-white">
      {/* Hero */}
      <div 
        className="relative h-[50vh] md:h-[65vh] bg-cover bg-center flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(10,22,37,0.85), rgba(10,22,37,0.9)), url('/images/memorial-wall.jpg')` 
        }}
      >
        <div className="text-center z-10 px-6">
          <div className="inline-flex items-center gap-3 bg-red-600/90 px-6 py-2 rounded-full mb-6">
            <Award className="w-7 h-7 md:w-8 md:h-8" />
            <span className="font-bold tracking-widest text-sm md:text-base">ST. JAMES VETERANS MEMORIAL</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 tracking-tight">BRICK FINDER</h1>
          <p className="text-xl md:text-2xl text-gray-300">Honor & Remember</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-3xl mx-auto px-4 md:px-6 -mt-8 md:-mt-10 relative z-20">
        <div className="text-center mb-3 px-4">
          <p className="text-gray-400 text-base md:text-lg">
            Please type in a name below to begin:
          </p>
        </div>

        <div 
          className="bg-gray-900 rounded-3xl p-5 md:p-6 shadow-2xl border border-gray-700 cursor-pointer"
          onClick={clearSelection}
        >
          <div className="flex items-center bg-gray-950 rounded-2xl px-5 py-4 md:px-6 md:py-5">
            <Search className="w-5 h-5 md:w-6 md:h-6 text-gray-400 mr-4" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg md:text-xl placeholder-gray-400"
              onClick={(e) => e.stopPropagation()}
            />
            
            {searchTerm && (
              <button 
                onClick={(e) => { e.stopPropagation(); clearSelection(); }} 
                className="ml-2 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium text-gray-300"
              >
                <X size={18} />
                CLEAR
              </button>
            )}
          </div>
        </div>

        {selectedBrick && (
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">Hit CLEAR to start a new search</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="absolute mt-3 w-full bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-h-[420px] overflow-auto z-50">
            {suggestions.map(brick => (
              <div 
                key={brick.designator} 
                onClick={() => handleSelect(brick)}
                className="px-6 py-5 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-none flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{brick.lines[0]}</div>
                  <div className="text-sm text-gray-400">{brick.lines[1] || ''}</div>
                </div>
                <div className="text-xs text-gray-500 font-mono">{brick.designator}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedBrick && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          {/* Brick Visual */}
          <div className="flex justify-center mb-10">
            <div className="w-full max-w-[620px]">
              <div 
                className="bg-[#f05f33] aspect-[2/1] rounded-3xl shadow-2xl border-8 border-[#c14a28] flex items-center justify-center p-6 md:p-8 text-center"
                style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
              >
                <div className="space-y-2 md:space-y-3 text-[#010109] font-bold leading-tight text-2xl md:text-[2.5rem]">
                  {selectedBrick.lines.map((line, index) => (
                    line && <div key={index}>{line}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="max-w-3xl mx-auto bg-gray-900 rounded-3xl p-8 md:p-10 border border-gray-400">
            {selectedBrick.sponsor && (
              <p className="text-blue-400 text-xl md:text-2xl mb-8 text-center">
                Sponsor: <span className="font-medium">{selectedBrick.sponsor}</span>
              </p>
            )}

            <div className="text-center">
              <div className="uppercase tracking-[3px] text-base md:text-xl text-gray-400 mb-6">BRICK LOCATION</div>
              
              <div className="text-5xl md:text-6xl font-bold text-[#ffe887] mb-3">
                {selectedBrick.side.toUpperCase()}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                SECTION {selectedBrick.section}
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-8">
                ROW {selectedBrick.sectRow}
              </div>

              <div className="text-sm md:text-base text-gray-500 font-mono tracking-widest">
                DESIGNATOR: {selectedBrick.designator}
              </div>
            </div>
          </div>

          {/* Share Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-3 bg-[#0e1cdd] hover:bg-[#0a1ab8] text-white px-8 py-4 rounded-2xl text-lg font-medium transition-all shadow-lg"
            >
              🔗 Share this Brick
            </button>
          </div>

          {/* Scroll Prompt */}
          <div className="text-center mt-10 mb-8">
            <p className="inline-block bg-[#ffe887] text-black px-8 py-3 rounded-2xl text-lg md:text-xl font-medium">
              ↓ Scroll down to see your brick highlighted
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-8 md:gap-x-12 gap-y-4 justify-center text-sm mb-10">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#f05f33] rounded"></div> Purchased
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#ffe887] rounded"></div> <strong>Your Brick</strong>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#3cb371] rounded"></div> 
              <a href="https://ncpost543.org/docs/brick-order-form/" target="_blank" className="underline text-blue-400 hover:text-blue-300">
                Available → Order Form
              </a>
            </div>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mt-12">
            <a 
              href="/data/St-James-Veterans-Brick-List.xlsx" 
              download="St-James-Veterans-Brick-List.xlsx"
              className="flex items-center gap-3 bg-gray-800 hover:bg-gray-700 px-10 py-5 rounded-2xl text-lg font-medium transition-all border border-gray-600 hover:border-gray-500"
            >
              📥 Download Complete Brick List (XLSX)
            </a>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShare && selectedBrick && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6 text-center">Share this Brick</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Facebook */}
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" className="flex flex-col items-center gap-2 p-6 bg-[#1877F2] hover:bg-[#1666d6] rounded-2xl text-white">
                <span className="text-3xl">📘</span>
                <span>Facebook</span>
              </a>

              {/* X */}
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Found this brick at St. James Veterans Memorial!\n\n${selectedBrick.lines[0]}`)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" className="flex flex-col items-center gap-2 p-6 bg-black hover:bg-gray-900 rounded-2xl text-white border border-gray-700">
                <span className="text-3xl">𝕏</span>
                <span>X</span>
              </a>

              {/* WhatsApp */}
              <a href={`https://wa.me/?text=${encodeURIComponent(`Found this brick at St. James Veterans Memorial!\n\n${selectedBrick.lines[0]}\n\nView it here: ${window.location.href}`)}`} target="_blank" className="flex flex-col items-center gap-2 p-6 bg-[#25D366] hover:bg-[#20b557] rounded-2xl text-white">
                <span className="text-3xl">💬</span>
                <span>WhatsApp</span>
              </a>

              {/* Email - Improved with HTML link */}
              <a 
                href={`mailto:?subject=Found this brick at St. James Veterans Memorial&body=${encodeURIComponent(`Found this brick at St. James Veterans Memorial!\n\n${selectedBrick.lines.join('\n')}\n\nView it here: ${window.location.href}`)}`}
                className="flex flex-col items-center gap-2 p-6 bg-gray-700 hover:bg-gray-600 rounded-2xl text-white"
              >
                <span className="text-3xl">✉️</span>
                <span>Email</span>
              </a>
            </div>

            <button onClick={() => setShowShare(false)} className="mt-8 w-full py-3 text-gray-400 hover:text-white">
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="bg-black/50 py-12 text-center text-gray-500">
        <div>Veterans Memorial • Post 543 • St. James, NC</div>
        <div className="mt-3">
          For questions or to report issues, please visit our{" "}
          <a href="https://ncpost543.org/contact-2/" target="_blank" className="text-blue-400 hover:text-blue-300 underline">Contact Page</a>
        </div>
      </footer>
    </div>
  );
}