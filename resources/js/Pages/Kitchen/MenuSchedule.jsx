import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function MenuSchedule({ auth, schedules }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        menu_name: '',
        description: '',
        target_portions: '',
        status: 'draft',
    });

    const submitMenu = (e) => {
        e.preventDefault();
        post(route('kitchen.schedules.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert('Jadwal Menu berhasil ditambahkan.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Jadwal Menu & Resep</h2>}
        >
            <Head title="Jadwal Menu" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100">Daftar Menu Harian</h3>
                            <p className="text-sm text-gray-400 mt-1">Atur rencana masakan dan target porsi produksi</p>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-orange-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Tambah Jadwal
                            </button>
                        </div>
                    </div>

                    {/* Table List */}
                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Tanggal</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Nama Menu</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Target Porsi</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Status</th>
                                        <th className="px-6 py-4 text-right font-semibold text-gray-400">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {schedules.length > 0 ? schedules.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-gray-750 transition duration-150">
                                            <td className="px-6 py-4 text-gray-300 flex items-center">
                                                <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                {schedule.date}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-200">{schedule.menu_name}</div>
                                                <div className="text-gray-400 text-xs truncate max-w-xs">{schedule.description}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-emerald-400">{schedule.target_portions}</span>
                                                <span className="text-gray-500 ml-1 text-xs">Porsi</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    schedule.status === 'selesai' ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' :
                                                    schedule.status === 'produksi' ? 'bg-orange-900 text-orange-300 border border-orange-700' :
                                                    'bg-gray-700 text-gray-300 border border-gray-600'
                                                }`}>
                                                    {schedule.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-blue-400 hover:text-blue-300 font-medium text-sm">Resep</button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                <ClockIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                                Belum ada jadwal menu yang direncanakan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Tambah Jadwal */}
            <BottomSheet 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Tambah Jadwal Menu Baru"
            >
                <form onSubmit={submitMenu} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tanggal Eksekusi</label>
                        <input 
                            type="date" 
                            value={data.date}
                            onChange={(e) => setData('date', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            required 
                        />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Menu Lengkap</label>
                        <input 
                            type="text" 
                            value={data.menu_name}
                            onChange={(e) => setData('menu_name', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            placeholder="Nasi Uduk + Ayam Goreng Lengkuas"
                            required 
                        />
                        {errors.menu_name && <p className="text-red-500 text-xs mt-1">{errors.menu_name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Target Porsi</label>
                        <input 
                            type="number" 
                            min="1"
                            value={data.target_portions}
                            onChange={(e) => setData('target_portions', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            placeholder="Contoh: 1500"
                            required 
                        />
                        {errors.target_portions && <p className="text-red-500 text-xs mt-1">{errors.target_portions}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi Tambahan</label>
                        <textarea 
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            rows="2"
                            placeholder="Khusus tanpa sambal untuk SD 1..."
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition shadow-lg shadow-orange-900/50 mt-6 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Jadwal'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
