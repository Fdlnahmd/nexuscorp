<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;

trait ClearsResponseCache
{
    public static function bootClearsResponseCache()
    {
        static::saved(function () {
            static::clearCache();
        });

        static::deleted(function () {
            static::clearCache();
        });
    }

    public static function clearCache()
    {
        Cache::forget('public_settings');
        Cache::forget('public_hero');
        Cache::forget('public_services');
        Cache::forget('public_projects');
        Cache::forget('public_testimonials');
        Cache::forget('public_team');
        Cache::forget('public_homepage_data');
        Cache::flush();
    }
}
