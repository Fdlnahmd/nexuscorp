import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Briefcase, Monitor, TrendingUp, Target, Shield, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../lib/api';
import PageSkeleton from '../../components/PageSkeleton';
import FadeIn from '../../components/FadeIn';

interface Service {
  id: number;
  title: string;
  short_description: string;
  description: string;
  icon: string;
  is_active: boolean;
}

interface ServicesProps {
  isSection?: boolean;
  initialData?: Service[];
}

export default function Services({ isSection = false, initialData }: ServicesProps) {
  const [services, setServices] = useState<Service[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchServices = async () => {
      try {
        const response = await api.get('/public/services');
        setServices(response.data);
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [initialData]);

  if (loading) {
    return isSection ? (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading Services...</div>
    ) : (
      <PageSkeleton />
    );
  }

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase size={28} />;
      case 'Monitor': return <Monitor size={28} />;
      case 'TrendingUp': return <TrendingUp size={28} />;
      case 'Target': return <Target size={28} />;
      case 'Shield': return <Shield size={28} />;
      case 'Cloud': return <Cloud size={28} />;
      default: return <Briefcase size={28} />;
    }
  };

  return (
    <div className={`bg-white ${isSection ? 'py-12' : 'pb-24'}`}>
      {/* Page Header */}
      {!isSection && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4 block">
              What We Do
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Our Services</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Comprehensive solutions tailored to drive growth, efficiency, and innovation across your organization.
            </p>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {isSection && (
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 block">
                Services
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">What We Do</h2>
              <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
                Comprehensive solutions tailored to drive growth, efficiency, and innovation across your organization.
              </p>
            </div>
          </FadeIn>
        )}

        <div className="grid gap-16">
          {services.map((service, index) => (
            <FadeIn key={service.id} direction={index % 2 === 0 ? 'left' : 'right'}>
              <div className={`flex flex-col lg:flex-row gap-12 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full relative">
                  <div className="aspect-[4/3] bg-slate-50 rounded-2xl border-8 border-white shadow-xl overflow-hidden relative group flex items-center justify-center">
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600 font-bold text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {renderIcon(service.icon)}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                  <p className="text-[15px] text-slate-500 leading-relaxed">
                    {service.description || service.short_description}
                  </p>
                  <ul className="space-y-3 pt-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-slate-700">Customized implementation strategy tailored to your needs.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-slate-700">Ongoing consulting, reporting, and dashboard analytics.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="text-blue-500 shrink-0 mt-0.5" size={20} />
                      <span className="text-slate-700">Dedicated engineer support with industry-grade performance metrics.</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    {isSection ? (
                      <a href="#contact" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm tracking-wide uppercase hover:text-blue-700">
                        Discuss this service <ArrowRight size={16} />
                      </a>
                    ) : (
                      <Link to="/contact" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm tracking-wide uppercase hover:text-blue-700">
                        Discuss this service <ArrowRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
