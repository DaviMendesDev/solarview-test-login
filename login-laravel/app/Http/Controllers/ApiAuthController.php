<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckCodeRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\ResetPasswordByCode;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use App\Mail\SendResetCodePassword;
use App\Models\ResetPasswordCode;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

class ApiAuthController extends Controller
{
    public function register(SignUpRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();
        $user = new User();
        $user->signUpThis($validated);

        return response()->json([
            'user' => $user,
            'access' => $user->createToken('access')->plainTextToken
        ]);
    }

    public function genAccessToken(SignInRequest $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validated();

        if (! $user = User::where('email', $validated['email'])->first()) {
            throw new AuthorizationException('Email/Password incorrect.');
        }

        if (! Hash::check($validated['password'], $user->password)) {
            throw new AuthorizationException('Email/Password incorrect.');
        }

        return response()->json([
            'access' => $user->createToken('access')->plainTextToken
        ]);
    }

    public function forgotPassword(ForgotPasswordRequest $request): \Illuminate\Http\JsonResponse
    {
        $email = $request->validated('email');
        $user = User::where('email', $email)->firstOrFail();

        Mail::to($user)->send(new SendResetCodePassword($user));

        return response()->json([
            'status' => 'success',
            'message' => 'email sent successfully.'
        ]);
    }

    public function checkCode(CheckCodeRequest $request): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => 'The code is valid'
        ]);
    }

    public function resetPassword(ResetPasswordByCode $request)
    {
        /** @var ResetPasswordCode $code */
        $code = ResetPasswordCode::where('code', $request->validated('code'))->first();
        $newPassword = Hash::make($request->validated('newPassword'));

        /** @var User $user */
        $user = $code->user;
        $user->password = $newPassword;

        $user->save();

        $code->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset succeed.'
        ]);
    }
}
