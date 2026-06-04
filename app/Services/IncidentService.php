<?php

namespace App\Services;

use App\Models\IncidentTicket;

class IncidentService
{
    /**
     * Create a new incident ticket.
     *
     * @param array $data
     * @return IncidentTicket
     */
    public function reportIncident(array $data): IncidentTicket
    {
        return IncidentTicket::create([
            'reporter_id' => $data['reporter_id'] ?? auth()->id(),
            'partner_school_id' => $data['partner_school_id'],
            'category' => $data['category'],
            'priority' => $data['priority'],
            'description' => $data['description'],
            'status' => 'open',
        ]);
    }

    /**
     * Update incident status.
     *
     * @param IncidentTicket $ticket
     * @param string $status
     * @return IncidentTicket
     */
    public function updateStatus(IncidentTicket $ticket, string $status): IncidentTicket
    {
        $ticket->update(['status' => $status]);
        return $ticket;
    }
}
