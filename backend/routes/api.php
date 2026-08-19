<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\CompetenceController;
use App\Http\Controllers\AdminController;



Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});
Route::get('/projects', [ProjectsController::class, 'index']);
Route::get('/competences',[CompetenceController::class,'index']);
Route::get('/about',[AdminController::class,'getbio']);
Route::get('/parcours',[AdminController::class,'getparcours']);

require __DIR__.'/auth.php';
