import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CurrencyDollarIcon, ChartBarIcon, DocumentArrowDownIcon, ExclamationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Finance({ auth, totalExpenditure, budgetTarget }) {
    const isOverBudget = totalExpenditure > budgetTarget;
    const percentageUsed = budgetTarget > 0 ? (totalExpenditure / budgetTarget) * 100 : 0;
    
    // Pastikan persentase tidak melebihi 100% untuk visualisasi bar (tapi angkanya bisa lebih)
    const progressBarWidth = Math.min(percentageUsed, 100);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Dasbor Manajer Keuangan</h2>}
        >
            <Head title="Finance Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Panel Ekspor */}
                    <div className="bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-700 p-6 flex flex-col sm:flex-row justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100 flex items-center">
                                <ChartBarIcon className="h-6 w-6 text-blue-400 mr-2" />
                                Transparansi Arus Kas Harian
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">Pantau pergerakan nilai inventaris dan unduh lembar rekonsiliasi.</p>
                        </div>
                        <a 
                            href={route('finance.exportReport')} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 sm:mt-0 inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-blue-900/50"
                        >
                            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                            Unduh Laporan Harian (PDF)
                        </a>
                    </div>

                    {/* Metrik Anggaran */}
                    <div className="bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-700 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CurrencyDollarIcon className="h-24 w-24 text-white" />
                                </div>
                                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-2">Total Pengeluaran Bahan (Hari Ini)</p>
                                <p className={`text-4xl font-black ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {formatRupiah(totalExpenditure)}
                                </p>
                            </div>

                            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 relative overflow-hidden">
                                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider mb-2">Pagu Anggaran Harian</p>
                                <p className="text-4xl font-black text-blue-400">
                                    {formatRupiah(budgetTarget)}
                                </p>
                            </div>
                        </div>

                        {/* Indikator Progres Anggaran */}
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <h4 className="text-gray-300 font-medium">Serapan Anggaran</h4>
                                <span className={`text-lg font-bold ${isOverBudget ? 'text-red-400' : 'text-gray-200'}`}>
                                    {percentageUsed.toFixed(1)}%
                                </span>
                            </div>
                            <div className="w-full bg-gray-900 rounded-full h-6 border border-gray-700 overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${isOverBudget ? 'bg-red-500' : percentageUsed > 80 ? 'bg-orange-400' : 'bg-emerald-500'}`} 
                                    style={{ width: `${progressBarWidth}%` }}
                                ></div>
                            </div>
                            
                            <div className="mt-4 flex items-center">
                                {isOverBudget ? (
                                    <div className="flex items-center text-red-400 text-sm font-medium bg-red-900/20 px-3 py-2 rounded-lg border border-red-800/30">
                                        <ExclamationCircleIcon className="h-5 w-5 mr-1.5" />
                                        Peringatan: Pengeluaran telah melebihi pagu anggaran harian.
                                    </div>
                                ) : (
                                    <div className="flex items-center text-emerald-400 text-sm font-medium bg-emerald-900/20 px-3 py-2 rounded-lg border border-emerald-800/30">
                                        <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                                        Status aman. Pengeluaran masih di bawah pagu anggaran.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
