<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuIngredient extends Model
{
    /** @use HasFactory<\Database\Factories\MenuIngredientFactory> */
    use HasFactory;

    protected $fillable = [
        'menu_schedule_id',
        'raw_material_catalog_id',
        'quantity_per_portion',
    ];

    public function menuSchedule()
    {
        return $this->belongsTo(MenuSchedule::class);
    }

    public function rawMaterialCatalog()
    {
        return $this->belongsTo(RawMaterialCatalog::class);
    }
}
