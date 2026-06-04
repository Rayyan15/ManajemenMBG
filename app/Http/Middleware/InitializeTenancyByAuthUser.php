<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class InitializeTenancyByAuthUser
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user();

        // Check if user is authenticated and has a tenant_id
        if ($user && $user->tenant_id) {
            \Illuminate\Support\Facades\Log::info('Initializing tenancy for: ' . $user->tenant_id);
            // Initialize tenancy based on the user's mapped tenant_id
            tenancy()->initialize($user->tenant_id);
            \Illuminate\Support\Facades\Log::info('Tenancy initialized. Default connection: ' . \Illuminate\Support\Facades\DB::getDefaultConnection());
            \Illuminate\Support\Facades\Log::info('Tenant database: ' . config('database.connections.tenant.database'));
        } else {
            \Illuminate\Support\Facades\Log::warning('No tenant_id found for user: ' . ($user ? $user->id : 'null'));
        }

        return $next($request);
    }
}
