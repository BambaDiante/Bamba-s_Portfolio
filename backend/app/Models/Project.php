<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;


class Project extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'projects_image',
        'skills',
        'timestamps'
    ];

   
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class)->orderBy('sort_order');
    }


    public function getProjectsImageAttribute($value)
    {
        return $value ? Storage::disk('s3')->url($value) : null;
    }
}