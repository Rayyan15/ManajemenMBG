import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function SuperAdmin({ auth, tenants }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        admin_name: '',
        admin_email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('super.tenants.store'), {
            onSuccess: () => {
                reset();
                alert('Yayasan berhasil didaftarkan dan database telah disiapkan.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Dasbor Super Admin (Sentral)</h2>}
        >
            <Head title="Super Admin Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-gray-100 mb-4">Daftarkan Yayasan Baru</h3>
                        <form onSubmit={submit} className="space-y-4 max-w-xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-300">ID Yayasan (Tanpa Spasi)</label>
                                <input
                                    type="text"
                                    value={data.id}
                                    onChange={e => setData('id', e.target.value)}
                                    className="mt-1 block w-full bg-gray-900 border-gray-700 text-white rounded-md"
                                    placeholder="contoh: yayasan-bina-bangsa"
                                />
                                {errors.id && <div className="text-red-500 text-sm mt-1">{errors.id}</div>}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300">Nama Lengkap Admin Yayasan</label>
                                <input
                                    type="text"
                                    value={data.admin_name}
                                    onChange={e => setData('admin_name', e.target.value)}
                                    className="mt-1 block w-full bg-gray-900 border-gray-700 text-white rounded-md"
                                />
                                {errors.admin_name && <div className="text-red-500 text-sm mt-1">{errors.admin_name}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300">Email Admin Yayasan</label>
                                <input
                                    type="email"
                                    value={data.admin_email}
                                    onChange={e => setData('admin_email', e.target.value)}
                                    className="mt-1 block w-full bg-gray-900 border-gray-700 text-white rounded-md"
                                />
                                {errors.admin_email && <div className="text-red-500 text-sm mt-1">{errors.admin_email}</div>}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-semibold"
                            >
                                {processing ? 'Memproses...' : 'Daftarkan & Buat Database'}
                            </button>
                        </form>
                    </div>

                    <div className="bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-700 p-6">
                        <h3 className="text-lg font-bold text-gray-100 mb-4">Daftar Yayasan (Tenants)</h3>
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-900 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tenant ID</th>
                                    <th className="px-6 py-3 bg-gray-900 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Dibuat Pada</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {tenants.map(tenant => (
                                    <tr key={tenant.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{tenant.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(tenant.created_at).toLocaleDateString('id-ID')}</td>
                                    </tr>
                                ))}
                                {tenants.length === 0 && (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">Belum ada yayasan terdaftar.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
