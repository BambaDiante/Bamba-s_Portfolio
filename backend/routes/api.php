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
Route::get('/competences',[CompetenceController::class,'index']);
Route::get('/about',[AdminController::class,'getbio']);
Route::get('/parcours',[AdminController::class,'getparcours']);
Route::post('/contact',[ContactController::class,'store']);

Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/messages',[ContactController::class,'getMessage']);
    Route::post('/create/project',[ProjectsController::class,'store']);
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

require __DIR__.'/auth.php';
