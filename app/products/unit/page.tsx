"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { Scale, Trash2 } from 'lucide-react';
import UnitForm from '@/components/products/UnitForm';
import { Toaster, toast } from 'sonner';
import { getUnits, createUnit, deleteUnit } from '@/services/productService';

export default function UnitMasterPage() {
    const [units, setUnits] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    useEffect(() => {
        fetchUnits();
    }, []);

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const data = await getUnits();
            setUnits(data);
        } catch (error) {
            toast.error('Failed to fetch units');
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const handleAddUnit = async (data: any) => {
        try {
            await createUnit(data);
            toast.success('Unit created successfully');
            setIsFormOpen(false);
            fetchUnits();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create unit');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this unit?')) return;
        try {
            await deleteUnit(id);
            toast.success('Unit deleted successfully');
            fetchUnits();
        } catch (error) {
            toast.error('Failed to delete unit');
        }
    };

    const filteredUnits = units.filter(unit =>
        unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        unit.short_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = units.filter(u => u.status === 'Active').length;
    const inactiveCount = units.filter(u => u.status === 'Inactive').length;

    return (
        <div className="w-full max-w-[1600px] mx-auto p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Unit Master"
                description="Manage measurement units"
                totalCount={units.length}
                addButtonLabel="Add Unit"
                onAdd={() => setIsFormOpen(true)}
                showBack={true}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Units"
                    value={units.length.toString()}
                    icon={<Scale size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Units"
                    value={activeCount.toString()}
                    icon={<Scale size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Units"
                    value={inactiveCount.toString()}
                    icon={<Scale size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Recently Added"
                    value={loading ? "..." : (units.length > 0 ? "Latest Available" : "0")}
                    icon={<Scale size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Measurement Units</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search units..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading units...</div>
                    ) : filteredUnits.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-sm font-semibold text-gray-600">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Short Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredUnits.map((unit) => (
                                    <tr key={unit._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{unit.name}</td>
                                        <td className="px-6 py-4 text-gray-600">{unit.short_name || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${unit.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {unit.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {!unit.slug && (
                                                <button
                                                    onClick={() => handleDelete(unit._id)}
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
                                <Scale size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Units Found</h3>
                            <p className="text-gray-500 max-w-md">
                                Start by defining a new measurement unit (e.g., kg, ltr, pcs) using the button above.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isFormOpen && (
                <UnitForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleAddUnit}
                />
            )}
        </div>
    );
}
