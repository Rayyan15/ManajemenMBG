<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\MenuScheduleFactory> */
    protected $fillable = [
        'serving_date',
        'menu_name',
        'description',
        'total_portions',
        'status',
    ];

    public function menuIngredients()
    {
        return $this->hasMany(MenuIngredient::class);
    }

    public function haccpChecklist()
    {
        return $this->hasOne(HaccpChecklist::class);
    }
}
