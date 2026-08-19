<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Experience;


class AdminController extends Controller
{
    public function getbio(){
        $bio= User::all()->pluck('bio');
        return response()->json($bio, 200);
    }
    public function getparcours(){
        $parcours= Experience::all();
        return response()->json($parcours,200);
    }
}
