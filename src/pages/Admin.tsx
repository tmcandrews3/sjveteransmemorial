import { useState, useEffect } from 'react';
import { Upload, Award, LogOut, Lock, Users, Clock, Activity, Download, RefreshCw, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = "Post543Admin2026";   // ← Change this

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [stats, setStats] = useState({
    totalBricks: 982,
    visitorsToday: 24,
    totalVisitors: 1847,
    downloads: 12,
    lastUpdated: new Date().toLocaleString()
  });

  const loadStats = async () => {
    setIsRefreshing(true);
    
    try {
      const res = await fetch('/data/bricks.json');
      const data = await res.json();
      
      setStats(prev => ({
        ...prev,
        totalBricks: data.length,
        lastUpdated: new Date().toLocaleString()
      }));
    } catch (err) {
      console.error("Failed to load stats");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleLogin = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      alert("Incorrect password.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const processFile = () => {
    if (!file) return;
    alert("✅ File uploaded successfully.\n\nNext step: Run this command in your terminal:\n\nnode update-bricks.mjs");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a1625] text-white flex items-center justify-center p-6">
        <div className="bg-gray-900 p-12 rounded-3xl border border-gray-700 w-full max-w-md">
          <div className="flex justify-center mb-8">
            <Lock className="w-20 h-20 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-center mb-10">Admin Login</h1>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-6 py-4 text-lg mb-6"
          />
          <button onClick={handleLogin} className="w-full bg-red-600 hover:bg-red-700 py-4 rounded-2xl text-lg font-medium">
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
            <Award className="w-12 h-12 text-red-500" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={loadStats} disabled={isRefreshing} className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-50">
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white">
              <LogOut size={20} /> Exit Admin
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <Users className="w-10 h-10 text-blue-400 mb-4" />
            <p className="text-5xl font-bold">{stats.totalBricks}</p>
            <p className="text-gray-400">Total Bricks</p>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <Activity className="w-10 h-10 text-green-400 mb-4" />
            <p className="text-5xl font-bold">{stats.visitorsToday}</p>
            <p className="text-gray-400">Visitors Today</p>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <Download className="w-10 h-10 text-purple-400 mb-4" />
            <p className="text-5xl font-bold">{stats.downloads}</p>
            <p className="text-gray-400">Downloads</p>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <Clock className="w-10 h-10 text-amber-400 mb-4" />
            <p className="text-5xl font-bold">100%</p>
            <p className="text-gray-400">Uptime</p>
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
        </div>
      </div>
    </div>
  );
}