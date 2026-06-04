<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryLog extends Model
{
    /** @use HasFactory<\Database\Factories\DeliveryLogFactory> */
    use HasFactory;

    protected $fillable = [
        'menu_schedule_id',
        'driver_id',
        'partner_school_id',
        'delivery_time',
        'status',
        'proof_image_path',
        'notes',
    ];

    public function menuSchedule()
    {
        return $this->belongsTo(MenuSchedule::class);
    }

    public function partnerSchool()
    {
        return $this->belongsTo(PartnerSchool::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
