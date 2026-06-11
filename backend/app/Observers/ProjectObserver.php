<?php

namespace App\Observers;

use App\Models\Project;
use Illuminate\Support\Facades\Cache;

class ProjectObserver
{
    public function saved(Project $project): void
    {
        Cache::forget('public_projects');
    }

    public function deleted(Project $project): void
    {
        Cache::forget('public_projects');
    }
}
