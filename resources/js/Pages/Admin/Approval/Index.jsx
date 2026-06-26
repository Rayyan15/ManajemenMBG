import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { CheckCircleIcon, XCircleIcon, DocumentTextIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export default function ApprovalIndex({ auth, movements, history }) {
    const [processing, setProcessing] = useState(false);
    
    const handleAction = (id, status) => {
        if (confirm(`Anda yakin ingin ${status === 'approved' ? 'menyetujui' : 'menolak'} PO ini?`)) {
            setProcessing(true);
            router.put(route('admin.approvals.update', id), { status }, {
                preserveScroll: true,
                onSuccess: () => alert(`PO berhasil ${status === 'approved' ? 'disetujui' : 'ditolak'}.`),
                onFinish: () => setProcessing(false)
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Persetujuan Pembelian (PO)</h2>}
        >
            <Head title="Persetujuan PO" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Row */}
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-100">Antrean PO dari Dapur</h3>
                        <p className="text-sm text-gray-400 mt-1">Stok baru akan masuk ke gudang setelah Anda menyetujuinya.</p>
                    </div>

                    {/* Pending Table */}
                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">No. PO</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Tanggal</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Bahan & Kuantitas</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Supplier / Catatan</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Total Harga</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Dapur (SPPG)</th>
                                        <th className="px-6 py-4 text-right font-semibold text-gray-400">Keputusan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {movements.length > 0 ? movements.map((mov) => (
                                        <tr key={mov.id} className="hover:bg-gray-750 transition duration-150">
                                            <td className="px-6 py-4 text-orange-400 font-mono font-bold">{mov.reference_number}</td>
                                            <td className="px-6 py-4 text-gray-300">{mov.date}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-100">{mov.raw_material_catalog ? mov.raw_material_catalog.name : 'Unknown'}</div>
                                                <div className="text-emerald-400 font-bold text-xs mt-1">+{mov.quantity} {mov.raw_material_catalog ? mov.raw_material_catalog.unit_of_measurement : ''}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-300 font-bold text-sm">{mov.supplier ? mov.supplier.name : '-'}</div>
                                                <div className="text-gray-500 text-xs mt-1 max-w-xs">{mov.notes}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-300">
                                                {mov.total_price ? `Rp ${Number(mov.total_price).toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-blue-300 bg-blue-900/50 px-2 py-1 rounded">
                                                    {mov.sppg_unit ? mov.sppg_unit.name : '-'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <button 
                                                        onClick={() => handleAction(mov.id, 'rejected')}
                                                        disabled={processing}
                                                        className="px-4 py-2 bg-red-900/50 hover:bg-red-800 text-red-400 rounded border border-red-800 font-bold text-xs transition"
                                                    >
                                                        Tolak
                                                    </button>
                                                    <button 
                                                        onClick={() => handleAction(mov.id, 'approved')}
                                                        disabled={processing}
                                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs transition shadow-lg shadow-emerald-900/50 flex items-center"
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4 mr-1" /> Setuju
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                <ClipboardDocumentCheckIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                                Tidak ada PO yang menunggu persetujuan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-100 mt-8 mb-4">Riwayat Keputusan Terbaru</h3>
                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-400">No. PO</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-400">Bahan & Kuantitas</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-400">Status Akhir</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {history.length > 0 ? history.map((mov) => (
                                        <tr key={mov.id}>
                                            <td className="px-6 py-3 text-gray-400 font-mono text-xs">{mov.reference_number}</td>
                                            <td className="px-6 py-3 text-gray-300 text-xs">
                                                {mov.raw_material_catalog ? mov.raw_material_catalog.name : 'Unknown'} (+{mov.quantity})
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                    mov.approval_status === 'approved' ? 'bg-emerald-900 text-emerald-400' : 'bg-red-900 text-red-400'
                                                }`}>
                                                    {mov.approval_status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-6 text-center text-gray-500">
                                                Belum ada riwayat.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
