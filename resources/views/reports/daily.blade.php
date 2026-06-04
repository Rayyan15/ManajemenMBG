<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Operasional MBG - {{ $date }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #2d3748; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #1a202c; font-size: 24px; }
        .header p { margin: 5px 0 0; color: #718096; }
        .metrics-grid { width: 100%; margin-bottom: 40px; }
        .metrics-grid td { width: 50%; padding: 15px; border: 1px solid #e2e8f0; vertical-align: top; }
        .metric-title { font-size: 12px; text-transform: uppercase; color: #a0aec0; font-weight: bold; margin-bottom: 5px; }
        .metric-value { font-size: 28px; font-weight: bold; color: #2d3748; }
        .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .table th, .table td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; }
        .table th { background-color: #f7fafc; font-weight: bold; color: #4a5568; }
        .status-badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .bg-red { background-color: #fed7d7; color: #c53030; }
        .bg-blue { background-color: #bee3f8; color: #2b6cb0; }
        .bg-green { background-color: #c6f6d5; color: #2f855a; }
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Operasional Makan Bergizi Gratis</h1>
        <p>Tanggal Laporan: {{ \Carbon\Carbon::parse($date)->translatedFormat('l, d F Y') }}</p>
    </div>

    <table class="metrics-grid">
        <tr>
            <td>
                <div class="metric-title">Total Pengeluaran Bahan Baku</div>
                <div class="metric-value">Rp {{ number_format($totalExpenditure, 0, ',', '.') }}</div>
            </td>
            <td>
                <div class="metric-title">Total Porsi Terdistribusi (Selesai)</div>
                <div class="metric-value">{{ number_format($distributedPortions) }} Porsi</div>
            </td>
        </tr>
    </table>

    <h3 style="color: #2d3748; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Rekapitulasi Insiden Lapangan</h3>
    
    @if(count($incidents) > 0)
        <table class="table">
            <thead>
                <tr>
                    <th>Sekolah Tujuan</th>
                    <th>Kurir Pelapor</th>
                    <th>Kategori</th>
                    <th>Status Akhir</th>
                </tr>
            </thead>
            <tbody>
                @foreach($incidents as $incident)
                    <tr>
                        <td>{{ $incident->partnerSchool->name ?? 'N/A' }}</td>
                        <td>{{ $incident->reporter->name ?? 'N/A' }}</td>
                        <td style="text-transform: capitalize;">{{ $incident->category }}</td>
                        <td>
                            @if($incident->status == 'open')
                                <span class="status-badge bg-red">Menunggu Respons</span>
                            @elseif($incident->status == 'investigating')
                                <span class="status-badge bg-blue">Sedang Ditangani</span>
                            @else
                                <span class="status-badge bg-green">Selesai</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <p style="color: #718096; font-style: italic; background-color: #f7fafc; padding: 20px; text-align: center; border: 1px dashed #cbd5e0;">Tidak ada laporan insiden yang tercatat pada tanggal ini. Operasional berjalan sempurna.</p>
    @endif

    <div class="footer">
        Dokumen ini dihasilkan secara otomatis oleh Sistem Manajemen Logistik MBG.<br>
        Dicetak pada: {{ now()->format('d/m/Y H:i:s') }}
    </div>
</body>
</html>
