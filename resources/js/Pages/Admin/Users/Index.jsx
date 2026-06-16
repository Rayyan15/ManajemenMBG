import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, UserIcon, IdentificationIcon } from '@heroicons/react/24/outline';

export default function UserIndex({ auth, users }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'driver',
    });

    const submitUser = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert('Akun karyawan berhasil ditambahkan.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Manajemen Karyawan</h2>}
        >
            <Head title="Manajemen Karyawan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100">Daftar Akun Karyawan</h3>
                            <p className="text-sm text-gray-400 mt-1">Kelola akses untuk staf dapur, kurir, dan guru.</p>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-blue-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Tambah Karyawan
                            </button>
                        </div>
                    </div>

                    {/* Table List */}
                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Nama</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Email</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Peran (Role)</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {users.length > 0 ? users.map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-750 transition duration-150">
                                            <td className="px-6 py-4 text-gray-200 font-bold flex items-center">
                                                <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                {u.name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    u.role === 'admin' ? 'bg-purple-900 text-purple-300 border border-purple-700' :
                                                    u.role === 'kitchen_manager' ? 'bg-orange-900 text-orange-300 border border-orange-700' :
                                                    u.role === 'driver' ? 'bg-blue-900 text-blue-300 border border-blue-700' :
                                                    'bg-gray-700 text-gray-300 border border-gray-600'
                                                }`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-emerald-400 font-medium">Aktif</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                                <IdentificationIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                                Belum ada data karyawan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Modal Tambah Karyawan */}
            <BottomSheet 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title="Buat Akun Karyawan Baru"
            >
                <form onSubmit={submitUser} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="John Doe"
                            required 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            placeholder="karyawan@mbg.id"
                            required 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Kata Sandi (Password)</label>
                            <input 
                                type="password" 
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                                required 
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Peran (Role)</label>
                            <select 
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="driver">Kurir (Driver)</option>
                                <option value="kitchen_manager">Manajer Dapur</option>
                                <option value="teacher">Guru</option>
                                <option value="admin">Admin Yayasan</option>
                            </select>
                            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition shadow-lg shadow-blue-900/50 mt-6 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Akun Karyawan'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
