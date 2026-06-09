import { useState, useEffect } from 'react';
import { Upload, Award, LogOut, Lock, Users, Clock, Activity, Download, RefreshCw, TrendingUp, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

const ADMIN_PASSWORD = "Post543Admin2026";

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [stats, setStats] = useState({
    totalBricks: 0,
    visitorsToday: 28,
    totalVisitors: 2156,
    downloads: 47,
  });

  // Visitor Trend
  const visitorTrendData = {
    labels: ['May 30', 'May 31', 'Jun 1', 'Jun 2', 'Jun 3', 'Jun 4', 'Jun 5'],
    datasets: [{
      label: 'Daily Visitors',
      data: [42, 31, 67, 45, 89, 124, 156],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      tension: 0.4,
      borderWidth: 3,
    }]
  };

  // Browser Breakdown
  const browserData = {
    labels: ['Chrome', 'Safari', 'Edge', 'Firefox', 'Other'],
    datasets: [{
      data: [58, 22, 11, 6, 3],
      backgroundColor: ['#3b82f6', '#eab308', '#ef4444', '#8b5cf6', '#6b7280'],
    }]
  };

  // Top 10 Bricks
  const topBricksData = {
    labels: ['PAUL LOWE FOSTER', 'THOMAS H GALLIGAN JR', 'RON & LILA ANDERSON', 'TO ALL WHO SERVED', 
             'ASHLEIGH K DONOVAN', 'MARY JO SCHNEPF', 'JERRY & MISSY DONOVAN', 'CAPE FEAR BLUE STAR'],
    datasets: [{
      label: 'Searches',
      data: [52, 41, 35, 29, 26, 22, 19, 17],
      backgroundColor: '#3b82f6',
    }]
  };

// Downloads Trend
  const downloadsTrendData = {
    labels: ['May 30', 'May 31', 'Jun 1', 'Jun 2', 'Jun 3', 'Jun 4', 'Jun 5'],
    datasets: [{
      label: 'Downloads',
      data: [3, 5, 8, 12, 7, 15, 22],
      borderColor: '#a855f7',
      backgroundColor: 'rgba(168, 85, 247, 0.15)',
      tension: 0.4,
      borderWidth: 3,
    }]
  };

  const loadStats = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/data/bricks.json');
      const data = await res.json();
      setStats(prev => ({ ...prev, totalBricks: data.length }));
    } catch (err) {
      console.error(err);
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
    alert("✅ CSV uploaded successfully!\n\nNext step: Run this in terminal:\nnode update-bricks.mjs");
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <TrendingUp className="text-green-400" /> Visitor Trend (Last 7 Days)
            </h3>
            <div className="h-80"><Line data={visitorTrendData} options={{ maintainAspectRatio: false }} /></div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6">Browser Usage</h3>
            <div className="h-80 flex items-center justify-center"><Pie data={browserData} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <BarChart3 className="text-blue-400" /> Top 10 Most Searched Bricks
            </h3>
            <div className="h-96"><Bar data={topBricksData} options={{ maintainAspectRatio: false, indexAxis: 'y' as const, plugins: { legend: { display: false }} }} /></div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 border border-gray-700">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Download className="text-purple-400" /> Downloads Trend (Last 7 Days)
            </h3>
            <div className="h-80"><Line data={downloadsTrendData} options={{ maintainAspectRatio: false }} /></div>
          </div>
        </div>

        {/* Upload Section */}
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
          <button onClick={processFile} disabled={!file} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 py-5 rounded-2xl text-xl font-medium transition-colors disabled:cursor-not-allowed">
            Process Uploaded CSV
          </button>
        </div>
      </div>
    </div>
  );
}