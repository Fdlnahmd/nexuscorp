<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSection extends Model
{
    use \App\Traits\ClearsResponseCache;

    protected $guarded = [];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
