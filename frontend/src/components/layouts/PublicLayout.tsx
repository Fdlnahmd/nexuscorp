import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Building, ChevronRight } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/#home', hash: 'home' },
    { label: 'About', path: '/#about', hash: 'about' },
    { label: 'Services', path: '/#services', hash: 'services' },
    { label: 'Portfolio', path: '/#portfolio', hash: 'portfolio' },
    { label: 'Blog', path: '/#blog', hash: 'blog' },
    { label: 'Contact', path: '/#contact', hash: 'contact' },
  ];

  // Scroll Spy logic to highlight active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      // If we are not on the home page, active section does not apply
      if (location.pathname !== '/') return;

      const scrollPosition = window.scrollY + 160; // offset for header height and padding
      const sections = ['home', 'about', 'services', 'portfolio', 'blog', 'contact'];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Handle smooth scroll when navigating to hashes
  useEffect(() => {
    const hash = location.hash || window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Remove hash from the URL so the address bar stays clean
          window.history.replaceState(null, '', window.location.pathname);
        }, 100);
      }
    }
  }, [location.hash, location.pathname]);

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL to remove hash path
        window.history.replaceState(null, '', '/');
        setActiveSection(hash);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <a 
              href="/#home" 
              onClick={(e) => handleNavLinkClick(e, 'home')}
              className="flex items-center gap-3 group"
            >
              <img src="/logo.png?v=2" alt="NexusCorp Logo" className="w-10 h-10 object-contain group-hover:scale-105 transition-transform" />
              <span className="font-bold text-xl tracking-tight text-slate-900">Nexus<span className="text-blue-600">Corp</span></span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.hash}
                  href={link.path}
                  onClick={(e) => handleNavLinkClick(e, link.hash)}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-blue-600",
                    location.pathname === '/' && activeSection === link.hash 
                      ? "text-blue-600 font-semibold" 
                      : "text-slate-600"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <a 
                href="/#contact" 
                onClick={(e) => handleNavLinkClick(e, 'contact')}
                className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold text-xs hover:bg-blue-700 transition-all shadow-sm"
              >
                Get Started
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white absolute w-full shadow-lg">
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.hash}
                  href={link.path}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavLinkClick(e, link.hash);
                  }}
                  className={cn(
                    "block px-3 py-3 rounded-md text-base font-medium",
                    location.pathname === '/' && activeSection === link.hash
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <a 
                  href="/#contact" 
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    handleNavLinkClick(e, 'contact');
                  }} 
                  className="w-full text-center bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </a>
              </div>
            </div>
          </div>
        )}
      </header>


      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white text-slate-500 py-12 md:py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4 group">
                <img src="/logo.png?v=2" alt="NexusCorp Logo" className="w-8 h-8 object-contain group-hover:scale-105 transition-transform" />
                <span className="font-bold text-xl tracking-tight text-slate-800">Nexus<span className="text-blue-600">Corp</span></span>
              </Link>
              <p className="text-sm leading-relaxed mb-6">
                Empowering businesses with strategic insights, digital transformation, and sustainable growth solutions.
              </p>
            </div>
            
            <div>
              <h4 className="text-slate-800 font-bold mb-4 border-b border-slate-100 pb-2 inline-block">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'About Us', 'Our Services', 'Portfolio', 'Contact'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-1 group">
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-slate-800 font-bold mb-4 border-b border-slate-100 pb-2 inline-block">Services</h4>
              <ul className="space-y-3">
                {['Strategic Consulting', 'Digital Transformation', 'Financial Advisory', 'Marketing Solutions'].map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm hover:text-blue-600 transition-colors flex items-center gap-1 group">
                      <ChevronRight size={14} className="text-slate-400 group-hover:text-blue-600" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-slate-800 font-bold mb-4 border-b border-slate-100 pb-2 inline-block">Contact</h4>
              <ul className="space-y-3 text-sm">
                <li>123 Business Avenue, Suite 400</li>
                <li>New York, NY 10001</li>
                <li className="pt-2">hello@nexuscorp.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} NexusCorp. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
