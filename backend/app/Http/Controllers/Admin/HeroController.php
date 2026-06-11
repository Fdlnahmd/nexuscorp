<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function index()
    {
        return response()->json(HeroSection::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'primary_button_text' => 'nullable|string|max:50',
            'primary_button_url' => 'nullable|string',
            'secondary_button_text' => 'nullable|string|max:50',
            'secondary_button_url' => 'nullable|string',
            'image' => 'nullable|string',
            'background_image' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $hero = HeroSection::create($validated);

        return response()->json($hero, 201);
    }

    public function show(HeroSection $hero)
    {
        return response()->json($hero);
    }

    public function update(Request $request, HeroSection $hero)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'primary_button_text' => 'nullable|string|max:50',
            'primary_button_url' => 'nullable|string',
            'secondary_button_text' => 'nullable|string|max:50',
            'secondary_button_url' => 'nullable|string',
            'image' => 'nullable|string',
            'background_image' => 'nullable|string',
            'is_active' => 'boolean',
            'order' => 'integer',
        ]);

        $hero->update($validated);

        return response()->json($hero);
    }

    public function destroy(HeroSection $hero)
    {
        $hero->delete();
        return response()->json(['message' => 'Hero section deleted successfully']);
    }
}
