<?php

namespace App\Observers;

use App\Models\HeroSection;
use Illuminate\Support\Facades\Cache;

class HeroSectionObserver
{
    public function saved(HeroSection $heroSection): void
    {
        Cache::forget('public_hero');
    }

    public function deleted(HeroSection $heroSection): void
    {
        Cache::forget('public_hero');
    }
}
