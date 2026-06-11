<?php

namespace App\Observers;

use App\Models\TeamMember;
use Illuminate\Support\Facades\Cache;

class TeamMemberObserver
{
    public function saved(TeamMember $teamMember): void
    {
        Cache::forget('public_team');
    }

    public function deleted(TeamMember $teamMember): void
    {
        Cache::forget('public_team');
    }
}
