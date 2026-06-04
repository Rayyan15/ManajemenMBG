<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CheckLowStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'inventory:check-low-stock';

    protected $description = 'Check raw material inventory against minimum stock and trigger alerts if necessary';

    public function handle()
    {
        $lowStockItems = \App\Models\RawMaterialCatalog::whereColumn('current_stock', '<', 'minimum_stock')->count();

        if ($lowStockItems > 0) {
            broadcast(new \App\Events\LowStockAlertTriggered());
            $this->info("Found {$lowStockItems} low stock items. Alert broadcasted.");
        } else {
            $this->info("Stock levels are sufficient.");
        }
    }
}
