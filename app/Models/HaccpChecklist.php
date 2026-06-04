<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HaccpChecklist extends Model
{
    /** @use HasFactory<\Database\Factories\HaccpChecklistFactory> */
    protected $fillable = [
        'menu_schedule_id',
        'kitchen_manager_id',
        'check_date',
        'sanitation_score',
        'storage_temperature',
        'cooking_standard_score',
        'notes',
    ];

    public function menuSchedule()
    {
        return $this->belongsTo(MenuSchedule::class);
    }
}
