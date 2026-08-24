<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     * On ne passe plus par la session, on renvoie un token Bearer.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $user = $request->user();

        // Optionnel mais recommandé : supprime les anciens tokens du même appareil
        // pour éviter d'en accumuler à chaque login.
        $user->tokens()->where('name', 'frontend')->delete();

        $token = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    /**
     * Destroy an authenticated session.
     * On révoque uniquement le token utilisé pour cette requête.
     */
    public function destroy(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent();
    }
}