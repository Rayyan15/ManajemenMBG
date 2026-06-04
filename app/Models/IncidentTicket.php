<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IncidentTicket extends Model
{
    /** @use HasFactory<\Database\Factories\IncidentTicketFactory> */
    use HasFactory;

    protected $fillable = [
        'reporter_id',
        'partner_school_id',
        'category',
        'priority',
        'description',
        'status',
    ];

    public function partnerSchool()
    {
        return $this->belongsTo(PartnerSchool::class);
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reporter_id');
    }
}
