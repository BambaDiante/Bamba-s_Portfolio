<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'prenom',
        'nom', 
        'email', 
        'subject', 
        'content'];

    protected function casts(): array
    {
        return ['read_at' => 'datetime'];
    }
}