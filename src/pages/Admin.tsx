import { useState } from 'react';
import { 
  Users, Package, BarChart3, Settings, 
  Bell, Menu, X, LogOut, Home 
} from 'lucide-react';

export default function AdminPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bricks', label: 'Brick Finder', icon: Package },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 border-r border-gray-800 transition-all duration-300 flex flex-col`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded-2xl flex items-center justify-center font-bold text-lg">SJ</div>
            {sidebarOpen && <h1 className="text-2xl font-bold tracking-tight">SJ Memorial</h1>}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 transition-all
                  ${activeTab === item.id 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'hover:bg-gray-800 text-gray-400 hover:text-white'}`}
              >
                <Icon size={22} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800 mt-auto">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 rounded-2xl transition-colors">
            <LogOut size={22} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-gray-800 bg-gray-900 px-8 flex items-center justify-between">
          <h2 className="text-2xl font-semibold capitalize">{activeTab}</h2>
          
          <div className="flex items-center gap-6">
            <button className="relative p-3 hover:bg-gray-800 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-900"></span>
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium">Tom McAndrews</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center font-bold">TM</div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          {activeTab === 'dashboard' && (
            <div>
              <h3 className="text-4xl font-bold mb-2">Welcome back, Tom 👋</h3>
              <p className="text-gray-400 mb-10">Here's what's happening with the Brick Finder today.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                  <p className="text-gray-400">Bricks Sold</p>
                  <p className="text-5xl font-bold mt-3">248</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                  <p className="text-gray-400">Revenue</p>
                  <p className="text-5xl font-bold mt-3">$12.4k</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                  <p className="text-gray-400">Pending Orders</p>
                  <p className="text-5xl font-bold mt-3 text-yellow-400">7</p>
                </div>
                <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800">
                  <p className="text-gray-400">Total Bricks</p>
                  <p className="text-5xl font-bold mt-3">1,247</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bricks' && <div className="text-3xl font-medium">🧱 Brick Finder Management — Coming Soon</div>}
          {activeTab === 'users' && <div className="text-3xl font-medium">👥 Users & Orders — Coming Soon</div>}
          {activeTab === 'analytics' && <div className="text-3xl font-medium">📊 Analytics — Coming Soon</div>}
          {activeTab === 'settings' && <div className="text-3xl font-medium">⚙️ Settings — Coming Soon</div>}
        </main>
      </div>
    </div>
  );
}