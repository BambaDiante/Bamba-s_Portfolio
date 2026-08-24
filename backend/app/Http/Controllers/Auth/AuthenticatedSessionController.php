<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     * Le token est renvoyé via un cookie httpOnly, jamais dans le body JSON.
     */
    public function store(LoginRequest $request)
    {
        $request->authenticate();

        $user = $request->user();

        // Supprime les anciens tokens du même appareil pour ne pas en accumuler
        $user->tokens()->where('name', 'frontend')->delete();

        $token = $user->createToken('frontend')->plainTextToken;

        $cookie = cookie(
            name: 'auth_token',
            value: $token,
            minutes: 60 * 24 * 7,   // 7 jours, ajuste selon ton besoin
            path: '/',
            domain: null,            // host-only, pas de partage cross-subdomain
            secure: true,
            httpOnly: true,
            raw: false,
            sameSite: 'none',
        );

        return response()->json(['user' => $user])->withCookie($cookie);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        $request->user()->currentAccessToken()->delete();

        return response()->noContent()->withCookie(Cookie::forget('auth_token'));
    }
}