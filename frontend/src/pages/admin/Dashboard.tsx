import React, { useEffect, useState } from 'react';
import { Users, FileText, Briefcase, FolderGit2, MessageSquare, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../lib/api';
import PageSkeleton from '../../components/PageSkeleton';

interface DashboardStats {
  services: number;
  projects: number;
  articles: number;
  testimonials: number;
  unread_messages: number;
}

interface Message {
  id: number;
  name: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface ChartItem {
  count: number;
  month: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMessages, setRecentMessages] = useState<Message[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        const { stats, recent_messages, chart_data } = response.data;
        
        setStats(stats);
        setRecentMessages(recent_messages);
        
        // Map chart data
        if (chart_data && chart_data.length > 0) {
          setChartData(chart_data.map((item: ChartItem) => ({
            name: item.month,
            Messages: item.count
          })));
        } else {
          // Fallback static chart data if no messages have been sent yet
          setChartData([
            { name: 'Jan', Messages: 1 },
            { name: 'Feb', Messages: 3 },
            { name: 'Mar', Messages: 2 },
            { name: 'Apr', Messages: 5 },
            { name: 'May', Messages: stats.unread_messages || 4 },
          ]);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  const statCards = [
    { label: 'Unread Messages', value: stats?.unread_messages ?? 0, icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-100' },
    { label: 'Total Articles', value: stats?.articles ?? 0, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { label: 'Active Services', value: stats?.services ?? 0, icon: Briefcase, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { label: 'Portfolio Projects', value: stats?.projects ?? 0, icon: FolderGit2, color: 'text-amber-600', bg: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome back, Admin!</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your website today.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/admin/blog" className="px-4 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
            Add Article
          </Link>
          <Link to="/admin/projects" className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md shadow-sm shadow-blue-100 hover:bg-blue-700 transition-colors">
            Add Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1 text-slate-800">{stat.value}</h3>
              </div>
              <div className={`p-2.5 rounded-lg ${stat.bg} ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-slate-800 text-sm">Inbound Messages Chart</h4>
            <div className="text-[11px] font-medium text-slate-400">Monthly count</div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="Messages" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h4 className="font-bold text-slate-800 text-sm">Recent Messages</h4>
            <Link to="/admin/messages" className="text-[11px] font-semibold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px]">
            {recentMessages.length === 0 ? (
              <div className="text-slate-400 text-xs text-center py-8">No contact messages received yet.</div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-slate-800">{msg.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.created_at).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-1 truncate">{msg.subject}</p>
                  <p className="text-xs text-slate-400 truncate mb-2">{msg.message}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${msg.status === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                      {msg.status}
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">Open &rarr;</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
