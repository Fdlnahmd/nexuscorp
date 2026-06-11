import React, { useEffect, useState } from 'react';
import { Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';
import PageSkeleton from '../../components/PageSkeleton';

export default function Settings() {
  const [settings, setSettings] = useState<any>({
    site_name: '',
    site_description: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    facebook_url: '',
    instagram_url: '',
    linkedin_url: '',
    twitter_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/admin/settings');
        // Map settings array to state object
        const settingsObj: any = {};
        response.data.forEach((item: any) => {
          settingsObj[item.key] = item.value || '';
        });
        setSettings((prev: any) => ({
          ...prev,
          ...settingsObj
        }));
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await api.put('/admin/settings', { settings });
      setSuccess('Settings updated successfully!');
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setError('Failed to update settings. Please check database permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Website Settings</h2>
        <p className="text-slate-500 mt-1">Configure global parameters and contact info for the public website.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex gap-3 text-red-700 text-xs">
          <AlertCircle size={20} className="shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 flex gap-3 text-emerald-700 text-xs">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
          <div>{success}</div>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* General Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">General Settings</h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Site / Company Name</label>
                <input
                  type="text"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Site Description / Tagline</label>
                <textarea
                  name="site_description"
                  rows={3}
                  value={settings.site_description}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  name="company_email"
                  value={settings.company_email}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  name="company_phone"
                  value={settings.company_phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Physical Address</label>
                <input
                  type="text"
                  name="company_address"
                  value={settings.company_address}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Facebook URL</label>
                <input
                  type="text"
                  name="facebook_url"
                  value={settings.facebook_url}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Instagram URL</label>
                <input
                  type="text"
                  name="instagram_url"
                  value={settings.instagram_url}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">LinkedIn URL</label>
                <input
                  type="text"
                  name="linkedin_url"
                  value={settings.linkedin_url}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Twitter URL</label>
                <input
                  type="text"
                  name="twitter_url"
                  value={settings.twitter_url}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-250 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
