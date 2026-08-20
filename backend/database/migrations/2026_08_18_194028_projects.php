<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string("description");
            $table->string("projects_image");
            $table->json('stack')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Note: On ne peut pas supprimer un $table->id() facilement avec dropColumn, 
            // mais comme 'projects' a déjà sa propre table de base, on supprime les colonnes ajoutées :
            $table->dropColumn(['nom', 'description', 'projects_image', 'stack']);
            
            // Si l'id a été recréé par erreur en tant que colonne supplémentaire :
            // $table->dropColumn('id');
        });
    }
};
