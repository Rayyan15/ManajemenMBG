import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, TruckIcon, MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Suppliers({ auth, suppliers }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        contact_person: '',
        phone: '',
        address: '',
    });

    const submitSupplier = (e) => {
        e.preventDefault();
        post(route('admin.suppliers.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert('Supplier berhasil ditambahkan.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Master Supplier</h2>}
        >
            <Head title="Master Supplier" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100">Daftar Supplier Bahan Baku</h3>
                            <p className="text-sm text-gray-400 mt-1">Kelola pemasok bahan baku dapur Anda</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-blue-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Tambah Supplier
                            </button>
                        </div>
                    </div>

                    {suppliers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {suppliers.map(supplier => (
                                <div key={supplier.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                                    <div className="p-5 border-b border-gray-700 flex justify-between items-start">
                                        <div className="flex items-center">
                                            <div className="bg-blue-900/50 p-2 rounded-lg text-blue-400 mr-3">
                                                <TruckIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-100 text-lg">{supplier.name}</h4>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-gray-800/50 space-y-3">
                                        <div className="flex items-start text-sm text-gray-300">
                                            <UserIcon className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                                            PIC: {supplier.contact_person}
                                        </div>
                                        <div className="flex items-start text-sm text-gray-300">
                                            <PhoneIcon className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                                            {supplier.phone}
                                        </div>
                                        <div className="flex items-start text-sm text-gray-300">
                                            <MapPinIcon className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                                            {supplier.address}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-12 text-center text-gray-500">
                            <TruckIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                            Belum ada Supplier yang didaftarkan.
                        </div>
                    )}

                </div>
            </div>

            <BottomSheet 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Daftarkan Supplier Baru"
            >
                <form onSubmit={submitSupplier} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Perusahaan/Toko</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="PT Sayur Segar"
                            required 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Nama PIC</label>
                            <input 
                                type="text" 
                                value={data.contact_person}
                                onChange={(e) => setData('contact_person', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.contact_person && <p className="text-red-500 text-xs mt-1">{errors.contact_person}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">No HP</label>
                            <input 
                                type="text" 
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Alamat Supplier</label>
                        <textarea 
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            rows="2"
                        ></textarea>
                        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/50 mt-6 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Data Supplier'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
