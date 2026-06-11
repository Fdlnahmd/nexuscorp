import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, AlertCircle, Calendar, User } from 'lucide-react';
import api from '../../lib/api';
import CardSkeleton from '../../components/CardSkeleton';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  status: 'draft' | 'published';
  published_at: string | null;
  user?: {
    name: string;
  };
}

export default function ManageBlog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form / Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Insights',
    excerpt: '',
    content: '',
    thumbnail: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchArticles(currentPage, searchTerm);
  }, [currentPage]);

  const fetchArticles = async (page: number, search: string) => {
    setLoading(true);
    try {
      const response = await api.get('/admin/articles', {
        params: {
          page,
          search: search || undefined,
        },
      });
      setArticles(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticles(1, searchTerm);
  };

  const handleOpenAddModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      category: 'Insights',
      excerpt: '',
      content: '',
      thumbnail: '',
      status: 'draft',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      category: article.category || 'Insights',
      excerpt: article.excerpt || '',
      content: article.content || '',
      thumbnail: article.thumbnail || '',
      status: article.status || 'draft',
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
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    try {
      if (editingArticle) {
        // Update
        const response = await api.put(`/admin/articles/${editingArticle.id}`, formData);
        setArticles((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? response.data : a))
        );
      } else {
        // Create
        const response = await api.post('/admin/articles', formData);
        setArticles((prev) => [response.data, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error saving article:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Failed to save article. Please check your fields.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await api.delete(`/admin/articles/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Failed to delete article:', err);
      alert('Failed to delete article.');
    }
  };

  const categories = ['Insights', 'Finance', 'Marketing', 'Security', 'Technology', 'AI'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage Blog & Articles</h1>
          <p className="text-sm text-slate-500">Publish and manage news updates, corporate insights, and strategy articles.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} /> Write Article
        </button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search articles by title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-250 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-md cursor-pointer transition-colors"
        >
          Search
        </button>
      </form>

      {loading ? (
        <CardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.length === 0 ? (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400">
                No articles found. Write your first post now!
              </div>
            ) : (
              articles.map((art) => (
                <div
                  key={art.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between h-full"
                >
                  <div>
                    {art.thumbnail && (
                      <div className="aspect-video bg-slate-50 relative overflow-hidden border-b border-slate-100">
                        <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover" />
                        <span className="absolute top-4 left-4 bg-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-slate-800 border border-slate-100 shadow-sm">
                          {art.category}
                        </span>
                      </div>
                    )}

                    <div className="p-6 space-y-3">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                        <span className="flex items-center gap-1">
                          <User size={12} /> {art.user?.name || 'Admin'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}
                        >
                          {art.status}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-slate-900 text-base leading-tight line-clamp-2">
                        {art.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center mt-auto">
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar size={12} />
                      {art.published_at ? new Date(art.published_at).toLocaleDateString() : 'Draft'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(art)}
                        className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                        title="Edit article"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(art.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-md hover:bg-slate-50 disabled:opacity-50 cursor-pointer bg-white"
              >
                Previous
              </button>
              <span className="text-xs text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-md hover:bg-slate-50 disabled:opacity-50 cursor-pointer bg-white"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Slide Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h2 className="font-extrabold text-slate-800 text-base">
                {editingArticle ? 'Edit Article' : 'Write New Article'}
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
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Title</label>
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
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Thumbnail Image URL</label>
                    <input
                      type="text"
                      name="thumbnail"
                      value={formData.thumbnail}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                      placeholder="https://unsplash.com/..."
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Excerpt (Short Summary)</label>
                    <input
                      type="text"
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Article Content</label>
                    <textarea
                      name="content"
                      rows={10}
                      required
                      value={formData.content}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
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
                  {isSaving ? 'Saving...' : 'Save Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
