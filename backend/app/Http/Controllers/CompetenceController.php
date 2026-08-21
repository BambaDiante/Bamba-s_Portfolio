<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SkillCategory;
use App\Models\Skill;

class CompetenceController extends Controller
{
    /**
     * Récupérer toutes les catégories
     * avec leurs compétences.
     */
    public function index()
    {
        $categories = SkillCategory::with('skills')->get();

        return response()->json($categories);
    }


    /**
     * Créer une catégorie.
     */
    public function catstore(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|string|max:255',
        ]);

        $category = SkillCategory::create([
            'nom' => $validated['category'],
        ]);

        return response()->json([
            'message' => 'Catégorie créée avec succès.',
            'category' => $category
        ], 201);
    }


    /**
     * Modifier une catégorie.
     */
    public function updateCategory(Request $request, $id)
    {
        $category = SkillCategory::findOrFail($id);

        $validated = $request->validate([
            'category' => 'required|string|max:255',
        ]);

        $category->update([
            'nom' => $validated['category'],
        ]);

        return response()->json([
            'message' => 'Catégorie modifiée avec succès.',
            'category' => $category->load('skills')
        ], 200);
    }


    /**
     * Supprimer une catégorie.
     */
    public function destroyCategory($id)
    {
        $category = SkillCategory::findOrFail($id);

        /*
         * On supprime d'abord les skills
         * appartenant à cette catégorie.
         */
        $category->skills()->delete();

        $category->delete();

        return response()->json([
            'message' => 'Catégorie supprimée avec succès.'
        ], 200);
    }


    /**
     * Créer une compétence.
     */
    public function skillstore(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categorie_skills,id',
            'name' => 'required|string|max:255',
            'icon_path' => 'nullable|string|max:255',
        ]);

        $skill = Skill::create([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'icon_path' => $validated['icon_path'] ?? null,
        ]);

        return response()->json([
            'message' => 'Compétence ajoutée avec succès.',
            'skill' => $skill
        ], 201);
    }


    /**
     * Modifier une compétence.
     */
    public function updateSkill(Request $request, $id)
    {
        $skill = Skill::findOrFail($id);

        $validated = $request->validate([
            'category_id' => 'required|integer|exists:categorie_skills,id',
            'name' => 'required|string|max:255',
            'icon_path' => 'nullable|string|max:255',
        ]);

        $skill->update([
            'name' => $validated['name'],
            'category_id' => $validated['category_id'],
            'icon_path' => $validated['icon_path'] ?? null,
        ]);

        return response()->json([
            'message' => 'Compétence modifiée avec succès.',
            'skill' => $skill
        ], 200);
    }


    /**
     * Supprimer une compétence.
     */
    public function destroySkill($id)
    {
        $skill = Skill::findOrFail($id);

        $skill->delete();

        return response()->json([
            'message' => 'Compétence supprimée avec succès.'
        ], 200);
    }
}