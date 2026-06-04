import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { CheckBadgeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function School({ auth, deliveries }) {
    const [isIncidentOpen, setIsIncidentOpen] = useState(false);
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    const { data, setData, post, processing, reset } = useForm({
        partner_school_id: auth.user.partner_school_id || 1, // Fallback if relation not loaded
        category: 'distribusi',
        priority: 'high',
        description: '',
    });

    const handleIncidentOpen = (delivery) => {
        setSelectedDelivery(delivery);
        setData('partner_school_id', delivery.partner_school_id);
        setIsIncidentOpen(true);
    };

    const submitIncident = (e) => {
        e.preventDefault();
        post(route('incidents.store'), {
            onSuccess: () => {
                setIsIncidentOpen(false);
                reset();
                alert('Laporan kendala berhasil dikirim.');
            }
        });
    };

    const confirmReceipt = (id) => {
        if(confirm(`Konfirmasi penerimaan makanan?`)) {
            post(route('school.confirmReceipt', { id }), {
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Konfirmasi Penerimaan</h2>}
        >
            <Head title="School Dashboard" />

            <div className="py-6 px-4 max-w-md mx-auto space-y-6 pb-24">
                
                {deliveries && deliveries.length > 0 ? deliveries.map((delivery) => (
                    <div key={delivery.id} className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden text-center">
                        <div className="p-8 pb-4">
                            <p className="text-gray-400 font-medium mb-2 uppercase tracking-widest text-xs">Jatah Porsi Hari Ini</p>
                            <h1 className="text-7xl font-black text-gray-100 drop-shadow-md">
                                {delivery.menu_schedule.total_portions}
                            </h1>
                            <p className="text-gray-400 mt-2 text-sm">{delivery.menu_schedule.menu_name}</p>
                        </div>
                        
                        <div className="px-6 pb-8 space-y-4 pt-4">
                            {delivery.status === 'in_transit' ? (
                                <div className="p-4 bg-gray-900 rounded-xl border border-gray-700 flex items-center justify-center text-gray-400">
                                    <ClockIcon className="h-5 w-5 mr-2 animate-pulse" />
                                    <span>Sedang dalam perjalanan...</span>
                                </div>
                            ) : delivery.status === 'delivered' ? (
                                <button 
                                    onClick={() => confirmReceipt(delivery.id)}
                                    className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-bold rounded-2xl flex items-center justify-center transition shadow-lg shadow-emerald-900/50 active:scale-95"
                                >
                                    <CheckBadgeIcon className="h-6 w-6 mr-2" />
                                    Konfirmasi Terima
                                </button>
                            ) : (
                                <div className="p-4 bg-emerald-900 bg-opacity-50 rounded-xl border border-emerald-800 text-emerald-400 font-bold flex items-center justify-center">
                                    <CheckBadgeIcon className="h-6 w-6 mr-2" />
                                    Sudah Dikonfirmasi
                                </div>
                            )}

                            <button 
                                onClick={() => handleIncidentOpen(delivery)}
                                className="w-full h-14 bg-transparent border-2 border-red-900 hover:bg-red-900 text-red-400 text-sm font-bold rounded-2xl flex items-center justify-center transition active:scale-95"
                            >
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                                Lapor Kendala
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400">Tidak ada pengiriman untuk sekolah ini hari ini.</p>
                    </div>
                )}
            </div>

            <BottomSheet isOpen={isIncidentOpen} onClose={() => setIsIncidentOpen(false)} title="Lapor Kendala">
                <form onSubmit={submitIncident} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Detail Kendala</label>
                        <textarea 
                            required
                            rows="4" 
                            className="mt-1 block w-full bg-gray-900 border-gray-700 text-gray-100 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500" 
                            placeholder="Misal: Porsi kurang, makanan tumpah, dll."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center transition active:scale-95"
                    >
                        {processing ? 'Memproses...' : 'Kirim Laporan'}
                    </button>
                </form>
            </BottomSheet>

        </AuthenticatedLayout>
    );
}
