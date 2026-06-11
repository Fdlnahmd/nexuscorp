<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\SiteSetting;
use App\Models\HeroSection;
use App\Models\Service;
use App\Models\Project;
use App\Models\Testimonial;
use App\Models\TeamMember;
use App\Models\Article;
use App\Models\ContactMessage;

class PublicController extends Controller
{
    public function homepage()
    {
        $data = Cache::remember('public_homepage_data', 1800, function () {
            return [
                'settings' => SiteSetting::first() ?? [
                    'company_name' => 'NexusCorp',
                    'logo' => null,
                    'email' => 'hello@nexuscorp.com',
                    'phone' => '',
                    'whatsapp' => '',
                    'address' => '',
                    'facebook' => '',
                    'instagram' => '',
                    'linkedin' => '',
                    'seo_title' => 'NexusCorp',
                    'seo_description' => '',
                ],
                'hero' => HeroSection::where('is_active', true)
                    ->orderBy('order')
                    ->first(),
                'services' => Service::where('is_active', true)
                    ->orderBy('order')
                    ->get(),
                'projects' => Project::where('is_active', true)
                    ->orderBy('order')
                    ->get(),
                'testimonials' => Testimonial::where('is_active', true)
                    ->latest()
                    ->get(),
                'team' => TeamMember::where('is_active', true)
                    ->orderBy('order')
                    ->get(),
                'articles' => Article::with('user:id,name')
                    ->where('status', 'published')
                    ->latest('published_at')
                    ->take(6)
                    ->get()
                    ->toArray(), // ensure serialization works smoothly
            ];
        });

        return response()->json($data);
    }

    public function settings()
    {
        $settings = Cache::remember('public_settings', 86400, function () {
            return SiteSetting::first() ?? [
                'company_name' => 'NexusCorp',
                'logo' => null,
                'email' => 'hello@nexuscorp.com',
                'phone' => '',
                'whatsapp' => '',
                'address' => '',
                'facebook' => '',
                'instagram' => '',
                'linkedin' => '',
                'seo_title' => 'NexusCorp',
                'seo_description' => '',
            ];
        });

        return response()->json($settings);
    }

    public function hero()
    {
        $hero = Cache::remember('public_hero', 43200, function () {
            return HeroSection::where('is_active', true)
                ->orderBy('order')
                ->first();
        });

        return response()->json($hero);
    }

    public function services()
    {
        $services = Cache::remember('public_services', 3600, function () {
            return Service::where('is_active', true)
                ->orderBy('order')
                ->get();
        });

        return response()->json($services);
    }

    public function projects()
    {
        $projects = Cache::remember('public_projects', 3600, function () {
            return Project::where('is_active', true)
                ->orderBy('order')
                ->get();
        });

        return response()->json($projects);
    }

    public function testimonials()
    {
        $testimonials = Cache::remember('public_testimonials', 21600, function () {
            return Testimonial::where('is_active', true)
                ->latest()
                ->get();
        });

        return response()->json($testimonials);
    }

    public function team()
    {
        $team = Cache::remember('public_team', 43200, function () {
            return TeamMember::where('is_active', true)
                ->orderBy('order')
                ->get();
        });

        return response()->json($team);
    }

    public function articles(Request $request)
    {
        $page = $request->get('page', 1);
        $category = $request->get('category');
        
        $cacheKey = 'public_articles_page_' . $page . '_cat_' . ($category ?? 'all');

        $articles = Cache::remember($cacheKey, 1800, function () use ($category) {
            $query = Article::with('user:id,name')
                ->where('status', 'published')
                ->latest('published_at');

            if ($category) {
                $query->where('category', $category);
            }

            return $query->paginate(6);
        });

        return response()->json($articles);
    }

    public function articleBySlug($slug)
    {
        $cacheKey = 'public_article_' . $slug;

        $article = Cache::remember($cacheKey, 1800, function () use ($slug) {
            return Article::with('user:id,name')
                ->where('slug', $slug)
                ->where('status', 'published')
                ->firstOrFail();
        });

        return response()->json($article);
    }

    public function submitContact(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        $message = ContactMessage::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'subject' => $request->subject,
            'message' => $request->message,
            'status' => 'unread',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you! Your message has been sent successfully.',
            'data' => $message,
        ], 201);
    }
}
