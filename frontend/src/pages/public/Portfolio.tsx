import React, { useEffect, useState } from 'react';
import { ExternalLink, Layers } from 'lucide-react';
import api from '../../lib/api';
import PageSkeleton from '../../components/PageSkeleton';
import FadeIn from '../../components/FadeIn';
import { getOptimizedImageUrl } from '../../lib/utils';

interface Project {
  id: number;
  title: string;
  category: string;
  client_name: string;
  short_description: string;
  description: string;
  image: string;
  project_url: string | null;
}

interface PortfolioProps {
  isSection?: boolean;
  initialData?: Project[];
}

export default function Portfolio({ isSection = false, initialData }: PortfolioProps) {
  const [projects, setProjects] = useState<Project[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    if (initialData) return;
    const fetchProjects = async () => {
      try {
        const response = await api.get('/public/projects');
        setProjects(response.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [initialData]);

  if (loading) {
    return isSection ? (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading Portfolio...</div>
    ) : (
      <PageSkeleton />
    );
  }

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className={`bg-white ${isSection ? 'py-12' : 'pb-24'}`}>
      {/* Page Header */}
      {!isSection && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4 block">
              Our Work
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Portfolio</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Discover our success stories and how we've helped industry leaders execute their digital growth roadmaps.
            </p>
          </div>
        </div>
      )}

      {isSection && (
        <FadeIn direction="up">
          <div className="text-center mb-10 pt-8">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 block">
              Portfolio
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Our Work</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Discover our success stories and how we've helped industry leaders execute their digital growth roadmaps.
            </p>
          </div>
        </FadeIn>
      )}

      {/* Categories filter */}
      <FadeIn direction="up" delay={100}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all border cursor-pointer ${
                activeCategory === cat 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length === 0 ? (
            <div className="col-span-full py-16 text-center text-slate-400">No projects found.</div>
          ) : (
            filteredProjects.map((project, index) => (
              <FadeIn key={project.id} direction="up" delay={index * 50} className="h-full">
                <div className="flex flex-col justify-between h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div>
                    <div className="aspect-video bg-slate-50 relative overflow-hidden border-b border-slate-100">
                      {project.image ? (
                        <img src={getOptimizedImageUrl(project.image, 400)} alt={project.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Layers size={48} /></div>
                      )}
                      <span className="absolute top-4 left-4 bg-white px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-slate-800 shadow-sm border border-slate-100">
                        {project.category}
                      </span>
                    </div>
                    
                    <div className="p-6">
                      {project.client_name && (
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block mb-1">
                          Client: {project.client_name}
                        </span>
                      )}
                      <h3 className="font-bold text-slate-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                      <p className="text-xs text-slate-500 mb-4">{project.short_description}</p>
                      <p className="text-xs text-slate-400 leading-relaxed">{project.description}</p>
                    </div>
                  </div>

                  {project.project_url && (
                    <div className="px-6 pb-6 pt-2">
                      <a 
                        href={project.project_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 tracking-wide uppercase"
                      >
                        Visit Website <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </div>
              </FadeIn>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
