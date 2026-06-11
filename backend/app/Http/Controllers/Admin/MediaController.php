<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class MediaController extends Controller
{
    public function index(Request $request)
    {
        $media = Media::latest()->paginate(24);
        
        $media->getCollection()->transform(function ($item) {
            $item->url = asset('storage/' . $item->path);
            return $item;
        });

        return response()->json($media);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|image|max:2048',
        ]);

        if ($request->file('file')->isValid()) {
            $file = $request->file('file');
            
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            $filename = time() . '_' . uniqid() . '.' . $extension;
            
            if (!Storage::disk('public')->exists('uploads')) {
                Storage::disk('public')->makeDirectory('uploads');
            }

            $path = 'uploads/' . $filename;
            
            $image = Image::make($file->getRealPath());
            
            if ($image->width() > 1600) {
                $image->resize(1600, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
            }
            
            $image->save(storage_path('app/public/' . $path), 80);

            $media = Media::create([
                'filename' => $filename,
                'original_name' => $originalName,
                'path' => $path,
                'mime_type' => $file->getClientMimeType(),
                'size' => filesize(storage_path('app/public/' . $path)),
                'disk' => 'public',
            ]);

            return response()->json([
                'url' => asset('storage/' . $path),
                'media' => $media,
            ], 201);
        }

        return response()->json(['message' => 'Invalid file upload'], 400);
    }

    public function destroy(Media $media)
    {
        if (Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }
        
        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}
