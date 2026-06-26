<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\MenuScheduleFactory> */
    use HasFactory;
    
    protected $fillable = [
        'sppg_unit_id',
        'serving_date',
        'menu_name',
        'description',
        'total_portions',
        'status',
        'batch_number',
        'cooking_status',
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
