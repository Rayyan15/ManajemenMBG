<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\IncidentService;
use Exception;

class IncidentController extends Controller
{
    protected $incidentService;

    public function __construct(IncidentService $incidentService)
    {
        $this->incidentService = $incidentService;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'partner_school_id' => 'required|exists:partner_schools,id',
            'category' => 'required|string',
            'priority' => 'required|string',
            'description' => 'required|string'
        ]);

        try {
            $ticket = $this->incidentService->reportIncident($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Incident reported successfully',
                'data' => $ticket
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to report incident: ' . $e->getMessage()
            ], 500);
        }
    }

    // Web endpoint untuk pengiriman dari PWA (Inertia)
    public function storeWeb(Request $request)
    {
        $validated = $request->validate([
            'partner_school_id' => 'required|exists:partner_schools,id',
            'category' => 'required|string',
            'priority' => 'required|string',
            'description' => 'required|string'
        ]);

        try {
            // Append reporter_id if not present (handled by service, but good practice)
            $validated['reporter_id'] = auth()->id();
            $this->incidentService->reportIncident($validated);

            broadcast(new \App\Events\IncidentReported())->toOthers();

            return back()->with('success', 'Incident reported successfully');
        } catch (Exception $e) {
            return back()->withErrors(['error' => 'Failed to report incident: ' . $e->getMessage()]);
        }
    }

    public function updateStatusWeb(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:open,investigating,resolved'
        ]);

        $ticket = \App\Models\IncidentTicket::findOrFail($id);
        $ticket->update(['status' => $validated['status']]);

        // Broadcast to driver
        broadcast(new \App\Events\IncidentStatusUpdated($ticket))->toOthers();

        return back()->with('success', 'Incident status updated');
    }
}
