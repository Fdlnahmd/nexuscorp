<?php

namespace App\Observers;

use App\Models\SiteSetting;
use Illuminate\Support\Facades\Cache;

class SiteSettingObserver
{
    public function saved(SiteSetting $siteSetting): void
    {
        Cache::forget('public_settings');
    }

    public function deleted(SiteSetting $siteSetting): void
    {
        Cache::forget('public_settings');
    }
}
