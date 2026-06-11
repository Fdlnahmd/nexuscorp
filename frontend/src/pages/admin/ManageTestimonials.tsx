import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Star } from 'lucide-react';
import api from '../../lib/api';
import CardSkeleton from '../../components/CardSkeleton';

interface Testimonial {
  id: number;
  client_name: string;
  client_company: string;
  client_position: string;
  rating: number;
  content: string;
  photo: string | null;
  is_active: boolean;
}

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form / Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    client_name: '',
    client_company: '',
    client_position: '',
    rating: 5,
    content: '',
    photo: '',
    is_active: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/testimonials');
      setTestimonials(response.data);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingTestimonial(null);
    setFormData({
      client_name: '',
      client_company: '',
      client_position: '',
      rating: 5,
      content: '',
      photo: '',
      is_active: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (t: Testimonial) => {
    setEditingTestimonial(t);
    setFormData({
      client_name: t.client_name,
      client_company: t.client_company || '',
      client_position: t.client_position || '',
      rating: t.rating || 5,
      content: t.content || '',
      photo: t.photo || '',
      is_active: !!t.is_active,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) || 5 : name === 'is_active' ? value === 'true' : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingTestimonial) {
        // Update
        const response = await api.put(`/admin/testimonials/${editingTestimonial.id}`, formData);
        setTestimonials((prev) =>
          prev.map((t) => (t.id === editingTestimonial.id ? response.data : t))
        );
      } else {
        // Create
        const response = await api.post('/admin/testimonials', formData);
        setTestimonials((prev) => [response.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving testimonial:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Failed to save testimonial. Please check your fields.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    try {
      await api.delete(`/admin/testimonials/${id}`);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      alert('Failed to delete testimonial.');
    }
  };

  // Filter items
  const filteredTestimonials = testimonials.filter((t) => {
    return (
      t.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.client_company && t.client_company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.content && t.content.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Testimonials</h1>
          <p className="text-sm text-slate-500">View and manage customer reviews, ratings, and success stories.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none text-slate-400">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Search testimonials by client name, company, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-250 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
        />
      </div>

      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.length === 0 ? (
            <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
              No testimonials found.
            </div>
          ) : (
            filteredTestimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-0.5 text-yellow-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-current" />
                      ))}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        t.is_active
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}
                    >
                      {t.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed mb-6">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                  <div className="flex items-center gap-3">
                    {t.photo ? (
                      <img src={t.photo} alt={t.client_name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold uppercase">
                        {t.client_name.substring(0, 2)}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{t.client_name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider leading-none mt-1">
                        {t.client_company} {t.client_position ? `- ${t.client_position}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(t)}
                      className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded border border-transparent transition-all cursor-pointer"
                      title="Edit testimonial"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded border border-transparent transition-all cursor-pointer"
                      title="Delete testimonial"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-extrabold text-slate-800 text-base">
                {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
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
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Client Name</label>
                    <input
                      type="text"
                      name="client_name"
                      required
                      value={formData.client_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Client Company</label>
                    <input
                      type="text"
                      name="client_company"
                      value={formData.client_company}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Client Position</label>
                    <input
                      type="text"
                      name="client_position"
                      value={formData.client_position}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Avatar Photo URL</label>
                    <input
                      type="text"
                      name="photo"
                      value={formData.photo}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                      placeholder="https://unsplash.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Rating (1 to 5 Stars)</label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Testimonial Content</label>
                    <textarea
                      name="content"
                      rows={4}
                      required
                      value={formData.content}
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
                      <option value="true">Active (Visible)</option>
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
                  {isSaving ? 'Saving...' : 'Save Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
