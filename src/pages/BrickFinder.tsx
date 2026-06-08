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
  const [sideView, setSideView] = useState<'Left' | 'Right'>('Right');
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
    setSideView(brick.side as 'Left' | 'Right');
  };

  const clearSelection = () => {
    setSelectedBrick(null);
    setSearchTerm('');
    setShowShare(false);
  };

  const isSelectedBrick = (designator: string) => selectedBrick?.designator === designator;
  const visibleBricks = bricks.filter(b => b.side === sideView);

return (
    <div className="min-h-screen bg-white text-[#263b6c]">
      {/* Updated Header */}
      <div className="bg-white border-b-4 border-[#c43834]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="https://ncpost543.org" target="_blank" rel="noopener noreferrer">
              <img 
                src="/images/american-legion-logo.png" 
                alt="American Legion Post 543" 
                className="h-20 md:h-24 hover:opacity-90 transition-opacity"
              />
            </a>
            <div className="text-center">
              <div className="text-[#c43834] text-2xl md:text-3xl font-bold tracking-tight">
                Richard H. Stewart, Jr. Post 543
              </div>
              <div className="text-[#c43834] text-lg md:text-xl">
                St. James, NC 28461
              </div>
            </div>
          </div>

          <a 
            href="https://ncpost543.org" 
            className="bg-[#c43834] hover:bg-red-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            Home
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-[#263b6c] py-12 md:py-16 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-3 bg-[#c43834] px-8 py-3 rounded-full mb-6">
            <Award className="w-8 h-8" />
            <span className="font-bold tracking-widest text-lg">BRICK FINDER</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Honor & Remember</h1>
          <p className="text-xl md:text-2xl text-blue-200">Search for a memorial brick</p>
        </div>
      </div>

{/* Main Content Area - White Background */}
<div className="max-w-3xl mx-auto px-4 md:px-6 py-8 font-sans">
        <div className="text-center mb-6">
          <p className="text-[#263b6c] text-lg md:text-xl font-semibold">
            Please type in a name below to begin:
          </p>
        </div>

        <div 
          className="bg-white rounded-3xl p-5 md:p-6 shadow-xl border-4 border-[#263b6c] cursor-pointer"
          onClick={clearSelection}
        >
          <div className="flex items-center bg-gray-100 rounded-2xl px-5 py-4 md:px-6 md:py-5 border border-gray-300">
            <Search className="w-6 h-6 text-gray-500 mr-4" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg md:text-xl placeholder:text-[#c0972a] text-[#263b6c]"
              onClick={(e) => e.stopPropagation()}
            />
            
            {searchTerm && (
              <button 
                onClick={(e) => { e.stopPropagation(); clearSelection(); }} 
                className="ml-2 flex items-center gap-2 bg-[#c43834] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
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

          {/* Brick Path Grid */}
          <div className="bg-gray-950 border-2 border-gray-700 rounded-3xl p-6 md:p-8 overflow-auto max-h-[620px]">
            <div className="space-y-8 md:space-y-10">
              {Array.from({ length: 9 }).map((_, secIdx) => {
                const sectionNum = secIdx + 1;
                return (
                  <div key={sectionNum}>
                    <div className="text-center mb-6">
                      <div className="inline-block bg-red-900/50 text-red-400 px-8 py-2 rounded-full text-sm tracking-widest">SECTION {sectionNum}</div>
                    </div>
                    <div className="space-y-4">
                      {Array.from({ length: 12 }).map((_, rowIdx) => {
                        const rowNum = rowIdx + 1;
                        const isEvenRow = rowNum % 2 === 0;
                        const fullBricks = isEvenRow ? 5 : 6;

                        return (
                          <div key={rowNum} className="flex justify-center items-center gap-1">
                            {isEvenRow && <div className="w-9 h-9 md:w-11 md:h-11 bg-gray-500 border border-gray-600 rounded-l opacity-50"></div>}

                            {Array.from({ length: fullBricks }).map((_, colIdx) => {
                              const colNum = colIdx + 1;
                              const brick = visibleBricks.find(b => 
                                b.section === sectionNum && b.sectRow === rowNum && b.designator.endsWith(`B${colNum}`)
                              );

                              const isSelected = brick && isSelectedBrick(brick.designator);

                              return (
                                <div
                                  key={colIdx}
                                  className={`w-16 h-9 md:w-20 md:h-11 flex items-center justify-center text-[9px] md:text-[10px] font-mono border transition-all hover:scale-105
                                    ${isSelected 
                                      ? 'bg-[#ffe887] text-black border-2 border-yellow-400 scale-110 shadow-2xl ring-2 ring-yellow-300' 
                                      : brick?.purchased 
                                        ? 'bg-[#f05f33] text-white border-gray-600' 
                                        : 'bg-[#3cb371] text-white border-gray-600 opacity-75'}`}
                                  title={brick ? brick.lines[0] : 'Available'}
                                >
                                  {brick ? colNum : ''}
                                </div>
                              );
                            })}

                            {isEvenRow && <div className="w-9 h-9 md:w-11 md:h-11 bg-gray-500 border border-gray-600 rounded-r opacity-50"></div>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-6 md:h-8 bg-gray-700 my-6 md:my-8 rounded"></div>
                  </div>
                );
              })}
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

{/* Share Modal - Copy + Email Only */}
      {showShare && selectedBrick && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-6 text-center">Share this Brick</h3>
            
            <div className="space-y-4">
              {/* Copy Link */}
              <button
                onClick={() => {
                  const text = `Found this brick at St. James Veterans Memorial!\n\n${selectedBrick.lines.join('\n')}\n\nView it here: ${window.location.href}`;
                  navigator.clipboard.writeText(text);
                  alert("✅ Brick info and link copied to clipboard!");
                  setShowShare(false);
                }}
                className="w-full flex items-center justify-center gap-3 bg-[#0e1cdd] hover:bg-[#0a1ab8] text-white py-5 rounded-2xl text-lg font-medium transition-all"
              >
                📋 Copy Link & Info
              </button>

              {/* Email */}
              <a 
                href={`mailto:?subject=A nice honor&body=${encodeURIComponent(`Found this brick at St. James Veterans Memorial!\n\n${selectedBrick.lines.join('\n')}\n\nView it here:\n${window.location.href}`)}`}
                onClick={() => setShowShare(false)}
                className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white py-5 rounded-2xl text-lg font-medium transition-all"
              >
                ✉️ Share via Email
              </a>
            </div>

            <button 
              onClick={() => setShowShare(false)} 
              className="mt-8 w-full py-3 text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

<footer className="bg-white border-t border-gray-200 py-12 text-center text-[#263b6c]">
        <div className="max-w-7xl mx-auto px-6">
          <div>Veterans Memorial • Richard H. Stewart, Jr. Post 543 • St. James, NC 28461</div>
          <div className="mt-3">
            For questions or to report issues, please visit our{" "}
            <a href="https://ncpost543.org/contact-2/" target="_blank" rel="noopener noreferrer" className="text-[#c43834] hover:underline">
              Contact Page
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}