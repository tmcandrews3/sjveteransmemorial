import { useState, useEffect } from 'react';
import { Upload, Award, LogOut, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = "Post543Admin2026";   // ← CHANGE THIS TO SOMETHING SECURE

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [stats, setStats] = useState({ totalBricks: 0, lastUpdated: '' });

  // Load current stats
  useEffect(() => {
    fetch('/data/bricks.json')
      .then(res => res.json())
      .then(data => {
        setStats({
          totalBricks: data.length,
          lastUpdated: new Date().toLocaleString()
        });
      });
  }, []);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      alert("Incorrect password. Please try again.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const processFile = () => {
    if (!file) return;
    setStatus('success');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a1625] text-white flex items-center justify-center p-6">
        <div className="bg-gray-900 p-10 rounded-3xl border border-gray-700 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Lock className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>
          
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 text-lg mb-6 focus:outline-none focus:border-red-500"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl text-lg font-medium"
          >
            Enter Admin Area
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1625] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Award className="w-10 h-10 text-red-500" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <LogOut size={20} /> Exit Admin
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <p className="text-5xl font-bold mb-1">{stats.totalBricks}</p>
            <p className="text-gray-400">Total Bricks</p>
          </div>
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <p className="text-5xl font-bold mb-1">100%</p>
            <p className="text-gray-400">Uptime</p>
          </div>
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <p className="text-5xl font-bold mb-1">24</p>
            <p className="text-gray-400">Visitors Today</p>
          </div>
        </div>

        {/* Upload Area */}
        <div className="bg-gray-900 rounded-3xl p-10 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-8">Update Brick Database</h2>
          
          <div className="border-2 border-dashed border-gray-600 rounded-2xl p-12 text-center mb-10">
            <Upload className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <p className="text-xl mb-2">Upload your updated CSV file</p>
            <p className="text-gray-400 mb-8">Memorial-Brick-Customer-List.csv</p>
            
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-4 file:px-8 file:rounded-2xl file:border-0 file:text-sm file:font-medium file:bg-gray-800 file:text-white hover:file:bg-gray-700 cursor-pointer"
            />
          </div>

          <button
            onClick={processFile}
            disabled={!file}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 py-5 rounded-2xl text-xl font-medium transition-colors disabled:cursor-not-allowed"
          >
            Process Uploaded CSV
          </button>

          {status === 'success' && (
            <div className="mt-8 p-6 bg-green-900/30 border border-green-700 rounded-2xl text-green-400">
              <p className="font-medium">✅ File received successfully.</p>
              <p className="mt-3 font-mono text-sm">Next: Run <span className="bg-black/50 px-2 py-1 rounded">node update-bricks.mjs</span> in your terminal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}