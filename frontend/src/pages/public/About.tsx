import React, { useEffect, useState } from 'react';
import { Mail, Linkedin, Twitter, Award, Clock, Users, ShieldCheck } from 'lucide-react';
import api from '../../lib/api';
import PageSkeleton from '../../components/PageSkeleton';
import FadeIn from '../../components/FadeIn';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  bio: string;
  photo: string | null;
  linkedin: string | null;
  twitter: string | null;
  email: string | null;
}

interface AboutProps {
  isSection?: boolean;
  initialData?: TeamMember[];
}

export default function About({ isSection = false, initialData }: AboutProps) {
  const [team, setTeam] = useState<TeamMember[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    const fetchTeam = async () => {
      try {
        const response = await api.get('/public/team');
        setTeam(response.data);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [initialData]);

  if (loading) {
    return isSection ? (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-slate-400">Loading About...</div>
    ) : (
      <PageSkeleton />
    );
  }

  return (
    <div className={`bg-white ${isSection ? 'py-12' : 'pb-24'}`}>
      {/* Page Header */}
      {!isSection && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4 block">
              Who We Are
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">About Us</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              A team of strategic advisors, creative designers, and tech innovators working together to scale your operations.
            </p>
          </div>
        </div>
      )}

      {/* Vision & Mission */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <FadeIn direction="up">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 block">
                Vision & Mission
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">Our Core Strategy</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Our vision is to become the leading global partner for digital and strategic transformation, enabling enterprises to transition into highly efficient, tech-driven ecosystems.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our mission is to engineer high-grade, scalable solutions that solve real business problems, reduce manual bottlenecks, and maximize sustainable profit margins for our clients.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <Award size={32} className="text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">High Quality</h4>
                <p className="text-xs text-slate-500">Premium industry standards in all projects.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <Clock size={32} className="text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">On-Time Delivery</h4>
                <p className="text-xs text-slate-500">Structured execution with zero downtime.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <Users size={32} className="text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">Expert Team</h4>
                <p className="text-xs text-slate-500">Highly qualified professional consultants.</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <ShieldCheck size={32} className="text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-800 mb-1">Secure Data</h4>
                <p className="text-xs text-slate-500">HIPAA compliant systems and security protocols.</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-100">
        <FadeIn direction="up">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 block">
              Leadership
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Our Advisory Team</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">Meet the minds driving innovation and client satisfaction at NexusCorp.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <FadeIn key={member.id} direction="up" delay={index * 100}>
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col group hover:shadow-md transition-shadow">
                <div className="aspect-[4/5] bg-slate-100 relative flex items-center justify-center text-slate-300">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <Users size={64} />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">{member.name}</h3>
                    <p className="text-xs font-semibold text-blue-600 mb-3">{member.position}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{member.bio}</p>
                  </div>
                  <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100 text-slate-400">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="hover:text-blue-600 transition-colors">
                        <Mail size={16} />
                      </a>
                    )}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                        <Linkedin size={16} />
                      </a>
                    )}
                    {member.twitter && (
                      <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                        <Twitter size={16} />
                      </a>
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
