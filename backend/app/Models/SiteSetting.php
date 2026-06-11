<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use \App\Traits\ClearsResponseCache;

    protected $guarded = [];
}
