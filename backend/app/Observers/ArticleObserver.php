<?php

namespace App\Observers;

use App\Models\Article;
use Illuminate\Support\Facades\Cache;

class ArticleObserver
{
    public function saved(Article $article): void
    {
        Cache::flush();
    }

    public function deleted(Article $article): void
    {
        Cache::flush();
    }
}
