import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
import PageSkeleton from './components/PageSkeleton';

// Lazy load all public pages
const Home = lazy(() => import('./pages/public/Home'));
const Services = lazy(() => import('./pages/public/Services'));
const About = lazy(() => import('./pages/public/About'));
const Portfolio = lazy(() => import('./pages/public/Portfolio'));
const Blog = lazy(() => import('./pages/public/Blog'));
const Contact = lazy(() => import('./pages/public/Contact'));

// Lazy load all admin pages
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageHero = lazy(() => import('./pages/admin/ManageHero'));
const ManageServices = lazy(() => import('./pages/admin/ManageServices'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageBlog = lazy(() => import('./pages/admin/ManageBlog'));
const ManageTestimonials = lazy(() => import('./pages/admin/ManageTestimonials'));
const ManageMessages = lazy(() => import('./pages/admin/ManageMessages'));
const Settings = lazy(() => import('./pages/admin/Settings'));

const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="blog" element={<Blog />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Login (No Layout) */}
          <Route path="/admin/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="hero" element={<ManageHero />} />
            <Route path="services" element={<ManageServices />} />
            <Route path="projects" element={<ManageProjects />} />
            <Route path="blog" element={<ManageBlog />} />
            <Route path="testimonials" element={<ManageTestimonials />} />
            <Route path="messages" element={<ManageMessages />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* 404 Catch-All Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
