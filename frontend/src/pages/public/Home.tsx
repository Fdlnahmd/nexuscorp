import React, { useEffect, useState } from 'react';
import api from '../../lib/api';
import PageSkeleton from '../../components/PageSkeleton';
import FadeIn from '../../components/FadeIn';
import { getOptimizedImageUrl } from '../../lib/utils';

// Import Section Components
import About from './About';
import Services from './Services';
import Portfolio from './Portfolio';
import Blog from './Blog';
import Contact from './Contact';

interface Hero {
  title: string;
  subtitle: string;
  description: string;
  primary_button_text: string;
  primary_button_url: string;
  secondary_button_text: string;
  secondary_button_url: string;
  image: string | null;
}

interface Testimonial {
  id: number;
  client_name: string;
  client_company: string;
  client_position: string;
  rating: number;
  content: string;
  photo: string | null;
}

interface HomepageData {
  hero: Hero | null;
  testimonials: Testimonial[];
  services: any[];
  projects: any[];
  team: any[];
  articles: any[];
}

const stats = [
  { value: '99%', label: 'Client Satisfaction' },
  { value: '150+', label: 'Projects Completed' },
  { value: '25+', label: 'Expert Advisors' },
  { value: '10+', label: 'Years Experience' }
];

export default function Home() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const response = await api.get('/public/homepage');
        setData(response.data);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  if (loading || !data) {
    return <PageSkeleton />;
  }

  const { hero, testimonials, services, projects, team, articles } = data;

  return (
    <div className="space-y-0 overflow-hidden">
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-white to-blue-50/30 py-20 lg:py-32 overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="max-w-xl flex-1">
            <FadeIn direction="left">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4 block">
                {hero?.subtitle || 'Leading Innovation'}
              </span>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                {hero?.title || 'Transforming Ideas into Digital Realities'}
              </h1>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                {hero?.description || 'We help modern businesses scale with enterprise-grade solutions and creative marketing strategies.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="bg-blue-600 text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-blue-700 hover:shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  {hero?.primary_button_text || 'View Services'}
                </a>
                <a
                  href="#contact"
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-3 rounded-full text-sm font-bold hover:bg-slate-50 transition-colors text-center cursor-pointer"
                >
                  {hero?.secondary_button_text || 'Contact Us'}
                </a>
              </div>
            </FadeIn>
          </div>
          <div className="flex-1 hidden md:flex justify-end">
            <FadeIn direction="right">
              <div className="aspect-square bg-slate-100 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden flex items-center justify-center text-slate-200 w-full max-w-md">
                {hero?.image ? (
                  <img src={getOptimizedImageUrl(hero.image, 600)} alt="Hero" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-32 h-32 text-slate-200" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                  </svg>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeIn key={index} direction="up" delay={index * 100}>
                <div className="text-center px-4 flex flex-col items-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-1">{stat.value}</div>
                  <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative scroll-mt-20">
        <About isSection={true} initialData={team} />
      </section>

      {/* Services Section */}
      <section id="services" className="relative scroll-mt-20 bg-slate-50/50">
        <Services isSection={true} initialData={services} />
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative scroll-mt-20">
        <Portfolio isSection={true} initialData={projects} />
      </section>

      {/* Blog Section */}
      <section id="blog" className="relative scroll-mt-20 bg-slate-50/50">
        <Blog isSection={true} initialData={articles} />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white border-t border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-12 tracking-tight">Client Success Stories</h2>
          </FadeIn>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((t, index) => (
              <FadeIn key={t.id} direction="up" delay={index * 100}>
                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 relative h-full flex flex-col justify-between">
                  <div>
                    <div className="text-yellow-400 mb-6 flex gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">"{t.content}"</p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 mt-4">
                    {t.photo ? (
                      <img src={getOptimizedImageUrl(t.photo, 80)} alt={t.client_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                        {t.client_name.substring(0, 2)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{t.client_name}</div>
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {t.client_company} - {t.client_position}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative scroll-mt-20">
        <Contact isSection={true} />
      </section>
    </div>
  );
}
