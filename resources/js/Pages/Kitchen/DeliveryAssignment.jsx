import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, MapPinIcon, TruckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function DeliveryAssignment({ auth, assignments, menus, schools, drivers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        driver_id: '',
        partner_school_id: '',
        menu_schedule_id: '',
    });

    const submitAssignment = (e) => {
        e.preventDefault();
        post(route('kitchen.assignments.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert('Penugasan berhasil dikirim ke Kurir.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Penugasan Kurir</h2>}
        >
            <Head title="Penugasan Kurir" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100">Daftar Jadwal Pengiriman</h3>
                            <p className="text-sm text-gray-400 mt-1">Atur kurir yang bertugas untuk mengantar makanan ke sekolah.</p>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-orange-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Buat Penugasan
                            </button>
                        </div>
                    </div>

                    {/* Table List */}
                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Sekolah Tujuan</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Kurir Bertugas</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Menu & Tanggal</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {assignments.length > 0 ? assignments.map((assign) => (
                                        <tr key={assign.id} className="hover:bg-gray-750 transition duration-150">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-100 flex items-center">
                                                    <MapPinIcon className="h-5 w-5 mr-2 text-emerald-500" />
                                                    {assign.partner_school.name}
                                                </div>
                                                <div className="text-gray-400 text-xs mt-1 pl-7">{assign.partner_school.address}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-orange-400 flex items-center">
                                                    <TruckIcon className="h-4 w-4 mr-2" /> {assign.driver.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-200">{assign.menu_schedule.menu_name}</div>
                                                <div className="text-gray-500 text-xs">{assign.menu_schedule.date}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    assign.status === 'delivered' ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' :
                                                    assign.status === 'delivering' ? 'bg-blue-900 text-blue-300 border border-blue-700' :
                                                    'bg-gray-700 text-gray-300 border border-gray-600'
                                                }`}>
                                                    {assign.status.toUpperCase()}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                <DocumentTextIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                                Belum ada penugasan kurir.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Tambah Penugasan */}
            <BottomSheet 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Tugaskan Kurir Baru"
            >
                <form onSubmit={submitAssignment} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Sekolah Tujuan</label>
                        <select 
                            value={data.partner_school_id}
                            onChange={(e) => setData('partner_school_id', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            required
                        >
                            <option value="" disabled>-- Pilih Sekolah --</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                        {errors.partner_school_id && <p className="text-red-500 text-xs mt-1">{errors.partner_school_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Siklus Menu</label>
                        <select 
                            value={data.menu_schedule_id}
                            onChange={(e) => setData('menu_schedule_id', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            required
                        >
                            <option value="" disabled>-- Pilih Jadwal Menu --</option>
                            {menus.map(menu => (
                                <option key={menu.id} value={menu.id}>{menu.menu_name} ({menu.date})</option>
                            ))}
                        </select>
                        {errors.menu_schedule_id && <p className="text-red-500 text-xs mt-1">{errors.menu_schedule_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Pilih Kurir (Driver)</label>
                        <select 
                            value={data.driver_id}
                            onChange={(e) => setData('driver_id', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            required
                        >
                            <option value="" disabled>-- Pilih Kurir --</option>
                            {drivers.map(driver => (
                                <option key={driver.id} value={driver.id}>{driver.name}</option>
                            ))}
                        </select>
                        {errors.driver_id && <p className="text-red-500 text-xs mt-1">{errors.driver_id}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition shadow-lg shadow-orange-900/50 mt-6 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Kirim Penugasan'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
