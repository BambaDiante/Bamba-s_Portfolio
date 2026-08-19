<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Photo extends Model
{
    protected $fillable = [
        'path'
        ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}