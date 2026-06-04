import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { CheckCircleIcon, ExclamationTriangleIcon, MapPinIcon, CameraIcon } from '@heroicons/react/24/solid';
import { TruckIcon, CogIcon } from '@heroicons/react/24/outline';

export default function Driver({ auth, schedules, incidents }) {
    const [isIncidentOpen, setIsIncidentOpen] = useState(false);
    const [isCompleteOpen, setIsCompleteOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);

    useEffect(() => {
        if (window.Echo) {
            window.Echo.channel('incidents')
                .listen('IncidentStatusUpdated', (e) => {
                    // Refresh data for driver to get the updated status
                    router.reload({ only: ['incidents'], preserveScroll: true });
                });
        }
        return () => {
            if (window.Echo) window.Echo.leaveChannel('incidents');
        };
    }, []);

    const { data, setData, post, processing, reset } = useForm({
        partner_school_id: '',
        category: 'logistik',
        priority: 'high',
        description: '',
    });

    const completeForm = useForm({
        status: 'delivered',
        proof_image: null,
    });

    const handleIncidentOpen = (schedule) => {
        setSelectedSchedule(schedule);
        setData('partner_school_id', schedule.partner_school_id);
        setIsIncidentOpen(true);
    };

    const handleCompleteOpen = (schedule) => {
        setSelectedSchedule(schedule);
        completeForm.setData('proof_image', null);
        setIsCompleteOpen(true);
    };

    const submitIncident = (e) => {
        e.preventDefault();
        post(route('incidents.store'), {
            onSuccess: () => {
                setIsIncidentOpen(false);
                reset();
                alert('Insiden berhasil dilaporkan.');
            }
        });
    };

    const submitComplete = (e) => {
        e.preventDefault();
        // Karena Inertia butuh POST untuk kirim file
        completeForm.post(route('driver.updateStatus', { id: selectedSchedule.id }), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setIsCompleteOpen(false);
                completeForm.reset();
                alert('Pengiriman berhasil diselesaikan!');
            }
        });
    };

    const getIncidentForSchedule = (schoolId) => {
        if (!incidents) return null;
        return incidents.find(i => i.partner_school_id === schoolId);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Jadwal Pengiriman</h2>}
        >
            <Head title="Driver Dashboard" />

            <div className="py-6 px-4 max-w-md mx-auto space-y-4 pb-24">
                
                {schedules && schedules.length > 0 ? schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-gray-800 rounded-2xl shadow-lg border border-gray-700 overflow-hidden">
                        <div className="p-4 border-b border-gray-700 bg-gray-750">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-100 flex items-center">
                                        <MapPinIcon className="h-5 w-5 text-emerald-500 mr-2" />
                                        {schedule.partner_school.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mt-1">{schedule.partner_school.address}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${schedule.status === 'delivered' ? 'bg-emerald-900 text-emerald-400' : 'bg-blue-900 text-blue-400'}`}>
                                    {schedule.status.toUpperCase()}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-400">Total Porsi:</span>
                                <span className="text-gray-100 font-bold text-lg">{schedule.menu_schedule.total_portions}</span>
                            </div>
                            
                            {schedule.status !== 'delivered' && (() => {
                                const activeIncident = getIncidentForSchedule(schedule.partner_school_id);
                                
                                if (activeIncident) {
                                    return (
                                        <div className="pt-2">
                                            <div className={`p-4 rounded-xl border flex items-center justify-center ${
                                                activeIncident.status === 'resolved' 
                                                ? 'bg-emerald-900 border-emerald-800 text-emerald-400' 
                                                : activeIncident.status === 'investigating'
                                                ? 'bg-blue-900 border-blue-800 text-blue-400'
                                                : 'bg-orange-900 border-orange-800 text-orange-400'
                                            }`}>
                                                {activeIncident.status === 'resolved' ? (
                                                    <><CheckCircleIcon className="h-5 w-5 mr-2" /> Kendala Selesai Ditangani</>
                                                ) : activeIncident.status === 'investigating' ? (
                                                    <><CogIcon className="h-5 w-5 mr-2 animate-spin" /> Sedang Ditangani Admin</>
                                                ) : (
                                                    <><ExclamationTriangleIcon className="h-5 w-5 mr-2" /> Menunggu Respons Admin</>
                                                )}
                                            </div>
                                            
                                            {/* Allow concluding the delivery even if incident is handled */}
                                            {activeIncident.status === 'resolved' && (
                                                <button 
                                                    onClick={() => handleCompleteOpen(schedule)}
                                                    className="w-full mt-3 h-14 flex justify-center items-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition shadow-lg shadow-emerald-900/50"
                                                >
                                                    <CheckCircleIcon className="h-5 w-5 mr-2" /> Lanjutkan & Selesaikan Pesanan
                                                </button>
                                            )}
                                        </div>
                                    );
                                }

                                return (
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <button 
                                            onClick={() => handleIncidentOpen(schedule)}
                                            className="h-14 flex flex-col justify-center items-center bg-red-900 hover:bg-red-800 text-red-100 rounded-xl font-bold transition active:scale-95"
                                        >
                                            <ExclamationTriangleIcon className="h-5 w-5 mb-1" />
                                            <span className="text-xs">Lapor Kendala</span>
                                        </button>
                                        <button 
                                            onClick={() => handleCompleteOpen(schedule)}
                                            className="h-14 flex flex-col justify-center items-center bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition active:scale-95 shadow-lg shadow-emerald-900/50"
                                        >
                                            <CheckCircleIcon className="h-5 w-5 mb-1" />
                                            <span className="text-xs">Selesai</span>
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12">
                        <TruckIcon className="h-16 w-16 mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-400">Tidak ada jadwal pengiriman hari ini.</p>
                    </div>
                )}
            </div>

            <BottomSheet isOpen={isIncidentOpen} onClose={() => setIsIncidentOpen(false)} title="Lapor Insiden">
                <form onSubmit={submitIncident} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Sekolah Tujuan</label>
                        <input type="text" disabled value={selectedSchedule?.partner_school?.name || ''} className="mt-1 block w-full bg-gray-900 border-gray-700 text-gray-400 rounded-md shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Deskripsi Kendala</label>
                        <textarea 
                            required
                            rows="4" 
                            className="mt-1 block w-full bg-gray-900 border-gray-700 text-gray-100 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500" 
                            placeholder="Misal: Kemacetan parah, makanan rusak, dll."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center transition"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Laporan'}
                    </button>
                </form>
            </BottomSheet>

            {/* Bottom Sheet Penyelesaian Pengiriman */}
            <BottomSheet isOpen={isCompleteOpen} onClose={() => setIsCompleteOpen(false)} title="Selesaikan Pesanan">
                <form onSubmit={submitComplete} className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">Ambil foto bukti kedatangan di sekolah. Pastikan terang dan jelas.</p>
                        <div className="mt-4 relative border-2 border-dashed border-gray-600 rounded-2xl p-6 bg-gray-800 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-gray-750 transition">
                            <input 
                                type="file" 
                                accept="image/*" 
                                capture="environment"
                                onChange={e => completeForm.setData('proof_image', e.target.files[0])}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {completeForm.data.proof_image ? (
                                <div className="text-emerald-400 font-medium flex flex-col items-center">
                                    <CheckCircleIcon className="h-10 w-10 mb-2" />
                                    Foto Siap Diunggah
                                </div>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <CameraIcon className="h-10 w-10 mb-2 text-gray-500" />
                                    Ketuk untuk buka Kamera
                                </div>
                            )}
                        </div>
                        {completeForm.errors.proof_image && <p className="text-red-500 text-xs mt-2">{completeForm.errors.proof_image}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={completeForm.processing}
                        className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center transition shadow-lg shadow-emerald-900/50"
                    >
                        {completeForm.processing ? 'Menyelesaikan...' : 'Kirim & Selesaikan'}
                    </button>
                </form>
            </BottomSheet>

        </AuthenticatedLayout>
    );
}
