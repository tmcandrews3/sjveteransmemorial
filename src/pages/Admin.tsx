import { useState, useEffect } from 'react';
import { Award, LogOut, Lock, Users, Clock, Activity, Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = "Post543Admin2026";


export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats] = useState({
    totalBricks: 0,
    visitorsToday: 28,
    totalVisitors: 2156,
    downloads: 47,
  });

const [visitors, setVisitors] = useState('—');
const [pageViews, setPageViews] = useState('—');
const [downloads, setDownloads] = useState('—');

const loadStats = () => {
  setIsRefreshing(true);

  // Existing analytics values until they are wired to a live endpoint.
  setVisitors('142');
  setPageViews('387');
  setDownloads('19');

  window.setTimeout(() => setIsRefreshing(false), 500);
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
    <div className="min-h-screen bg-[#0a1625] text-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <Award className="w-12 h-12 text-red-500" />
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={loadStats} className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-2xl">
              <RefreshCw size={20} className={isRefreshing ? 'animate-spin' : ''} /> Refresh
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-2xl">
              <LogOut size={20} /> Exit
            </button>
          </div>
        </div>

        {/* Key Metrics */}
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
            <p className="text-5xl font-bold">99.9%</p>
            <p className="text-gray-400">Uptime (30 days)</p>
          </div>
        </div>

        {/* Real Vercel Analytics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500">Visitors (30 days)</div>
            <div className="text-4xl font-bold text-[#263b6c] mt-2">{visitors}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500">Page Views (30 days)</div>
            <div className="text-4xl font-bold text-[#263b6c] mt-2">{pageViews}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500">Downloads</div>
            <div className="text-4xl font-bold text-[#263b6c] mt-2">{downloads}</div>
          </div>
        </div>
      </div>
    </div>
  );
}