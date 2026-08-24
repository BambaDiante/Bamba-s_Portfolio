<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AuthenticateFromCookie
{
    /**
     * Si le header Authorization est absent mais que le cookie auth_token
     * existe, on le réinjecte comme header Bearer pour que auth:sanctum
     * puisse authentifier normalement la requête.
     */
    public function handle(Request $request, Closure $next)
    {
        if (! $request->headers->has('Authorization') && $request->cookie('auth_token')) {
            $request->headers->set('Authorization', 'Bearer '.$request->cookie('auth_token'));
        }

        return $next($request);
    }
}