<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\SiteSetting;
use App\Models\HeroSection;
use App\Models\Service;
use App\Models\Project;
use App\Models\Testimonial;
use App\Models\TeamMember;
use App\Models\Article;
use App\Models\ContactMessage;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed User (Admin)
        $admin = User::updateOrCreate(
            ['email' => 'admin@demo.com'],
            [
                'name' => 'Nexus Admin',
                'password' => Hash::make('password'),
                'role' => 'super_admin',
            ]
        );

        // 2. Seed Site Settings
        SiteSetting::truncate();
        SiteSetting::create([
            'company_name' => 'NexusCorp',
            'logo' => null,
            'email' => 'hello@nexuscorp.com',
            'phone' => '+1 (555) 123-4567',
            'whatsapp' => '+15551234567',
            'address' => '123 Business Avenue, Suite 400, New York, NY 10001',
            'facebook' => 'https://facebook.com/nexuscorp',
            'instagram' => 'https://instagram.com/nexuscorp',
            'linkedin' => 'https://linkedin.com/company/nexuscorp',
            'seo_title' => 'NexusCorp | Premium Corporate Solutions & Consulting',
            'seo_description' => 'NexusCorp helps modern businesses scale with strategic consulting, digital transformation, and professional services.',
        ]);

        // 3. Seed Hero Sections
        HeroSection::truncate();
        HeroSection::create([
            'title' => 'Transforming Ideas into Digital Realities',
            'subtitle' => 'Leading Innovation',
            'description' => 'We help modern businesses scale with enterprise-grade solutions and creative marketing strategies.',
            'primary_button_text' => 'View Services',
            'primary_button_url' => '#services',
            'secondary_button_text' => 'Contact Us',
            'secondary_button_url' => '#contact',
            'image' => 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
            'background_image' => null,
            'is_active' => true,
            'order' => 1,
        ]);
        HeroSection::create([
            'title' => 'Accelerate Business Growth with Strategy',
            'subtitle' => 'Strategic Consulting',
            'description' => 'Our bespoke advisory services empower organization leaders to unlock potential and optimize operations.',
            'primary_button_text' => 'Consult Now',
            'primary_button_url' => '#contact',
            'secondary_button_text' => 'Learn More',
            'secondary_button_url' => '#about',
            'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
            'background_image' => null,
            'is_active' => false,
            'order' => 2,
        ]);

        // 4. Seed Services
        Service::truncate();
        $services = [
            [
                'title' => 'Strategic Consulting',
                'slug' => 'strategic-consulting',
                'short_description' => 'Business strategy and growth planning.',
                'description' => 'We deliver actionable roadmaps and business plans tailored to accelerate market penetration and long-term organizational success.',
                'icon' => 'Briefcase',
                'image' => null,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'Digital Transformation',
                'slug' => 'digital-transformation',
                'short_description' => 'Modernizing business operations.',
                'description' => 'We redesign legacy workflows, integrate enterprise APIs, and roll out cloud solutions to boost team productivity and save infrastructure costs.',
                'icon' => 'Monitor',
                'image' => null,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'Financial Advisory',
                'slug' => 'financial-advisory',
                'short_description' => 'Investment and financial planning.',
                'description' => 'From risk management to budget planning, our experienced financial experts help you build scalable capital structures.',
                'icon' => 'TrendingUp',
                'image' => null,
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'Marketing Solutions',
                'slug' => 'marketing-solutions',
                'short_description' => 'Brand building and digital marketing.',
                'description' => 'Grow your audience and drive organic conversions with structured SEO campaigns, modern brand design, and paid ads execution.',
                'icon' => 'Target',
                'image' => null,
                'is_active' => true,
                'order' => 4,
            ],
            [
                'title' => 'Enterprise Security',
                'slug' => 'enterprise-security',
                'short_description' => 'Securing your tech assets.',
                'description' => 'We perform security audits, implement zero-trust protocols, and protect customer databases from potential online vulnerabilities.',
                'icon' => 'Shield',
                'image' => null,
                'is_active' => true,
                'order' => 5,
            ],
            [
                'title' => 'Cloud Migration',
                'slug' => 'cloud-migration',
                'short_description' => 'Seamless cloud deployment.',
                'description' => 'Migrate your application infrastructure safely to AWS, GCP, or Azure with zero downtime and automated deployment support.',
                'icon' => 'Cloud',
                'image' => null,
                'is_active' => true,
                'order' => 6,
            ],
        ];
        foreach ($services as $service) {
            Service::create($service);
        }

        // 5. Seed Projects
        Project::truncate();
        $projects = [
            [
                'title' => 'EcoTech Innovations',
                'slug' => 'ecotech-innovations',
                'category' => 'Technology',
                'client_name' => 'EcoTech Group',
                'short_description' => 'Complete digital overhaul.',
                'description' => 'We built a unified dashboard integrating IoT sensor inputs to monitor carbon footprints across 12 manufacturing facilities worldwide.',
                'image' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
                'gallery_images' => null,
                'project_url' => 'https://ecotech-demo.com',
                'is_featured' => true,
                'is_active' => true,
                'order' => 1,
            ],
            [
                'title' => 'Nexus Headquarters',
                'slug' => 'nexus-headquarters',
                'category' => 'Real Estate',
                'client_name' => 'Nexus Properties',
                'short_description' => 'New corporate office design.',
                'description' => 'Designed and constructed a state-of-the-art office hub containing smart meeting spaces, green gardens, and high-performance server grids.',
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                'gallery_images' => null,
                'project_url' => null,
                'is_featured' => true,
                'is_active' => true,
                'order' => 2,
            ],
            [
                'title' => 'VitaHealth Platform',
                'slug' => 'vitahealth-platform',
                'category' => 'Healthcare',
                'client_name' => 'VitaHealth Inc.',
                'short_description' => 'Telemedicine application.',
                'description' => 'Developed an end-to-end HIPAA compliant web application allowing secure chat, voice, and video consultations between patients and doctors.',
                'image' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
                'gallery_images' => null,
                'project_url' => 'https://vitahealth-app.io',
                'is_featured' => true,
                'is_active' => true,
                'order' => 3,
            ],
            [
                'title' => 'FinSmart App',
                'slug' => 'finsmart-app',
                'category' => 'Finance',
                'client_name' => 'FinSmart LTD',
                'short_description' => 'Automated investment engine.',
                'description' => 'Engineered a secure micro-savings platform linking with bank APIs to invest residual funds into diversified stock options.',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
                'gallery_images' => null,
                'project_url' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 4,
            ],
            [
                'title' => '物流 (Logistics) AI Optimization',
                'slug' => 'logistics-ai-optimization',
                'category' => 'Logistics',
                'client_name' => 'Global Cargo Corp',
                'short_description' => 'Route planning using AI.',
                'description' => 'Improvised route calculation engine that reduces delivery fuel cost by 18% through dynamic mapping and traffic forecasting.',
                'image' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
                'gallery_images' => null,
                'project_url' => null,
                'is_featured' => false,
                'is_active' => true,
                'order' => 5,
            ],
            [
                'title' => 'Eco-retail E-commerce',
                'slug' => 'eco-retail-ecommerce',
                'category' => 'Retail',
                'client_name' => 'GreenStore Co.',
                'short_description' => 'Shopify custom headless setup.',
                'description' => 'Completed a headless frontend using NextJS for an organic shop, boasting sub-second loading time and customized shipping integration.',
                'image' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
                'gallery_images' => null,
                'project_url' => 'https://greenstore.io',
                'is_featured' => false,
                'is_active' => true,
                'order' => 6,
            ],
        ];
        foreach ($projects as $project) {
            Project::create($project);
        }

        // 6. Seed Testimonials
        Testimonial::truncate();
        Testimonial::create([
            'client_name' => 'Sarah Jenkins',
            'client_company' => 'TechNova',
            'client_position' => 'CEO',
            'rating' => 5,
            'content' => 'Our growth accelerated by 300% after working with the team. Their strategic advising and execution are top notch.',
            'photo' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
            'is_active' => true,
        ]);
        Testimonial::create([
            'client_name' => 'Marcus Lin',
            'client_company' => 'BuildRight',
            'client_position' => 'Managing Director',
            'rating' => 5,
            'content' => 'Professional, timely, and transformative services. The digital transformation module saved us thousands of work hours.',
            'photo' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
            'is_active' => true,
        ]);
        Testimonial::create([
            'client_name' => 'David Lee',
            'client_company' => 'Apex Health',
            'client_position' => 'Operations Chief',
            'rating' => 5,
            'content' => 'The telemedicine software launch was flawless. They handled backend security regulations and databases with expertise.',
            'photo' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
            'is_active' => true,
        ]);
        Testimonial::create([
            'client_name' => 'Elena Rostova',
            'client_company' => 'Fintech Hub',
            'client_position' => 'Co-Founder',
            'rating' => 4,
            'content' => 'High quality consulting sessions. We refined our pitch deck and business projections leading to a successful Series A round.',
            'photo' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
            'is_active' => true,
        ]);
        Testimonial::create([
            'client_name' => 'Kenji Sato',
            'client_company' => 'Sato Foods',
            'client_position' => 'General Manager',
            'rating' => 5,
            'content' => 'A robust cloud setup. Our online store is fast and highly secure. The support team responds instantly whenever needed.',
            'photo' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&h=120&q=80',
            'is_active' => true,
        ]);

        // 7. Seed Team Members
        TeamMember::truncate();
        TeamMember::create([
            'name' => 'Alexander Vance',
            'position' => 'Chief Executive Officer',
            'bio' => 'Over 18 years of advisory and project management experience in Fortune 500 companies.',
            'photo' => 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&h=500&q=80',
            'linkedin' => 'https://linkedin.com',
            'twitter' => null,
            'email' => 'vance@nexuscorp.com',
            'is_active' => true,
            'order' => 1,
        ]);
        TeamMember::create([
            'name' => 'Sophia Martinez',
            'position' => 'Head of Digital Solutions',
            'bio' => 'Passionate architect specializing in database design, API engineering, and cloud platforms.',
            'photo' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=500&q=80',
            'linkedin' => 'https://linkedin.com',
            'twitter' => 'https://twitter.com',
            'email' => 'sophia@nexuscorp.com',
            'is_active' => true,
            'order' => 2,
        ]);
        TeamMember::create([
            'name' => 'Marcus Chen',
            'position' => 'Lead Financial Advisor',
            'bio' => 'Former venture capital analyst focusing on capital optimization, risk planning, and scaling models.',
            'photo' => 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=500&q=80',
            'linkedin' => 'https://linkedin.com',
            'twitter' => null,
            'email' => 'marcus@nexuscorp.com',
            'is_active' => true,
            'order' => 3,
        ]);
        TeamMember::create([
            'name' => 'Olivia Kim',
            'position' => 'VP of Brand Marketing',
            'bio' => 'Creative director aiming to tell impactful corporate stories and expand audience engagement.',
            'photo' => 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=500&q=80',
            'linkedin' => 'https://linkedin.com',
            'twitter' => 'https://twitter.com',
            'email' => 'olivia@nexuscorp.com',
            'is_active' => true,
            'order' => 4,
        ]);

        // 8. Seed Articles
        Article::truncate();
        $articles = [
            [
                'title' => 'The Future of Remote Work',
                'slug' => 'the-future-of-remote-work',
                'excerpt' => 'How companies are adapting to hybrid models.',
                'content' => 'Remote work is no longer a perk; it is a core business strategy. Over the last few years, organizations that adopted hybrid setups saw a 20% increase in developer satisfaction. Successful models balance output-oriented goals with deep focus times. In this guide, we break down top frameworks for scaling team communication, cloud systems, and maintaining project schedules remotely.',
                'thumbnail' => 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
                'category' => 'Insights',
                'status' => 'published',
                'published_at' => now(),
            ],
            [
                'title' => 'Financial Planning for 2027',
                'slug' => 'financial-planning-for-2027',
                'excerpt' => 'Preparing your business for economic shifts.',
                'content' => 'Navigating inflation and supply fluctuations requires dynamic cash projection models. We advise modern companies to build a 6-month buffer and review fixed costs quarterly. Allocating budget to SaaS integrations often yields high ROI in the long run by reducing manual data Entry.',
                'thumbnail' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
                'category' => 'Finance',
                'status' => 'published',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Maximizing Brand Impact',
                'slug' => 'maximizing-brand-impact',
                'excerpt' => 'Strategies for standing out in a crowded market.',
                'content' => 'Consistent brand voice across newsletters, websites, and marketing campaigns can double audience engagement. Align your values with visual styles and ensure fast loading speeds for public sites to reduce early customer bounce rate.',
                'thumbnail' => 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
                'category' => 'Marketing',
                'status' => 'published',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Understanding Cloud Security Risks',
                'slug' => 'understanding-cloud-security-risks',
                'excerpt' => 'Practical checklist for modern architectures.',
                'content' => 'Misconfigured IAM roles account for over 70% of cloud security data leaks. Review your container policies, disable unnecessary SSH ports, and run auto-scanners inside your CI/CD pipelines to catch vulnerabilities early.',
                'thumbnail' => 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
                'category' => 'Security',
                'status' => 'published',
                'published_at' => now()->subDays(10),
            ],
            [
                'title' => 'Building Headless E-commerce Solutions',
                'slug' => 'building-headless-ecommerce-solutions',
                'excerpt' => 'Decoupling frontend and backend for ultimate speed.',
                'content' => 'By decoupling the presentation layer from backend systems, businesses achieve sub-second page loads. We detail using React with Laravel API backend as a top option for handling shopping carts and payment webhooks.',
                'thumbnail' => 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80',
                'category' => 'Technology',
                'status' => 'draft',
                'published_at' => null,
            ],
            [
                'title' => 'AI Applications in Global Logistics',
                'slug' => 'ai-applications-in-global-logistics',
                'excerpt' => 'Revolutionizing supply chain calculation.',
                'content' => 'Dynamic route calculation using machine learning minimizes fuel expenses and predicts delivery blockages before trucks leave the warehouses.',
                'thumbnail' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
                'category' => 'AI',
                'status' => 'published',
                'published_at' => now()->subDays(12),
            ],
        ];
        foreach ($articles as $art) {
            $art['user_id'] = $admin->id;
            Article::create($art);
        }

        // 9. Seed Contact Messages
        ContactMessage::truncate();
        ContactMessage::create([
            'name' => 'Alice Cooper',
            'email' => 'alice@example.com',
            'phone' => '+1 555 333 4444',
            'subject' => 'Inquiring about consulting services',
            'message' => 'Hello, I would like to set up a 30-minute discovery call to discuss our team operational growth plans.',
            'status' => 'unread',
        ]);
        ContactMessage::create([
            'name' => 'David Smith',
            'email' => 'david@buildright.com',
            'phone' => '+1 555 444 8888',
            'subject' => 'Project proposal follow-up',
            'message' => 'Can you send over the updated PDF proposal for the headquarters construction project?',
            'status' => 'read',
        ]);
        ContactMessage::create([
            'name' => 'Elena Gomez',
            'email' => 'elena@startup.io',
            'phone' => null,
            'subject' => 'Partnership opportunity',
            'message' => 'We are interested in co-hosting a tech seminar next month. Let us know if you are open for a brief discussion.',
            'status' => 'read',
        ]);
        ContactMessage::create([
            'name' => 'Robert Johnson',
            'email' => 'robert@greenstore.io',
            'phone' => '+1 555 999 0000',
            'subject' => 'Headless commerce pricing',
            'message' => 'What is the estimated timeline for integrating the headless checkout with Stripe billing API?',
            'status' => 'replied',
        ]);
        ContactMessage::create([
            'name' => 'Clara Oswald',
            'email' => 'clara@tardis.org',
            'phone' => null,
            'subject' => 'General Feedback',
            'message' => 'Love your brand design and fast loading page! The statistics and portfolio grids look beautiful.',
            'status' => 'unread',
        ]);
    }
}
