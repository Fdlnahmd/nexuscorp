<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Project;
use App\Models\Article;
use App\Models\Testimonial;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $servicesCount = Service::count();
        $projectsCount = Project::count();
        $articlesCount = Article::count();
        $testimonialsCount = Testimonial::count();
        $unreadMessagesCount = ContactMessage::where('status', 'unread')->count();

        $recentMessages = ContactMessage::latest()
            ->limit(5)
            ->get();

        // Monthly messages stats for charts
        $monthlyStats = ContactMessage::select(
            DB::raw('count(id) as count'),
            DB::raw("DATE_FORMAT(created_at, '%b') as month")
        )
            ->groupBy('month')
            ->orderBy(DB::raw('MIN(created_at)'), 'asc')
            ->limit(6)
            ->get();

        return response()->json([
            'stats' => [
                'services' => $servicesCount,
                'projects' => $projectsCount,
                'articles' => $articlesCount,
                'testimonials' => $testimonialsCount,
                'unread_messages' => $unreadMessagesCount,
            ],
            'recent_messages' => $recentMessages,
            'chart_data' => $monthlyStats,
        ]);
    }
}
