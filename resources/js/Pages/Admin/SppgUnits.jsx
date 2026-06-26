import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, BuildingStorefrontIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function SppgUnits({ auth, units }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        address: '',
        capacity: '',
    });

    const submitUnit = (e) => {
        e.preventDefault();
        post(route('admin.sppg-units.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert('Unit SPPG (Dapur) berhasil ditambahkan.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Master SPPG (Dapur)</h2>}
        >
            <Head title="Master SPPG" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100">Daftar Cabang SPPG</h3>
                            <p className="text-sm text-gray-400 mt-1">Kelola unit dapur produksi di bawah Yayasan Anda</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-blue-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Tambah Unit
                            </button>
                        </div>
                    </div>

                    {units.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {units.map(unit => (
                                <div key={unit.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                    <div className="p-5 border-b border-gray-700 flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="bg-blue-900/50 p-2 rounded-lg text-blue-400 mr-3">
                                                <BuildingStorefrontIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-100 text-lg">{unit.name}</h4>
                                                <div className="text-xs text-gray-400 flex items-center mt-1">
                                                    <UsersIcon className="h-3 w-3 mr-1" /> Kapasitas: {unit.capacity} porsi/hari
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-800/50 space-y-2">
                                        <div className="flex items-start text-sm">
                                            <MapPinIcon className="h-4 w-4 text-gray-500 mr-2 mt-0.5 shrink-0" />
                                            <span className="text-gray-300">{unit.address}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-12 text-center text-gray-500">
                            <BuildingStorefrontIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                            Belum ada Unit SPPG yang didaftarkan.
                        </div>
                    )}

                </div>
            </div>

            <BottomSheet 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Daftarkan Unit SPPG Baru"
            >
                <form onSubmit={submitUnit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Unit (Dapur)</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Dapur Sentral Jakarta"
                            required 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Kapasitas Porsi / Hari</label>
                        <input 
                            type="number" 
                            min="1"
                            value={data.capacity}
                            onChange={(e) => setData('capacity', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="Contoh: 1000"
                            required 
                        />
                        {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Alamat Dapur</label>
                        <textarea 
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            rows="2"
                            required
                        ></textarea>
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/50 mt-6 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Data Dapur'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
