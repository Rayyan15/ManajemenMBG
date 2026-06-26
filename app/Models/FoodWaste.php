<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FoodWaste extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'sppg_unit_id', 'partner_school_id', 'menu_schedule_id',
        'waste_portions', 'waste_weight_kg', 'date', 'notes'
    ];
}
