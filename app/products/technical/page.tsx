"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { ClipboardList, Trash2, Edit } from 'lucide-react';
import TechnicalForm from '@/components/products/TechnicalForm';
import { Toaster, toast } from 'sonner';
import { getTechnicals, createTechnical, updateTechnical, deleteTechnical } from '@/services/productService';

export default function TechnicalListPage() {
    const [technicals, setTechnicals] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTechnical, setEditingTechnical] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    useEffect(() => {
        fetchTechnicals();
    }, []);

    const fetchTechnicals = async () => {
        try {
            setLoading(true);
            const data = await getTechnicals();
            setTechnicals(data);
        } catch (error) {
            toast.error('Failed to fetch technical items');
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const handleSaveTechnical = async (data: any) => {
        try {
            if (editingTechnical) {
                await updateTechnical(editingTechnical._id, data);
                toast.success('Technical item updated successfully');
            } else {
                await createTechnical(data);
                toast.success('Technical item created successfully');
            }
            setIsFormOpen(false);
            setEditingTechnical(null);
            fetchTechnicals();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save technical item');
        }
    };

    const handleEdit = (tech: any) => {
        setEditingTechnical(tech);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this technical item?')) return;
        try {
            await deleteTechnical(id);
            toast.success('Technical item deleted successfully');
            fetchTechnicals();
        } catch (error) {
            toast.error('Failed to delete technical item');
        }
    };

    const handleAdd = () => {
        setIsFormOpen(true);
    };

    const filteredTechnicals = technicals.filter(tech =>
        tech.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = technicals.filter(t => t.status === 'Active').length;
    const inactiveCount = technicals.filter(t => t.status === 'Inactive').length;

    return (
        <div className="w-full max-w-[1600px] mx-auto p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Technical List"
                description="Manage technical specifications and variants"
                totalCount={technicals.length}
                addButtonLabel="Add Technical"
                onAdd={handleAdd}
                showBack={true}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Technicals"
                    value={technicals.length.toString()}
                    icon={<ClipboardList size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Specifications"
                    value={activeCount.toString()}
                    icon={<ClipboardList size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Specifications"
                    value={inactiveCount.toString()}
                    icon={<ClipboardList size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Recently Added"
                    value={loading ? "..." : (technicals.length > 0 ? "Latest Available" : "0")}
                    icon={<ClipboardList size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Technical Specifications</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search technical items..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center text-gray-500 font-medium">Loading technical items...</div>
                    ) : filteredTechnicals.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 text-sm font-semibold text-gray-600">
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTechnicals.map((tech) => (
                                    <tr key={tech._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{tech.name}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {typeof tech.category === 'object' ? tech.category?.name : tech.category || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tech.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tech.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(tech)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tech._id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                            <div className="p-4 rounded-full bg-orange-50 mb-4 text-orange-600">
                                <ClipboardList size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Technical Items Found</h3>
                            <p className="text-gray-500 max-w-md">
                                Start by adding a new technical specification using the button above.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isFormOpen && (
                <TechnicalForm
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingTechnical(null);
                    }}
                    onSubmit={handleSaveTechnical}
                    initialData={editingTechnical}
                />
            )}
        </div>
    );
}
