import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExclamationTriangleIcon, CheckCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

export default function Admin({ auth, metrics, chartData }) {
    
    useEffect(() => {
        // Mendengarkan siaran kejadian dari Laravel Reverb
        if (window.Echo) {
            window.Echo.channel('deliveries')
                .listen('DeliveryStatusUpdated', (e) => {
                    // Menyegarkan metrik dan chartData tanpa me-refresh halaman secara penuh
                    router.reload({ only: ['metrics', 'chartData'], preserveScroll: true });
                })
                .listen('IncidentReported', (e) => {
                    router.reload({ only: ['metrics'], preserveScroll: true });
                });
        }
        
        return () => {
            if (window.Echo) {
                window.Echo.leaveChannel('deliveries');
            }
        };
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-100 leading-tight">Dasbor Pemilik Yayasan</h2>
                    <button 
                        onClick={() => window.print()}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 px-4 py-2 rounded shadow transition text-sm font-bold flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                        Cetak Laporan
                    </button>
                </div>
            }
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Financial & Multi-SPPG Aggregation (Fase 4) */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 overflow-hidden shadow-sm rounded-xl p-5 border border-indigo-700">
                            <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Cabang Dapur</p>
                            <p className="text-2xl font-bold text-white">{metrics.totalSppg} <span className="text-sm font-normal text-indigo-300">SPPG</span></p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 overflow-hidden shadow-sm rounded-xl p-5 border border-emerald-700">
                            <p className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">Porsi Dibagikan (All Time)</p>
                            <p className="text-2xl font-bold text-white">{metrics.totalMealsAllTime.toLocaleString('id-ID')}</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-900 to-orange-800 overflow-hidden shadow-sm rounded-xl p-5 border border-orange-700 col-span-2">
                            <p className="text-orange-200 text-xs font-bold uppercase tracking-wider mb-1">Total Pengeluaran & Cost Per Meal</p>
                            <div className="flex justify-between items-end">
                                <p className="text-2xl font-bold text-white">Rp {metrics.totalExpense.toLocaleString('id-ID')}</p>
                                <p className="text-sm text-orange-200 bg-orange-900/50 px-2 py-1 rounded">Rp {metrics.costPerMeal.toLocaleString('id-ID', {maximumFractionDigits: 0})} / porsi</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-red-900 to-red-800 overflow-hidden shadow-sm rounded-xl p-5 border border-red-700">
                            <p className="text-red-200 text-xs font-bold uppercase tracking-wider mb-1">Total Food Waste</p>
                            <p className="text-2xl font-bold text-white">{metrics.totalFoodWasteKg.toFixed(1)} <span className="text-sm font-normal text-red-300">Kg</span></p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <h3 className="text-lg font-bold text-gray-100 mb-2">Metrik Hari Ini</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6 flex items-center border border-gray-700">
                            <div className="p-3 rounded-full bg-blue-900 bg-opacity-50 text-blue-400 mr-4">
                                <ChartBarIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Target Harian</p>
                                <p className="text-2xl font-bold text-gray-100">{metrics.dailyPortions}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6 flex items-center border border-gray-700">
                            <div className="p-3 rounded-full bg-emerald-900 bg-opacity-50 text-emerald-400 mr-4">
                                <CheckCircleIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm font-medium">Terkirim</p>
                                <p className="text-2xl font-bold text-gray-100 transition-all duration-500">{metrics.deliveredPortions}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6 flex items-center border border-red-900">
                            <div className="p-3 rounded-full bg-red-900 bg-opacity-50 text-red-400 mr-4">
                                <ExclamationTriangleIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-red-400 text-sm font-medium">Stok Menipis</p>
                                <p className="text-2xl font-bold text-gray-100">{metrics.lowStockAlerts.length}</p>
                            </div>
                        </div>

                        <div className="bg-gray-800 overflow-hidden shadow-sm rounded-lg p-6 flex items-center border border-orange-900">
                            <div className="p-3 rounded-full bg-orange-900 bg-opacity-50 text-orange-400 mr-4">
                                <ExclamationTriangleIcon className="h-8 w-8" />
                            </div>
                            <div>
                                <p className="text-orange-400 text-sm font-medium">Laporan Kendala</p>
                                <p className="text-2xl font-bold text-gray-100">{metrics.recentIncidents.length}</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                                <h3 className="text-lg font-medium text-gray-100 mb-4">Target vs Realisasi (7 Hari Terakhir)</h3>
                                <div className="h-80 w-full text-sm">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={[...chartData].reverse()}
                                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                            <XAxis dataKey="date" stroke="#9CA3AF" />
                                            <YAxis stroke="#9CA3AF" />
                                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} />
                                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                            <Bar dataKey="target" name="Target Produksi" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="actual" name="Realisasi Terkirim" fill="#10B981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Incidents Panel */}
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700">
                                <h3 className="text-lg font-medium text-orange-400 mb-4 flex items-center">
                                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Tiket Kendala Lapangan (Terbaru)
                                </h3>
                                {metrics.recentIncidents.length === 0 ? (
                                    <p className="text-gray-400 text-sm">Tidak ada kendala lapangan yang dilaporkan.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-700 text-sm">
                                            <thead>
                                                <tr>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">Waktu</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pelapor</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">Sekolah Tujuan</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">Kendala</th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                                    <th className="px-3 py-3 text-right text-xs font-medium text-gray-400 uppercase">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-700">
                                                {metrics.recentIncidents.map((incident) => (
                                                    <tr key={incident.id} className="hover:bg-gray-750 transition duration-150 ease-in-out">
                                                        <td className="px-3 py-4 text-gray-300 whitespace-nowrap">{new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                                        <td className="px-3 py-4 text-gray-300">
                                                            {incident.reporter ? incident.reporter.name : 'Sistem'}
                                                            <div className="text-xs text-gray-500 capitalize">{incident.reporter ? incident.reporter.role : ''}</div>
                                                        </td>
                                                        <td className="px-3 py-4 text-gray-300">{incident.partner_school.name}</td>
                                                        <td className="px-3 py-4 text-gray-300 max-w-xs truncate" title={incident.description}>{incident.description}</td>
                                                        <td className="px-3 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                                incident.status === 'open' ? 'bg-orange-900 text-orange-300' :
                                                                incident.status === 'investigating' ? 'bg-blue-900 text-blue-300' :
                                                                'bg-emerald-900 text-emerald-300'
                                                            }`}>
                                                                {incident.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            {incident.status === 'open' && (
                                                                <button 
                                                                    onClick={() => router.post(route('admin.incidents.updateStatus', incident.id), { status: 'investigating' }, { preserveScroll: true })}
                                                                    className="text-blue-400 hover:text-blue-300 mr-3"
                                                                >
                                                                    Tindak Lanjuti
                                                                </button>
                                                            )}
                                                            {incident.status !== 'resolved' && (
                                                                <button 
                                                                    onClick={() => router.post(route('admin.incidents.updateStatus', incident.id), { status: 'resolved' }, { preserveScroll: true })}
                                                                    className="text-emerald-400 hover:text-emerald-300"
                                                                >
                                                                    Selesai
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            <div className="bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-700 overflow-y-auto" style={{ maxHeight: '400px' }}>
                                <h3 className="text-lg font-medium text-red-400 mb-4 flex items-center">
                                    <ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Detail Stok Menipis
                                </h3>
                                {metrics.lowStockAlerts.length === 0 ? (
                                    <p className="text-gray-400 text-sm">Semua stok bahan baku aman.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {metrics.lowStockAlerts.map((item, idx) => (
                                            <li key={idx} className="flex justify-between items-center bg-gray-900 p-3 rounded border border-gray-700">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-200">{item.name}</p>
                                                    <p className="text-xs text-gray-500">Sisa: <span className="text-red-400 font-bold">{item.current_stock}</span> {item.unit_of_measurement}</p>
                                                </div>
                                                <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white py-1 px-2 rounded transition">Order</button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
