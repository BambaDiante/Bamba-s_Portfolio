<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SkillCategory;

class CompetenceController extends Controller
{
    public function index()
    {
        // Récupère toutes les categorie avec leur skills associes
        $categories = SkillCategory::with('skills')->get();
        return response()->json($categories);
    }
}
