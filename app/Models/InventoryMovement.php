<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryMovement extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryMovementFactory> */
    use HasFactory;

    protected $fillable = [
        'sppg_unit_id',
        'supplier_id',
        'raw_material_catalog_id',
        'type',
        'quantity',
        'unit_price',
        'total_price',
        'reference_number',
        'date',
        'notes',
        'approval_status',
    ];

    public function raw_material_catalog()
    {
        return $this->belongsTo(RawMaterialCatalog::class, 'raw_material_catalog_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function sppg_unit()
    {
        return $this->belongsTo(SppgUnit::class, 'sppg_unit_id');
    }
}
