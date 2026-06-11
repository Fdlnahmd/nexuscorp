<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function show()
    {
        return response()->json(SiteSetting::firstOrCreate([], [
            'company_name' => 'NexusCorp',
        ]));
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'logo' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:100',
            'whatsapp' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'facebook' => 'nullable|string',
            'instagram' => 'nullable|string',
            'linkedin' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
        ]);

        $setting = SiteSetting::first();
        if ($setting) {
            $setting->update($validated);
        } else {
            $setting = SiteSetting::create($validated);
        }

        return response()->json($setting);
    }
}
