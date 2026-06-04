import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { ClipboardDocumentCheckIcon, CogIcon, PlayIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Kitchen({ auth, schedules }) {
    const [isHaccpOpen, setIsHaccpOpen] = useState(false);
    const [selectedMenu, setSelectedMenu] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        menu_schedule_id: '',
        sanitation_score: '',
        storage_temperature: '',
        cooking_standard_score: '',
        notes: '',
    });

    const openHaccpForm = (menu) => {
        setSelectedMenu(menu);
        setData('menu_schedule_id', menu.id);
        setIsHaccpOpen(true);
    };

    const submitHaccp = (e) => {
        e.preventDefault();
        post(route('kitchen.haccp'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsHaccpOpen(false);
                reset();
                alert('Formulir Mutu HACCP berhasil disimpan.');
            }
        });
    };

    const startProduction = (menuId) => {
        if(confirm('Mulai produksi akan memotong stok bahan baku dari gudang. Lanjutkan?')) {
            router.post(route('kitchen.produce'), { menu_schedule_id: menuId }, {
                preserveScroll: true,
                onSuccess: () => alert('Produksi berhasil dimulai! Stok telah dipotong.')
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Dasbor Manajer Dapur</h2>}
        >
            <Head title="Kitchen Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {schedules && schedules.length > 0 ? schedules.map((schedule) => (
                        <div key={schedule.id} className="bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-700">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-100 mb-1">{schedule.menu_name}</h3>
                                        <p className="text-gray-400 text-sm">{schedule.description}</p>
                                    </div>
                                    <div className="bg-gray-900 rounded-lg p-3 text-center border border-gray-700">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Target Produksi</p>
                                        <p className="text-2xl font-black text-blue-400">{schedule.total_portions} <span className="text-sm font-normal text-gray-400">Porsi</span></p>
                                    </div>
                                </div>

                                <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">Kebutuhan Bahan Baku</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {schedule.menu_ingredients.map((ingredient) => {
                                            const material = ingredient.raw_material_catalog;
                                            const required = ingredient.quantity_per_portion * schedule.total_portions;
                                            const isShort = required > material.current_stock;
                                            return (
                                                <div key={ingredient.id} className="bg-gray-800 p-3 rounded-md border border-gray-700">
                                                    <p className="text-sm text-gray-200 font-medium truncate" title={material.name}>{material.name}</p>
                                                    <p className={`text-lg font-bold ${isShort ? 'text-red-400' : 'text-gray-100'}`}>
                                                        {required} <span className="text-xs text-gray-500 font-normal">{material.unit_of_measurement}</span>
                                                    </p>
                                                    {isShort && <p className="text-xs text-red-500 mt-1">Stok kurang!</p>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 items-center justify-end border-t border-gray-700 pt-6">
                                    {schedule.status === 'completed' ? (
                                        <div className="flex items-center text-emerald-400 font-bold bg-emerald-900/30 px-6 py-3 rounded-xl border border-emerald-800/50">
                                            <CheckCircleIcon className="h-6 w-6 mr-2" /> Produksi Selesai
                                        </div>
                                    ) : schedule.status === 'producing' ? (
                                        <div className="flex items-center text-blue-400 font-bold bg-blue-900/30 px-6 py-3 rounded-xl border border-blue-800/50">
                                            <CogIcon className="h-6 w-6 mr-2 animate-spin" /> Sedang Diproduksi
                                        </div>
                                    ) : (
                                        <>
                                            {!schedule.haccp_checklist ? (
                                                <button 
                                                    onClick={() => openHaccpForm(schedule)}
                                                    className="w-full md:w-auto flex items-center justify-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-orange-900/50"
                                                >
                                                    <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" /> Isi Formulir Mutu HACCP
                                                </button>
                                            ) : (
                                                <div className="w-full md:w-auto flex flex-col md:flex-row items-center gap-4">
                                                    <span className="text-emerald-400 text-sm font-medium flex items-center">
                                                        <CheckCircleIcon className="h-5 w-5 mr-1" /> Mutu HACCP Tervalidasi
                                                    </span>
                                                    <button 
                                                        onClick={() => startProduction(schedule.id)}
                                                        className="w-full md:w-auto flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-blue-900/50"
                                                    >
                                                        <PlayIcon className="h-5 w-5 mr-2" /> Mulai Produksi
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-gray-500">
                            Tidak ada jadwal menu hari ini.
                        </div>
                    )}
                </div>
            </div>

            <BottomSheet 
                isOpen={isHaccpOpen} 
                onClose={() => setIsHaccpOpen(false)}
                title="Formulir Jaminan Mutu (HACCP)"
            >
                <form onSubmit={submitHaccp} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Skor Kebersihan Area (0-100)</label>
                        <input 
                            type="number" min="0" max="100"
                            value={data.sanitation_score}
                            onChange={(e) => setData('sanitation_score', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100"
                            required 
                        />
                        {errors.sanitation_score && <p className="text-red-500 text-xs mt-1">{errors.sanitation_score}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Suhu Ruang Penyimpanan (°C)</label>
                        <input 
                            type="number" step="0.1"
                            value={data.storage_temperature}
                            onChange={(e) => setData('storage_temperature', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100"
                            required 
                        />
                        {errors.storage_temperature && <p className="text-red-500 text-xs mt-1">{errors.storage_temperature}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Skor Standar Memasak (0-100)</label>
                        <input 
                            type="number" min="0" max="100"
                            value={data.cooking_standard_score}
                            onChange={(e) => setData('cooking_standard_score', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100"
                            required 
                        />
                        {errors.cooking_standard_score && <p className="text-red-500 text-xs mt-1">{errors.cooking_standard_score}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Catatan Tambahan (Opsional)</label>
                        <textarea 
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 h-24"
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/50 mt-4 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Kirim Laporan Mutu & Buka Produksi'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
