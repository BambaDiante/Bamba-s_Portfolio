<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use Illuminate\Support\Facades\Storage;

class ProjectsController extends Controller
{
    public function index()
    {
        
        $projects = Project::with('skills')->get();
        return response()->json($projects, 200);
    }

public function store(Request $request)
{
    $validated = $request->validate([
        'nom' => 'required|string|max:255',
        'description' => 'required|string',
        'project_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        'skills' => 'nullable|array',
        'skills.*' => 'exists:skills,id'
    ]);

    $imagePath = null;

    if ($request->hasFile('project_image')) {
        $file = $request->file('project_image');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('projects', $filename, 'public');
        // Optionnel : stocker le chemin relatif, mais assurez-vous de l'utiliser correctement côté React
        $imagePath = '/storage/' . $path; 
    }

    // On transforme le stack en tableau pour correspondre à un champ JSON
    $stackData = ['Laravel', 'React', 'SQLite']; // Ou récupéré dynamiquement depuis votre formulaire

    $project = Project::create([
        'nom' => $validated['nom'],
        'description' => $validated['description'],
        'projects_image' => $imagePath,
        'stack' => $stackData, // Enregistré proprement pour le format JSON
    ]);

    if (!empty($validated['skills'])) {
        $project->skills()->sync($validated['skills']);
    }

    return response()->json([
        'message' => 'Projet créé avec succès !',
        'project' => $project->load('skills')
    ], 201);
}
}