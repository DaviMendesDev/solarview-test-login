<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Nette\Utils\Random;

class ResetPasswordCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'code'
    ];

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function gen(User $anyUser = null): ResetPasswordCode
    {
        /** @var User $user */
        $user = $anyUser ?? request()->user();

        while (self::where('code', $uniqueCode = Random::generate(6, '0-9'))->first());

        /** @var ResetPasswordCode $code */
        $code = $user->resetCodes()->create([
            'code' => $uniqueCode
        ]);

        return $code;
    }
}
