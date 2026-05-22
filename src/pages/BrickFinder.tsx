import { useState, useEffect, useMemo } from 'react';
import { Search, Award, X } from 'lucide-react';

interface Brick {
  id: string;
  lines: string[];
  sponsor?: string;
  designator: string;
  side: string;
  section?: number;
  physicalRow?: number;
  sectRow?: number;
  purchased?: boolean;
}

export default function BrickFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrick, setSelectedBrick] = useState<Brick | null>(null);
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [sideView, setSideView] = useState<'Left' | 'Right'>('Right');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/bricks.json')
      .then(res => res.json())
      .then(data => {
        setBricks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
    setSearchTerm(brick.lines[0]);
    setSideView(brick.side as 'Left' | 'Right');
  };

  const clearSelection = () => {
    setSelectedBrick(null);
    setSearchTerm('');
  };

  const getSectionRow = (brick: Brick): number => {
    if (brick.sectRow) return brick.sectRow;
    const match = brick.designator.match(/R(\d+)B/);
    if (match) {
      const globalRow = parseInt(match[1]);
      if (brick.side === 'Left' && globalRow >= 83) {
        return globalRow - 82;
      }
      return ((globalRow - 1) % 12) + 1;
    }
    return brick.physicalRow || 1;
  };

  const getSectionNumber = (brick: Brick) => brick.section || '—';

  const visibleBricks = bricks.filter(b => b.side === sideView);

  return (
    <div className="min-h-screen bg-[#0a1625] text-white">
      {/* Hero - Local Optimized Image */}
      <div 
        className="relative h-[65vh] bg-cover bg-center flex items-center justify-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(10,22,37,0.78), rgba(10,22,37,0.88)), url('/images/memorial-wall.jpg')` 
        }}
      >
        <div className="text-center z-10 px-6">
          <div className="inline-flex items-center gap-3 bg-red-600/90 px-6 py-2 rounded-full mb-6">
            <Award className="w-8 h-8" />
            <span className="font-bold tracking-widest">ST. JAMES VETERANS MEMORIAL</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">BRICK FINDER</h1>
          <p className="text-2xl text-gray-300">Honor. Remember. Locate.</p>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-3xl mx-auto px-6 -mt-10 relative z-20">
        <div className="bg-gray-900 rounded-3xl p-6 shadow-2xl border border-gray-700">
          <div className="flex items-center bg-gray-950 rounded-2xl px-6 py-5">
            <Search className="w-6 h-6 text-gray-400 mr-4" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-xl placeholder-gray-400"
            />
            {searchTerm && <button onClick={clearSelection} className="ml-4 text-gray-400 hover:text-white"><X size={24} /></button>}
          </div>

          {suggestions.length > 0 && (
            <div className="absolute mt-3 w-full bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-h-[420px] overflow-auto z-50">
              {suggestions.map(brick => (
                <div key={brick.id} onClick={() => handleSelect(brick)}
                  className="px-6 py-5 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-none flex justify-between items-center">
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
      </div>

      {/* Selected Brick + Brick Path */}
      {selectedBrick && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Brick Info */}
          <div className="bg-gray-900 rounded-3xl p-10 mb-12 border border-gray-700">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-6">{selectedBrick.lines[0]}</h2>
                <div className="space-y-3 text-xl text-gray-200">
                  {selectedBrick.lines.slice(1).map((line, i) => line && <p key={i}>{line}</p>)}
                </div>
                {selectedBrick.sponsor && <p className="text-blue-400 mt-8 text-lg">Sponsor: {selectedBrick.sponsor}</p>}
              </div>

              <div className="text-center md:text-right">
                <div className="uppercase tracking-[3px] text-sm text-gray-400 mb-4">BRICK LOCATION</div>
                <div className="text-6xl font-bold text-[#ffe887] mb-2">{selectedBrick.side.toUpperCase()}</div>
                <div className="text-4xl font-bold text-white mb-1">SECTION {getSectionNumber(selectedBrick)}</div>
                <div className="text-4xl font-bold text-white">ROW {getSectionRow(selectedBrick)}</div>
                <div className="mt-10 text-xs text-gray-500 font-mono tracking-widest">
                  DESIGNATOR: {selectedBrick.designator}
                </div>
              </div>
            </div>
          </div>

          {/* Side Toggle */}
          <div className="flex gap-4 justify-center mb-8">
            <button onClick={() => setSideView('Right')} className={`px-12 py-5 rounded-2xl text-lg font-medium ${sideView === 'Right' ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>Right Side View</button>
            <button onClick={() => setSideView('Left')} className={`px-12 py-5 rounded-2xl text-lg font-medium ${sideView === 'Left' ? 'bg-blue-600 text-white' : 'bg-gray-800 hover:bg-gray-700'}`}>Left Side View</button>
          </div>

          {/* Brick Path */}
          <div className="bg-gray-950 border-2 border-gray-700 rounded-3xl p-8 overflow-auto max-h-[720px]">
            <div className="space-y-10">
              {Array.from({ length: 8 }).map((_, secIdx) => {
                const sectionNum = secIdx + 1;
                const sectionBricks = visibleBricks.filter(b => b.section === sectionNum);

                return (
                  <div key={sectionNum}>
                    <div className="text-center mb-6">
                      <div className="inline-block bg-red-900/50 text-red-400 px-8 py-2 rounded-full text-sm tracking-widest">SECTION {sectionNum}</div>
                    </div>
                    <div className="space-y-5">
                      {Array.from({ length: 12 }).map((_, rowIdx) => {
                        const rowNum = rowIdx + 1;
                        const isEvenRow = rowNum % 2 === 0;
                        const fullBricks = isEvenRow ? 5 : 6;

                        return (
                          <div key={rowNum} className="flex justify-center items-center gap-1.5">
                            {isEvenRow && <div className="w-11 h-11 bg-gray-500 border border-gray-600 rounded-l opacity-50"></div>}

                            {Array.from({ length: fullBricks }).map((_, colIdx) => {
                              const colNum = colIdx + 1;
                              const expectedDesignator = `S${sideView === 'Right' ? '1' : '2'}R${(sectionNum-1)*12 + rowNum}B${colNum}`;
                              
                              const brick = sectionBricks.find(b => b.designator === expectedDesignator);
                              
                              // Force highlight for S2R82B2 + normal selected
                              const isSelected = (selectedBrick && brick && brick.id === selectedBrick.id) || 
                                               brick?.id === "S2R82B2";

                              return (
                                <div
                                  key={colIdx}
                                  className={`w-20 h-11 flex items-center justify-center text-[10px] font-mono border transition-all hover:scale-105
                                    ${isSelected 
                                      ? 'bg-[#ffe887] text-black border-2 border-yellow-400 scale-110 shadow-2xl ring-2 ring-yellow-300' 
                                      : brick?.purchased !== false 
                                        ? 'bg-[#d86b23] text-white border-gray-600' 
                                        : 'bg-[#3cb371] text-white border-gray-600 opacity-75'}`}
                                  title={brick ? brick.lines[0] : 'Available'}
                                >
                                  {brick ? brick.designator.split('B')[1] : ''}
                                </div>
                              );
                            })}

                            {isEvenRow && <div className="w-11 h-11 bg-gray-500 border border-gray-600 rounded-r opacity-50"></div>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="h-8 bg-gray-700 my-8 rounded"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend with Active Link */}
          <div className="mt-12 flex flex-wrap gap-x-12 gap-y-4 justify-center text-sm">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#d86b23] rounded"></div> Purchased
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#ffe887] rounded"></div> <strong>Your Brick</strong>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-[#3cb371] rounded"></div> 
              <a href="https://ncpost543.org/docs/brick-order-form/" 
                 target="_blank" 
                 className="underline text-blue-400 hover:text-blue-300">
                Available → Order Form
              </a>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-black/50 py-12 text-center text-gray-500">
        Built with ❤️ for St. James Veterans Memorial • Post 543 • Southport, NC
      </footer>
    </div>
  );
}