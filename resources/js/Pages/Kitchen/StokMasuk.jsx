import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import BottomSheet from '@/Components/BottomSheet';
import { PlusIcon, ShoppingCartIcon, CheckCircleIcon, CurrencyDollarIcon, TagIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function StokMasuk({ auth, movements, materials, suppliers, sppgUnits }) {
    const [isPOModalOpen, setIsPOModalOpen] = useState(false);
    const [poStep, setPoStep] = useState(1);

    const { data, setData, post, processing, errors, reset } = useForm({
        sppg_unit_id: '',
        supplier_id: '',
        raw_material_catalog_id: '',
        quantity: '',
        unit_price: '',
        is_taxed: false,
        notes: '',
    });

    const submitPO = (e) => {
        e.preventDefault();
        post(route('kitchen.stok-masuk.store'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsPOModalOpen(false);
                setPoStep(1);
                reset();
                alert('Purchase Order berhasil diajukan.');
            }
        });
    };

    const nextStep = () => {
        if (!data.sppg_unit_id || !data.supplier_id) {
            alert('Silakan pilih Dapur (SPPG) dan Supplier terlebih dahulu.');
            return;
        }
        setPoStep(2);
    };

    const calculateTotal = () => {
        let total = (parseFloat(data.quantity) || 0) * (parseFloat(data.unit_price) || 0);
        if (data.is_taxed) {
            total = total * 1.11;
        }
        return total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-100 leading-tight">Stok Masuk (PO)</h2>}
        >
            <Head title="Stok Masuk & Purchase Order" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-sm">
                        <div>
                            <h3 className="text-xl font-bold text-gray-100">Riwayat Pembelian & Stok Masuk</h3>
                            <p className="text-sm text-gray-400 mt-1">Lacak seluruh item yang masuk dan PO yang diajukan</p>
                        </div>

                        <div className="mt-4 md:mt-0">
                            <button 
                                onClick={() => { setIsPOModalOpen(true); setPoStep(1); reset(); }}
                                className="flex items-center bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-orange-900/50"
                            >
                                <PlusIcon className="h-5 w-5 mr-2" /> Buat PO Baru
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl shadow-sm border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-700 text-sm">
                                <thead className="bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">PO Ref</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Tanggal</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Supplier</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Bahan Baku</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Kuantitas</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Total Harga</th>
                                        <th className="px-6 py-4 text-left font-semibold text-gray-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700 bg-gray-800">
                                    {movements.length > 0 ? movements.map((mov) => (
                                        <tr key={mov.id} className="hover:bg-gray-750 transition duration-150">
                                            <td className="px-6 py-4 text-orange-400 font-mono font-bold text-xs">{mov.reference_number}</td>
                                            <td className="px-6 py-4 text-gray-300">{mov.date}</td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {mov.supplier ? mov.supplier.name : '-'}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-200">
                                                {mov.raw_material_catalog ? mov.raw_material_catalog.name : 'Unknown'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-emerald-400">+{mov.quantity}</span>
                                                <span className="text-gray-500 ml-1 text-xs">
                                                    {mov.raw_material_catalog ? mov.raw_material_catalog.unit_of_measurement : ''}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {mov.total_price ? `Rp ${Number(mov.total_price).toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {mov.approval_status === 'approved' ? (
                                                    <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-lg font-bold">Disetujui</span>
                                                ) : mov.approval_status === 'rejected' ? (
                                                    <span className="px-2 py-1 bg-red-900/50 text-red-400 text-xs rounded-lg font-bold">Ditolak</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded-lg font-bold">Menunggu</span>
                                                )}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                <ShoppingCartIcon className="h-12 w-12 mx-auto mb-3 text-gray-600" />
                                                Belum ada riwayat stok masuk.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <BottomSheet 
                isOpen={isPOModalOpen} 
                onClose={() => setIsPOModalOpen(false)}
                title="Purchase Order (PO) Bahan Baku"
            >
                <div className="p-4">
                    <div className="flex items-center justify-between mb-6 relative">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-700 -z-10"></div>
                        
                        <div className={`flex flex-col items-center ${poStep >= 1 ? 'text-orange-500' : 'text-gray-500'}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-4 border-gray-900 ${poStep >= 1 ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>1</div>
                            <span className="text-xs mt-1 font-bold bg-gray-900 px-1">Supplier</span>
                        </div>
                        
                        <div className={`flex flex-col items-center ${poStep >= 2 ? 'text-orange-500' : 'text-gray-500'}`}>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold border-4 border-gray-900 ${poStep >= 2 ? 'bg-orange-500 text-white' : 'bg-gray-700'}`}>2</div>
                            <span className="text-xs mt-1 font-bold bg-gray-900 px-1">Pesanan</span>
                        </div>
                    </div>

                    <form onSubmit={submitPO} className="space-y-4">
                        {poStep === 1 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h4 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
                                    <TruckIcon className="h-5 w-5 mr-2 text-orange-500" /> Pilih Tujuan & Supplier
                                </h4>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Dapur (SPPG) Tujuan</label>
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
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Supplier Bahan Baku</label>
                                    <select 
                                        value={data.supplier_id}
                                        onChange={(e) => setData('supplier_id', e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="" disabled>-- Pilih Supplier --</option>
                                        {suppliers && suppliers.map(sup => (
                                            <option key={sup.id} value={sup.id}>{sup.name}</option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>}
                                </div>

                                <button 
                                    type="button" 
                                    onClick={nextStep}
                                    className="w-full h-14 flex justify-center items-center bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold transition mt-6"
                                >
                                    Lanjut ke Detail Item
                                </button>
                            </div>
                        )}

                        {poStep === 2 && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <h4 className="text-lg font-bold text-gray-200 mb-4 flex items-center">
                                    <ShoppingCartIcon className="h-5 w-5 mr-2 text-orange-500" /> Detail Item & Harga
                                </h4>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Bahan Baku</label>
                                    <select 
                                        value={data.raw_material_catalog_id}
                                        onChange={(e) => setData('raw_material_catalog_id', e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="" disabled>-- Pilih Bahan --</option>
                                        {materials.map(mat => (
                                            <option key={mat.id} value={mat.id}>{mat.name} ({mat.sku}) - Satuan: {mat.unit_of_measurement}</option>
                                        ))}
                                    </select>
                                    {errors.raw_material_catalog_id && <p className="text-red-500 text-xs mt-1">{errors.raw_material_catalog_id}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Kuantitas</label>
                                        <input 
                                            type="number" 
                                            min="0.1"
                                            step="0.1"
                                            value={data.quantity}
                                            onChange={(e) => setData('quantity', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="50"
                                            required 
                                        />
                                        {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Harga Satuan (Rp)</label>
                                        <input 
                                            type="number" 
                                            min="0"
                                            value={data.unit_price}
                                            onChange={(e) => setData('unit_price', e.target.value)}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-100 focus:border-orange-500 focus:ring-orange-500"
                                            placeholder="15000"
                                            required 
                                        />
                                        {errors.unit_price && <p className="text-red-500 text-xs mt-1">{errors.unit_price}</p>}
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center">
                                    <input 
                                        type="checkbox" 
                                        checked={data.is_taxed}
                                        onChange={(e) => setData('is_taxed', e.target.checked)}
                                        className="h-5 w-5 rounded bg-gray-900 border-gray-700 text-orange-600 focus:ring-orange-600"
                                        id="tax"
                                    />
                                    <label htmlFor="tax" className="ml-2 block text-sm text-gray-300">
                                        Termasuk PPN 11%
                                    </label>
                                </div>

                                <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Estimasi Total Pembayaran:</span>
                                        <span className="text-xl font-bold text-orange-400">{calculateTotal()}</span>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-6">
                                    <button 
                                        type="button" 
                                        onClick={() => setPoStep(1)}
                                        className="w-1/3 h-14 flex justify-center items-center bg-gray-800 border border-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold transition"
                                    >
                                        Kembali
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-2/3 h-14 flex justify-center items-center bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold transition shadow-lg shadow-orange-900/50 disabled:opacity-50"
                                    >
                                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                                        {processing ? 'Mengajukan...' : 'Ajukan PO'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </BottomSheet>
        </AuthenticatedLayout>
    );
}
