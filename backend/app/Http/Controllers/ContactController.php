<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Message;

class ContactController extends Controller
{
    public function store(Request $request){
        $validated = $request->validate([
            'email' => 'required|string',
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'sujet' => 'required|string',
            'description' => 'required|string'
        ]);

        Message::create([
            'email'=>$validated['email'],
            'prenom'=>$validated['prenom'],
            'nom'=>$validated['nom'],
            'subject'=>$validated['sujet'],
            'content'=>$validated['description'],

        ]);

        return response()->json(['message' => 'Message envoyé.'], 201);
    }
    
    public function getMessage(){
        $message=Message::all();
        return response()->json($message,200);
    }
}
