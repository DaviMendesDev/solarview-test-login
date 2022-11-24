<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', [\App\Http\Controllers\ApiAuthController::class, 'register']);
Route::post('get-auth-token', [\App\Http\Controllers\ApiAuthController::class, 'genAccessToken']);

// reset passwords by token
Route::post('forgot-password', [\App\Http\Controllers\ApiAuthController::class, 'forgotPassword']);
Route::post('reset-password', [\App\Http\Controllers\ApiAuthController::class, 'resetPassword']);
Route::get('check-reset-code', [\App\Http\Controllers\ApiAuthController::class, 'checkCode']);

Route::middleware(['auth:sanctum', 'log.activity'])->group(function () {
    Route::get('me', function () {
        return \request()->user();
    });

    Route::get('activity-logs', function () {
        $builder = \App\Models\ActivityLog::query();

        if ($name = \request()->get('name'))
            $builder->whereHas('user', function ($query) use ($name) {
                $query->whereRaw('UPPER(name) LIKE ?', '%' . mb_strtoupper($name) . '%');
            });

        if ($date = \request()->get('date'))
            $builder->whereBetween('created_at', [$date, (new \Illuminate\Support\Carbon($date))->addDay()->format('Y-m-d')]);

        return $builder->with('user')->paginate(15);
    });
});


