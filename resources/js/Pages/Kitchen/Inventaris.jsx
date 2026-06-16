import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, CubeIcon, ExclamationTriangleIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

export default function Inventaris({ auth, materials, categories }) {
    const [activeTab, setActiveTab] = useState('bahan');
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [search, setSearch] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        category: 'Lainnya',
        sku: '',
        unit_of_measurement: 'kg',
        current_stock: 0,
    });

    const submitAddStock = (e) => {
        e.preventDefault();
        post(route('kitchen.inventory.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
                alert('Bahan baku berhasil ditambahkan.');
            }
        });
    };

    const filteredMaterials = materials.filter(m => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.sku.toLowerCase().includes(search.toLowerCase());
        const matchCategory = activeCategory === 'Semua' || m.category === activeCategory;
        return matchSearch && matchCategory;
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Inventaris Stok</h2>}
        >
            <Head title="Inventaris Stok" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-sm">
                        <div className="flex space-x-2 bg-gray-900 p-1 rounded-lg border border-gray-700">
                            <button 
                                onClick={() => setActiveTab('bahan')}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'bahan' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Bahan Pangan
                            </button>
                            <button 
                                onClick={() => setActiveTab('alat')}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition ${activeTab === 'alat' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-200'}`}
                            >
                                Peralatan (Aset)
                            </button>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-6 rounded-xl transition shadow-lg shadow-orange-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Tambah Bahan Baru
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    {activeTab === 'bahan' && (
                        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                            {/* Filter & Search Bar */}
                            <div className="p-4 border-b border-gray-700 bg-gray-800/50 space-y-4">
                                <input 
                                    type="text" 
                                    placeholder="Cari nama bahan atau SKU..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-gray-100 focus:border-blue-500 focus:ring-blue-500 transition"
                                />
                                
                                {/* Chips Filter */}
                                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {categories.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setActiveCategory(cat)}
                                            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition border ${
                                                activeCategory === cat 
                                                ? 'bg-orange-600 border-orange-500 text-white' 
                                                : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Table List */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-700 text-sm">
                                    <thead className="bg-gray-900">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-400">SKU</th>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-400">Nama Bahan</th>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-400">Kategori</th>
                                            <th className="px-6 py-4 text-left font-semibold text-gray-400">Sisa Stok</th>
                                            <th className="px-6 py-4 text-right font-semibold text-gray-400">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700 bg-gray-800">
                                        {filteredMaterials.length > 0 ? filteredMaterials.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-750 transition duration-150">
                                                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{item.sku}</td>
                                                <td className="px-6 py-4 font-bold text-gray-200">{item.name}</td>
                                                <td className="px-6 py-4 text-gray-400">
                                                    <span className="px-2 py-1 bg-gray-900 border border-gray-700 rounded text-xs">{item.category}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-bold ${item.current_stock < 10 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                        {item.current_stock}
                                                    </span>
                                                    <span className="text-gray-500 ml-1 text-xs">{item.unit_of_measurement}</span>
                                                    {item.current_stock < 10 && <ExclamationTriangleIcon className="h-4 w-4 text-red-500 inline ml-2" />}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-blue-400 hover:text-blue-300 font-medium text-sm mr-4">Edit</button>
                                                    <button className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">+ Stok Masuk</button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                                    <CubeIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                                    Tidak ada bahan baku yang ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'alat' && (
                        <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 p-12 text-center text-gray-500">
                            <CubeIcon className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                            Modul Inventaris Peralatan (Aset Tetap) belum diaktifkan.
                        </div>
                    )}

                </div>
            </div>

            {/* Modal Tambah Bahan Baru */}
            <BottomSheet 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)}
                title="Tambah Katalog Bahan Baru"
            >
                <form onSubmit={submitAddStock} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Bahan</label>
                        <input 
                            type="text" 
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            required 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Kode SKU</label>
                            <input 
                                type="text" 
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 font-mono text-sm focus:border-orange-500 focus:ring-orange-500"
                                placeholder="CTH-001"
                                required 
                            />
                            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Satuan Ukur</label>
                            <select 
                                value={data.unit_of_measurement}
                                onChange={(e) => setData('unit_of_measurement', e.target.value)}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                            >
                                <option value="kg">Kilogram (kg)</option>
                                <option value="gram">Gram (g)</option>
                                <option value="liter">Liter (L)</option>
                                <option value="ml">Mililiter (ml)</option>
                                <option value="pcs">Pieces (pcs)</option>
                            </select>
                            {errors.unit_of_measurement && <p className="text-red-500 text-xs mt-1">{errors.unit_of_measurement}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Kategori</label>
                        <select 
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                        >
                            {categories.filter(c => c !== 'Semua').map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Stok Awal (Opsional)</label>
                        <input 
                            type="number" 
                            min="0"
                            step="0.1"
                            value={data.current_stock}
                            onChange={(e) => setData('current_stock', e.target.value)}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                        />
                        {errors.current_stock && <p className="text-red-500 text-xs mt-1">{errors.current_stock}</p>}
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="w-full h-14 flex justify-center items-center bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition shadow-lg shadow-orange-900/50 mt-4 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Bahan Baku'}
                    </button>
                </form>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
