<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminController extends Controller
{
    public function getbio(){
        $bio= User::all()->pluck('bio');
        return response()->json($bio, 200);
    }
}
