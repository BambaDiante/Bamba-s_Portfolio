<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\CompetenceController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ContactController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/projects', [ProjectsController::class, 'index']);
Route::get('/competences', [CompetenceController::class, 'index']);
Route::get('/about', [AdminController::class, 'getbio']);
Route::get('/parcours', [AdminController::class, 'getparcours']);
Route::post('/contact', [ContactController::class, 'store']);
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok'
    ]);
});

// Utiliser 'auth:sanctum' au lieu de 'auth' pour les routes API SPA
Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {

    // Projets
    Route::post('/create/project', [ProjectsController::class, 'store']);
    Route::put('/project/{id}', [ProjectsController::class, 'update']);
    Route::delete('/project/{id}', [ProjectsController::class, 'destroy']);

    // Catégories
    Route::post('/create/category', [CompetenceController::class, 'catstore']);
    Route::put('/category/{id}', [CompetenceController::class, 'updateCategory']);
    Route::delete('/category/{id}', [CompetenceController::class, 'destroyCategory']);

    // Skills
    Route::post('/create/skill', [CompetenceController::class, 'skillstore']);
    Route::put('/skill/{id}', [CompetenceController::class, 'updateSkill']);
    Route::delete('/skill/{id}', [CompetenceController::class, 'destroySkill']);

    // Messages
    Route::get('/messages', [ContactController::class, 'getMessage']);
    Route::delete('/messages/{id}', [ContactController::class, 'destroy']);
});

require __DIR__.'/auth.php';