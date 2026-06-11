import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Building, 
  LayoutDashboard, 
  Image as ImageIcon, 
  Briefcase, 
  FolderGit2, 
  FileText, 
  MessageSquare, 
  Inbox, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import api from '../../lib/api';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('admin_token');
  const userString = localStorage.getItem('admin_user');
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      navigate('/admin/login', { replace: true });
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hero Section', path: '/admin/hero', icon: ImageIcon },
    { label: 'Services', path: '/admin/services', icon: Briefcase },
    { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { label: 'Blog & Articles', path: '/admin/blog', icon: FileText },
    { label: 'Testimonials', path: '/admin/testimonials', icon: MessageSquare },
    { label: 'Inbox Messages', path: '/admin/messages', icon: Inbox },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // If there's no token, don't render layout components to prevent flashing content
  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out flex flex-col",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Building size={16} />
            </div>
            <span className="font-bold text-lg text-slate-800">Nexus<span className="text-blue-600">Admin</span></span>
          </Link>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">CMS Management</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
               <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <Icon size={18} className={isActive ? "text-blue-600" : "text-slate-400"} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg mb-2">
            <div className="w-8 h-8 rounded-full bg-slate-350 flex items-center justify-center text-white text-xs font-bold uppercase">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate text-slate-800">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@demo.com'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-slate-500 hover:text-slate-700 focus:outline-none mr-2"
            >
              <Menu size={20} />
            </button>
            <span className="text-slate-400 hidden sm:inline">CMS Dashboard</span>
            <span className="text-slate-300 hidden sm:inline">/</span>
            <span className="font-medium text-slate-700">
              {navItems.find(item => item.path === location.pathname)?.label || 'Overview'}
            </span>
          </div>
          
          <div className="flex gap-3">
             <Link to="/" className="px-4 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
               Visit Website
             </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
