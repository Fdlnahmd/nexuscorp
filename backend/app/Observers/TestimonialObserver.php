<?php

namespace App\Observers;

use App\Models\Testimonial;
use Illuminate\Support\Facades\Cache;

class TestimonialObserver
{
    public function saved(Testimonial $testimonial): void
    {
        Cache::forget('public_testimonials');
    }

    public function deleted(Testimonial $testimonial): void
    {
        Cache::forget('public_testimonials');
    }
}
