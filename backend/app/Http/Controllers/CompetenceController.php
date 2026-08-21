<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SkillCategory;
use App\Models\Categories;
use App\Models\Skill;

class CompetenceController extends Controller
{
    public function index()
    {
        // Récupère toutes les categorie avec leur skills associes
        $categories = SkillCategory::with('skills')->get();
        return response()->json($categories);
    }
    public function catstore(Request $request){
        $validated=$request->validate([  
            'category' => 'required|string|max:255',
        ]);

        SkillCategory::create([
            'nom'=>$validated['category'],
        ]);

        return response()->json(['message' => 'Categorie crée avec succes.'], 201);
    }
    public function skillstore(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categorie_skills,id',
            'name' => 'required|string|max:255',
            'icon_path' => 'nullable|string|max:255',
        ]);

        Skill::create([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            // On utilise l'opérateur ?? pour éviter l'erreur si la clé est absente
            'icon_path' => $request->input('icon_path') ?? null
        ]);

        return response()->json(['message' => 'Competence ajoute avec succes.'], 201);
    }
}
