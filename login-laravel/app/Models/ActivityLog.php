<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';

    protected $fillable = [
        'activity_uri', 'application'
    ];

    use HasFactory;

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public static function make(string $application): Model
    {
        /** @var User $user */
        $user = request()->user();

        return $user->logs()->create([
            'activity_uri' => request()->getUri(),
            'application' => $application
        ]);
    }
}
