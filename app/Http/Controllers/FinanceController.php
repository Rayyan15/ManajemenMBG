<?php

namespace App\Http\Controllers;

use App\Services\FinanceService;
use App\Models\MenuSchedule;
use App\Models\IncidentTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class FinanceController extends Controller
{
    public function dashboard(FinanceService $financeService)
    {
        $today = now()->toDateString();
        $totalExpenditure = $financeService->calculateDailyExpenditure($today);
        $budgetTarget = $financeService->getDailyBudgetTarget();

        return Inertia::render('Dashboard/Finance', [
            'totalExpenditure' => $totalExpenditure,
            'budgetTarget' => $budgetTarget,
        ]);
    }

    public function exportReport(FinanceService $financeService)
    {
        $today = now()->toDateString();
        $totalExpenditure = $financeService->calculateDailyExpenditure($today);
        
        $distributedPortions = MenuSchedule::whereDate('serving_date', $today)
            ->where('status', 'completed')
            ->sum('total_portions');

        $incidents = IncidentTicket::with(['partnerSchool', 'reporter'])
            ->whereDate('created_at', $today)
            ->get();

        $pdf = Pdf::loadView('reports.daily', [
            'date' => $today,
            'totalExpenditure' => $totalExpenditure,
            'distributedPortions' => $distributedPortions,
            'incidents' => $incidents,
        ]);

        return $pdf->download('laporan_operasional_MBG_' . $today . '.pdf');
    }
}
