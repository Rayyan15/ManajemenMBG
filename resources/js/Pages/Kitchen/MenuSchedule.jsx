import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, CalendarDaysIcon, ClockIcon, ArrowRightIcon, BeakerIcon, FireIcon, HandRaisedIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function MenuSchedule({ auth, schedules, sppgUnits }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('kanban'); // 'table' or 'kanban'

    const { data, setData, post, processing, errors, reset } = useForm({
        sppg_unit_id: '',
        date: '',
        menu_name: '',
        description: '',
        target_portions: '',
        status: 'draft',
        batch_number: '',
        cooking_status: 'preparation',
    });

    const submitMenu = (e) => {
        e.preventDefault();
        post(route('kitchen.schedules.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert('Jadwal/Batch Produksi berhasil ditambahkan.');
            }
        });
    };

    // Update Status Action (simulated via put if we had an endpoint, but since we didn't define a dedicated endpoint for cooking_status, we will just use a generic update or rely on a standard resource update)
    // For now, since we only have resource methods, we should probably add a quick way to update cooking_status or we can just instruct the user it's for display in Phase 3 until API is fully wired. Let's assume there's a generic update or we can't update directly yet.

    const columns = [
        { id: 'preparation', title: 'Preparation', icon: BeakerIcon, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-700', next: 'cooking' },
        { id: 'cooking', title: 'Cooking', icon: FireIcon, color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-700', next: 'packaging' },
        { id: 'packaging', title: 'Packaging', icon: HandRaisedIcon, color: 'text-purple-400', bg: 'bg-purple-900/20', border: 'border-purple-700', next: 'ready' },
        { id: 'ready', title: 'Ready for Delivery', icon: CheckBadgeIcon, color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-700', next: null },
    ];

    const moveStatus = (id, nextStatus) => {
        if (!nextStatus) return;
        router.patch(route('kitchen.schedules.updateStatus', id), {
            cooking_status: nextStatus
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Perencanaan & Kanban Produksi</h2>}
        >
            <Head title="Kanban Produksi" />

            <div className="py-8">
                <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100">Kanban Board Dapur</h3>
                            <p className="text-sm text-gray-400 mt-1">Pantau status produksi batch makanan dari persiapan hingga siap kirim</p>
                        </div>

                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-orange-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Rencanakan Batch
                            </button>
                        </div>
                    </div>

                    {/* KANBAN BOARD */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {columns.map(col => {
                            const colItems = schedules.filter(s => s.cooking_status === col.id);
                            return (
                                <div key={col.id} className="flex flex-col h-full">
                                    <div className={`p-4 rounded-t-xl border-t border-x border-gray-700 ${col.bg} flex items-center justify-between`}>
                                        <div className="flex items-center">
                                            <col.icon className={`h-6 w-6 mr-2 ${col.color}`} />
                                            <h4 className="font-bold text-gray-200">{col.title}</h4>
                                        </div>
                                        <span className="bg-gray-800 text-gray-300 text-xs font-bold px-2 py-1 rounded-full">{colItems.length}</span>
                                    </div>
                                    <div className="bg-gray-900/50 border-x border-b border-gray-700 rounded-b-xl p-4 flex-1 min-h-[500px] space-y-4">
                                        {colItems.map(item => (
                                            <div key={item.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl shadow-sm hover:border-gray-500 cursor-pointer transition">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded border ${col.border} ${col.color} bg-gray-900`}>
                                                        Batch: {item.batch_number || '-'}
                                                    </span>
                                                    <span className="text-gray-400 text-xs">{item.serving_date}</span>
                                                </div>
                                                <h5 className="font-bold text-gray-100 text-lg mb-1">{item.menu_name}</h5>
                                                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>
                                                
                                                <div className="flex justify-between items-center pt-3 border-t border-gray-700 mt-2">
                                                    <div className="text-sm">
                                                        <span className="text-emerald-400 font-bold">{item.total_portions}</span>
                                                        <span className="text-gray-500 ml-1">Porsi</span>
                                                    </div>
                                                    {col.next && (
                                                        <button 
                                                            onClick={() => moveStatus(item.id, col.next)}
                                                            className="text-gray-400 hover:text-white transition bg-gray-700 p-1.5 rounded-lg hover:bg-gray-600" 
                                                            title="Pindah ke Tahap Selanjutnya"
                                                        >
                                                            <ArrowRightIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        {colItems.length === 0 && (
                                            <div className="h-full flex flex-col items-center justify-center text-gray-500 py-10">
                                                <span className="text-sm">Kosong</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </div>

            <BottomSheet 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Rencanakan Batch Produksi Baru"
            >
                <form onSubmit={submitMenu} className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Dapur (SPPG)</label>
                            <select 
                                value={data.sppg_unit_id}
                                onChange={(e) => setData('sppg_unit_id', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                required
                            >
                                <option value="" disabled>-- Pilih Dapur --</option>
                                {sppgUnits && sppgUnits.map(unit => (
                                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                                ))}
                            </select>
                            {errors.sppg_unit_id && <p className="text-red-500 text-xs mt-1">{errors.sppg_unit_id}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Tanggal Penyajian</label>
                            <input 
                                type="date" 
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                required 
                            />
                            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nama Menu Lengkap</label>
                            <input 
                                type="text" 
                                value={data.menu_name}
                                onChange={(e) => setData('menu_name', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="Nasi Ayam Geprek"
                                required 
                            />
                            {errors.menu_name && <p className="text-red-500 text-xs mt-1">{errors.menu_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nomor Batch (Opsional)</label>
                            <input 
                                type="text" 
                                value={data.batch_number}
                                onChange={(e) => setData('batch_number', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="BATCH-01A"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Target Porsi</label>
                            <input 
                                type="number" 
                                min="1"
                                value={data.target_portions}
                                onChange={(e) => setData('target_portions', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                placeholder="1000"
                                required 
                            />
                            {errors.target_portions && <p className="text-red-500 text-xs mt-1">{errors.target_portions}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status Kanban Awal</label>
                            <select 
                                value={data.cooking_status}
                                onChange={(e) => setData('cooking_status', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="preparation">Preparation (Persiapan)</option>
                                <option value="cooking">Cooking (Sedang Dimasak)</option>
                                <option value="packaging">Packaging (Pengemasan)</option>
                                <option value="ready">Ready (Siap Kirim)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Catatan Khusus</label>
                        <textarea 
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            rows="2"
                        ></textarea>
                    </div>

                    <div className="bg-orange-900/20 border border-orange-500/50 p-4 rounded-xl flex items-start space-x-3 mt-4">
                        <BeakerIcon className="h-6 w-6 text-orange-400 shrink-0 mt-0.5" />
                        <div>
                            <h5 className="font-bold text-orange-400 text-sm">Smart Calculation Aktif</h5>
                            <p className="text-xs text-orange-200/70 mt-1">Sistem akan secara otomatis menghitung prediksi kebutuhan bahan baku (beras, sayur, lauk) di background berdasarkan target porsi ini.</p>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition shadow-lg shadow-orange-900/50 mt-6 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan ke Kanban'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
