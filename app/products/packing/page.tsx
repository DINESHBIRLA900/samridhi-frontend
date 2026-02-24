"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { Box, Trash2 } from 'lucide-react';
import PackingForm from '@/components/products/PackingForm';
import { Toaster, toast } from 'sonner';
import { getPackings, createPacking, deletePacking } from '@/services/productService';

export default function PackingPage() {
    const [packings, setPackings] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    useEffect(() => {
        fetchPackings();
    }, []);

    const fetchPackings = async () => {
        try {
            setLoading(true);
            const data = await getPackings();
            setPackings(data);
        } catch (error) {
            toast.error('Failed to fetch packings');
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const handleAddPacking = async (data: any) => {
        try {
            await createPacking(data);
            toast.success('Packing created successfully');
            setIsFormOpen(false);
            fetchPackings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create packing');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this packing size?')) return;
        try {
            await deletePacking(id);
            toast.success('Packing deleted successfully');
            fetchPackings();
        } catch (error) {
            toast.error('Failed to delete packing');
        }
    };

    const filteredPackings = packings.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = packings.filter(u => u.status === 'Active').length;
    const inactiveCount = packings.filter(u => u.status === 'Inactive').length;

    return (
        <div className="w-full max-w-[1600px] mx-auto p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Packing Management"
                description="Manage product packing sizes"
                totalCount={packings.length}
                addButtonLabel="Add Packing"
                onAdd={() => setIsFormOpen(true)}
                showBack={true}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Packing"
                    value={packings.length.toString()}
                    icon={<Box size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Packing"
                    value={activeCount.toString()}
                    icon={<Box size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Packing"
                    value={inactiveCount.toString()}
                    icon={<Box size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Recently Added"
                    value={loading ? "..." : (packings.length > 0 ? "Latest Available" : "0")}
                    icon={<Box size={24} />}
                    color="#8b5cf6"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Packing Sizes</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search packing sizes..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading packings...</div>
                    ) : filteredPackings.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-sm font-semibold text-gray-600">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPackings.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!item.slug && (
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                            <div className="p-4 rounded-full bg-orange-50 mb-4 text-orange-600">
                                <Box size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Packing Found</h3>
                            <p className="text-gray-500 max-w-md">
                                Start by defining a new packing size using the button above.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {isFormOpen && (
                <PackingForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleAddPacking}
                />
            )}
        </div>
    );
}
