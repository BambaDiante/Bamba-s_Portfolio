<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('users')->updateOrInsert(
            ['email' => 'bambadiante@gmail.com'],
            [
                'name' => ' Ahmadou Bamba Diante',
                'password' => bcrypt('admin123!'),
                'bio'=>'Développeur Full Stack passionné
                    par la conception et le développement d\'applications
                    web performantes, sécurisées et évolutives. Curieux et motivé,
                    j\'apprends continuellement de nouvelles technologies afin
                    de relever des défis techniques et de contribuer 
                    efficacement à des projets innovants',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
        DB::table('experiences')->updateOrInsert(
            [
                'Institut'=>'Universities Cheikh Anta Diop de Dakar',
                'description'=>'Licence en informatique a la section informatique.
                    Competences apprises:development web,development
                    mobile,reseau,development logiciel,
                    cybersécurité',
                'duree'=>'Trois ans'
            ],
            );

        DB::table('categorie_skills')->updateOrInsert(
            ['nom' => 'Frontend'],
            ['icone' => 'code'],
        );

        DB::table('categorie_skills')->updateOrInsert(
            ['nom' => 'Backend'],
            ['icone' => 'server'],
        );

        $frontendId = DB::table('categorie_skills')->where('nom', 'Frontend')->value('id');
        $backendId = DB::table('categorie_skills')->where('nom', 'Backend')->value('id');

        foreach ([
            ['name' => 'HTML', 'category_id' => $frontendId],
            ['name' => 'Bootstrap', 'category_id' => $frontendId],
            ['name' => 'React', 'category_id' => $frontendId],
            ['name' => 'JavaScript', 'category_id' => $frontendId],
            ['name' => 'CSS', 'category_id' => $frontendId],
            ['name' => 'Laravel', 'category_id' => $backendId],
            ['name' => 'PHP', 'category_id' => $backendId],
            ['name' => 'SQLite', 'category_id' => $backendId],
        ] as $skill) {
            DB::table('skills')->updateOrInsert(
                ['name' => $skill['name']],
                ['category_id' => $skill['category_id']],
            );
        }

        DB::table('projects')->updateOrInsert(
            ['slug' => 'portfolio-modulaire'],
            [
                'title' => 'Portfolio modulaire',
                'description' => 'Une expérience portfolio construite avec React, Laravel et SQLite.',
                'image_path' => null,
                'url' => 'http://localhost:5173',
                'is_featured' => true,
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );

        DB::table('projects')->updateOrInsert(
            ['slug' => 'application-de-gestion'],
            [
                'title' => 'Application de gestion',
                'description' => 'Une interface claire pour organiser des données et suivre les actions importantes.',
                'image_path' => null,
                'url' => null,
                'is_featured' => false,
                'published_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        );
    }
}
