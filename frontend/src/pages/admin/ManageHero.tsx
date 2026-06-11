import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import CardSkeleton from '../../components/CardSkeleton';

interface Hero {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  image: string | null;
  is_active: boolean;
  order: number;
}

export default function ManageHero() {
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);

  // Form / Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    primary_button_text: 'View Services',
    primary_button_url: '#services',
    secondary_button_text: 'Contact Us',
    secondary_button_url: '#contact',
    image: '',
    is_active: true,
    order: 0,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchHeroes();
  }, []);

  const fetchHeroes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/hero');
      setHeroes(response.data);
    } catch (err) {
      console.error('Failed to fetch hero sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingHero(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      primary_button_text: 'View Services',
      primary_button_url: '#services',
      secondary_button_text: 'Contact Us',
      secondary_button_url: '#contact',
      image: '',
      is_active: true,
      order: heroes.length + 1,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (hero: Hero) => {
    setEditingHero(hero);
    setFormData({
      title: hero.title,
      subtitle: hero.subtitle || '',
      description: hero.description || '',
      primary_button_text: hero.primary_button_text || '',
      primary_button_url: hero.primary_button_url || '',
      secondary_button_text: hero.secondary_button_text || '',
      secondary_button_url: hero.secondary_button_url || '',
      image: hero.image || '',
      is_active: !!hero.is_active,
      order: hero.order || 0,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'is_active' ? value === 'true' : name === 'order' ? parseInt(value) || 0 : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingHero) {
        // Update
        const response = await api.put(`/admin/hero/${editingHero.id}`, formData);
        setHeroes((prev) =>
          prev.map((h) => (h.id === editingHero.id ? response.data : h))
        );
      } else {
        // Create
        const response = await api.post('/admin/hero', formData);
        setHeroes((prev) => [...prev, response.data]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving hero section:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Failed to save hero section. Please check your fields.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHero = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this hero section?')) {
      return;
    }

    try {
      await api.delete(`/admin/hero/${id}`);
      setHeroes((prev) => prev.filter((h) => h.id !== id));
    } catch (err) {
      console.error('Failed to delete hero section:', err);
      alert('Failed to delete hero section.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Hero Section</h1>
          <p className="text-sm text-slate-500">Configure slide headings, descriptions, CTAs, and images for the main page header.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={16} /> Add Hero Slide
        </button>
      </div>

      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
              No hero slides found. Add one to display content on the home page.
            </div>
          ) : (
            heroes.map((hero) => (
              <div
                key={hero.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Order: {hero.order}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        hero.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}
                    >
                      {hero.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-blue-600 block mb-1">{hero.subtitle}</span>
                    <h3 className="font-extrabold text-slate-900 text-lg mb-2 leading-tight">{hero.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{hero.description}</p>
                  </div>

                  {hero.image && (
                    <div className="aspect-[21/9] rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                      <img src={hero.image} alt={hero.title} className="w-full h-full object-cover" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2">
                    {hero.primary_button_text && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-bold uppercase tracking-wider rounded border border-slate-200">
                        {hero.primary_button_text}
                      </span>
                    )}
                    {hero.secondary_button_text && (
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-[9px] font-bold uppercase tracking-wider rounded border border-slate-200">
                        {hero.secondary_button_text}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditModal(hero)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    title="Edit slide"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteHero(hero.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    title="Delete slide"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Slide Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-extrabold text-slate-800 text-base">
                {editingHero ? 'Edit Hero Slide' : 'Add Hero Slide'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3 flex gap-2 text-red-700 text-xs">
                    <AlertCircle size={16} className="shrink-0" />
                    <div>{formError}</div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Headline/Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Kicker/Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      value={formData.subtitle}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                      placeholder="https://unsplash.com/..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description Paragraph</label>
                    <textarea
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      name="primary_button_text"
                      value={formData.primary_button_text}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Button URL</label>
                    <input
                      type="text"
                      name="primary_button_url"
                      value={formData.primary_button_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      name="secondary_button_text"
                      value={formData.secondary_button_text}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Secondary Button URL</label>
                    <input
                      type="text"
                      name="secondary_button_url"
                      value={formData.secondary_button_url}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Display Order</label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                    <select
                      name="is_active"
                      value={formData.is_active ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, is_active: e.target.value === 'true' }))
                      }
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive (Hidden)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-md hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-md transition-colors disabled:opacity-70 cursor-pointer"
                >
                  {isSaving ? 'Saving...' : 'Save Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
