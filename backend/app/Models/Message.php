<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = ['first_name', 'last_name', 'email', 'subject', 'content'];

    protected function casts(): array
    {
        return ['read_at' => 'datetime'];
    }
}