import React, { useState, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../lib/api';
import FadeIn from '../../components/FadeIn';

interface ContactProps {
  isSection?: boolean;
}

export default function Contact({ isSection = false }: ContactProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await api.post('/public/contact', formData);
      setSuccessMsg(response.data.message || 'Thank you! Your message has been sent successfully.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      console.error('Failed to submit message:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.errors) {
        const errorMsg = Object.values(err.response.data.errors).flat().join(' ');
        setError(errorMsg);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-white ${isSection ? 'py-12' : 'pb-24'}`}>
      {/* Page Header */}
      {!isSection && (
        <div className="bg-gradient-to-br from-white to-blue-50/30 py-20 lg:py-24 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-4 block">
              Get In Touch
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Contact Us</h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Have a project in mind or need advisory consulting? Drop us a message, and our advisors will respond within 24 hours.
            </p>
          </div>
        </div>
      )}

      {isSection && (
        <FadeIn direction="up">
          <div className="text-center mb-10 pt-8">
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] mb-3 block">
              Get In Touch
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Contact Us</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Have a project in mind or need advisory consulting? Drop us a message, and our advisors will respond within 24 hours.
            </p>
          </div>
        </FadeIn>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <FadeIn direction="left" className="h-full">
            <div className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Our Office</h2>
                <p className="text-xs text-slate-500 mb-6">Stop by or call us anytime.</p>
                
                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Address</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        123 Business Avenue, Suite 400<br />New York, NY 10001
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Email</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        hello@nexuscorp.com
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Phone</h4>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        +1 (555) 123-4567
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <FadeIn direction="right">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Send Us a Message</h2>

                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex gap-3 text-red-700 text-xs">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>{error}</div>
                  </div>
                )}

                {successMsg && (
                  <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-md p-4 flex gap-3 text-emerald-700 text-xs">
                    <CheckCircle2 size={20} className="shrink-0 text-emerald-600" />
                    <div>{successMsg}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number (Optional)</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Message</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-sm"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-75"
                    >
                      {isLoading ? 'Sending...' : 'Send Message'} <Send size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

