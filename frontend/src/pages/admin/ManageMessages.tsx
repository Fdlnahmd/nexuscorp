import React, { useEffect, useState } from 'react';
import { Mail, Trash2, Eye, EyeOff, AlertCircle, X } from 'lucide-react';
import api from '../../lib/api';
import CardSkeleton from '../../components/CardSkeleton';

interface Message {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function ManageMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/messages');
      const payload = response.data;
      setMessages(Array.isArray(payload) ? payload : payload.data ?? []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg: Message) => {
    setActiveMessage(msg);
    if (msg.status === 'unread') {
      try {
        await api.put(`/admin/messages/${msg.id}/status`, { status: 'read' });
        // Update local list
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
      } catch (err) {
        console.error('Failed to update message status:', err);
      }
    }
  };

  const handleDeleteMessage = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await api.delete(`/admin/messages/${id}`);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
      alert('Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Inbound Messages</h2>
        <p className="text-slate-500 mt-1">Review contact inquiries submitted by website visitors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-250 bg-slate-50 font-bold text-xs text-slate-500 uppercase tracking-wider">
            All Messages
          </div>
          {loading ? (
            <div className="p-6"><CardSkeleton count={3} /></div>
          ) : messages.length === 0 ? (
            <div className="p-16 text-center text-slate-400 text-sm">No messages received yet.</div>
          ) : (
            <div className="divide-y divide-slate-150 max-h-[600px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`p-5 hover:bg-slate-50/70 transition-colors cursor-pointer flex justify-between items-start gap-4 ${
                    msg.status === 'unread' ? 'bg-blue-50/20 font-medium border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-800 text-sm">{msg.name}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 font-semibold mb-1 truncate">{msg.subject}</p>
                    <p className="text-xs text-slate-500 truncate leading-relaxed">{msg.message}</p>
                  </div>
                  <button
                    onClick={(e) => handleDeleteMessage(msg.id, e)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0 cursor-pointer"
                    title="Delete Message"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Viewer Details */}
        <div className="lg:col-span-1">
          {activeMessage ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between h-full min-h-[300px]">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start border-b border-slate-150 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{activeMessage.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{activeMessage.email}</p>
                    {activeMessage.phone && <p className="text-xs text-slate-400">{activeMessage.phone}</p>}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    activeMessage.status === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {activeMessage.status}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Subject</span>
                  <p className="text-sm font-bold text-slate-800">{activeMessage.subject}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Message</span>
                  <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 border border-slate-200 rounded-lg whitespace-pre-wrap font-sans">
                    {activeMessage.message}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-2">
                <button
                  onClick={() => setActiveMessage(null)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-xs flex flex-col items-center justify-center h-full min-h-[300px]">
              <Mail size={32} className="mb-2 text-slate-350" />
              <span>Select a message from the list to view its full details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
