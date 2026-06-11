import React, { useEffect, useState } from 'react';
import { Calendar, User, ArrowLeft, X, BookOpen } from 'lucide-react';
import api from '../../lib/api';
import PageSkeleton from '../../components/PageSkeleton';
import FadeIn from '../../components/FadeIn';

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  published_at: string;
  user?: {
    name: string;
  };
}

interface BlogProps {
  isSection?: boolean;
  initialData?: Article[];
}

export default function Blog({ isSection = false, initialData }: BlogProps) {
  const [articles, setArticles] = useState<Article[]>(initialData || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(!initialData);

  // Selected Article Detail Modal
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    if (initialData && currentPage === 1 && selectedCategory === 'all') {
      setArticles(initialData);
      setTotalPages(1);
      setLoading(false);
    } else {
      fetchArticles(currentPage, selectedCategory);
    }
  }, [currentPage, selectedCategory, initialData]);

  const fetchArticles = async (page: number, cat: string) => {
    setLoading(true);
    try {
      const response = await api.get('/public/articles', {
        params: {
          page,
          category: cat !== 'all' ? cat : undefined,
        },
      });
      // Handle either direct array (from homepage aggregated response) or paginated response format
      if (response.data.data) {
        setArticles(response.data.data);
        setTotalPages(response.data.last_page);
      } else {
        setArticles(response.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenArticle = async (slug: string) => {
    setLoadingDetail(true);
    try {
      const response = await api.get(`/public/articles/${slug}`);
      setActiveArticle(response.data);
    } catch (err) {
      console.error('Error fetching article detail:', err);
      alert('Failed to load article details.');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
  };

  const categories = ['all', 'Insights', 'Finance', 'Marketing', 'Security', 'Technology', 'AI'];

  return (
    <div className={`bg-white ${isSection ? 'py-12' : 'pb-24'}`}>
      {/* Page Header */}
      {!isSection && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4 block">
              Our Insights
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Blog & Articles</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Latest trends, strategy guides, and insights curated by our experienced business advisors.
            </p>
          </div>
        </div>
      )}

      {isSection && (
        <FadeIn direction="up">
          <div className="text-center mb-10 pt-8">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 block">
              Our Insights
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Blog & Articles</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Latest trends, strategy guides, and insights curated by our experienced business advisors.
            </p>
          </div>
        </FadeIn>
      )}

      {/* Category selector */}
      <FadeIn direction="up" delay={50}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center flex-wrap gap-2 border-b border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading Articles...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.length === 0 ? (
                <div className="col-span-full py-16 text-center text-slate-400">No articles found.</div>
              ) : (
                articles.map((art, index) => (
                  <FadeIn key={art.id} direction="up" delay={index * 50}>
                    <div 
                      onClick={() => handleOpenArticle(art.slug)}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between h-full"
                    >
                      <div>
                        <div className="aspect-video bg-slate-50 relative overflow-hidden">
                          {art.thumbnail ? (
                            <img src={art.thumbnail} alt={art.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300"><BookOpen size={48} /></div>
                          )}
                          <span className="absolute top-4 left-4 bg-white px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest text-slate-800 border border-slate-100">
                            {art.category}
                          </span>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex gap-4 items-center text-[10px] font-bold text-slate-400 mb-3">
                            <span className="flex items-center gap-1"><User size={12} /> {art.user?.name || 'Admin'}</span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} /> 
                              {art.published_at ? new Date(art.published_at).toLocaleDateString() : 'Draft'}
                            </span>
                          </div>
                          <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                            {art.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{art.excerpt}</p>
                        </div>
                      </div>
                      
                      <div className="px-6 pb-6 pt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 tracking-wide uppercase">
                          Read Full Article &rarr;
                        </span>
                      </div>
                    </div>
                  </FadeIn>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-md hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-xs text-slate-500 font-medium">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold rounded-md hover:bg-slate-50 disabled:opacity-50 cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-150 flex justify-between items-center bg-slate-50">
              <button 
                onClick={handleCloseArticle} 
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <ArrowLeft size={16} /> Back to Blog
              </button>
              <button onClick={handleCloseArticle} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              <div className="aspect-[21/9] bg-slate-100 rounded-xl overflow-hidden shadow-sm">
                {activeArticle.thumbnail && (
                  <img src={activeArticle.thumbnail} alt={activeArticle.title} className="w-full h-full object-cover" />
                )}
              </div>
              
              <div>
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-[10px] font-bold uppercase tracking-wider">
                  {activeArticle.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-3 mb-4 leading-tight">{activeArticle.title}</h2>
                <div className="flex gap-4 items-center text-xs text-slate-400 font-semibold border-b border-slate-100 pb-4">
                  <span className="flex items-center gap-1"><User size={14} /> {activeArticle.user?.name || 'Admin'}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> 
                    {activeArticle.published_at ? new Date(activeArticle.published_at).toLocaleDateString() : 'Draft'}
                  </span>
                </div>
              </div>

              <p className="text-sm font-semibold text-slate-600 leading-relaxed italic bg-slate-50 p-4 border-l-4 border-blue-600 rounded">
                {activeArticle.excerpt}
              </p>

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap space-y-4 font-sans">
                {activeArticle.content}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

