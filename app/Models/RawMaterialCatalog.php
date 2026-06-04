<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RawMaterialCatalog extends Model
{
    /** @use HasFactory<\Database\Factories\RawMaterialCatalogFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'unit_of_measurement',
        'estimated_price',
        'current_stock',
        'minimum_stock',
    ];
}
