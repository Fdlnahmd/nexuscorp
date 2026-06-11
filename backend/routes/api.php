<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ArticleController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\TeamMemberController;
use App\Http\Controllers\Admin\HeroController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\MediaController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- PUBLIC WEBSITE ENDPOINTS ---
Route::prefix('public')->group(function () {
    Route::get('homepage', [PublicController::class, 'homepage']);
    Route::get('settings', [PublicController::class, 'settings']);
    Route::get('hero', [PublicController::class, 'hero']);
    Route::get('services', [PublicController::class, 'services']);
    Route::get('projects', [PublicController::class, 'projects']);
    Route::get('testimonials', [PublicController::class, 'testimonials']);
    Route::get('team', [PublicController::class, 'team']);
    Route::get('articles', [PublicController::class, 'articles']);
    Route::get('articles/{slug}', [PublicController::class, 'articleBySlug']);
    Route::post('contact', [PublicController::class, 'submitContact'])->middleware('throttle:5,1'); // Rate limit: 5 submissions per minute
});

// --- AUTH ENDPOINTS ---
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
        Route::post('change-password', [AuthController::class, 'changePassword']);
    });
});

// --- ADMIN CMS ENDPOINTS ---
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index']);
    
    Route::apiResource('services', ServiceController::class);
    Route::apiResource('projects', ProjectController::class);
    Route::apiResource('articles', ArticleController::class);
    Route::apiResource('testimonials', TestimonialController::class);
    Route::apiResource('team', TeamMemberController::class);
    Route::apiResource('hero', HeroController::class);
    
    Route::get('settings', [SettingController::class, 'show']);
    Route::put('settings', [SettingController::class, 'update']);
    
    Route::apiResource('messages', MessageController::class)->only(['index', 'show', 'destroy']);
    Route::put('messages/{message}/status', [MessageController::class, 'updateStatus']);
    
    Route::apiResource('media', MediaController::class)->only(['index', 'store', 'destroy']);
});
