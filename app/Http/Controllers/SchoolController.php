<?php

namespace App\Http\Controllers;

use App\Models\PartnerSchool;
use App\Http\Requests\StoreSchoolRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class SchoolController extends Controller
{
    public function index(): Response
    {
        $schools = PartnerSchool::orderBy('name')->get();

        return Inertia::render('Admin/School/Index', [
            'schools' => $schools
        ]);
    }

    public function store(StoreSchoolRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        
        PartnerSchool::create($validated);

        return redirect()->back()->with('success', 'Sekolah Mitra berhasil ditambahkan.');
    }
}
