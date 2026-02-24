"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { LayoutGrid, Trash2, Edit, ArrowUp, ArrowDown } from 'lucide-react';
import CategoryForm from '@/components/products/CategoryForm';
import { Toaster } from 'sonner';
import { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories } from '@/services/productService';
import { toast } from 'sonner';

export default function CategoryPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            toast.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const handleSaveCategory = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('name', data.name);
            if (data.image) {
                formData.append('image', data.image);
            }

            if (editingCategory) {
                await updateCategory(editingCategory._id, formData);
                toast.success('Category updated successfully');
            } else {
                await createCategory(formData);
                toast.success('Category created successfully');
            }
            setIsFormOpen(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save category');
        }
    };

    const handleEdit = (category: any) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await deleteCategory(id);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            toast.error('Failed to delete category');
        }
    };

    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if (searchQuery) {
            toast.error('Reordering is only possible when not searching');
            return;
        }

        const newCategories = [...categories];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newCategories.length) return;

        // Swap
        const [movedItem] = newCategories.splice(index, 1);
        newCategories.splice(targetIndex, 0, movedItem);

        // Update local state first (optimistic)
        const updatedWithOrder = newCategories.map((cat, idx) => ({
            ...cat,
            order: idx
        }));
        setCategories(updatedWithOrder);

        try {
            await reorderCategories(updatedWithOrder.map(c => ({ _id: c._id, order: c.order })));
        } catch (error) {
            toast.error('Failed to update order');
            fetchCategories(); // Rollback
        }
    };

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const activeCount = categories.filter(c => c.status === 'Active').length;
    const inactiveCount = categories.filter(c => c.status === 'Inactive').length;

    return (
        <div className="w-full max-w-[1600px] mx-auto p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Category"
                description="Manage product categories"
                totalCount={categories.length}
                addButtonLabel="Add Category"
                onAdd={() => setIsFormOpen(true)}
                showBack={true}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Categories"
                    value={categories.length.toString()}
                    icon={<LayoutGrid size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Categories"
                    value={activeCount.toString()}
                    icon={<LayoutGrid size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Categories"
                    value={inactiveCount.toString()}
                    icon={<LayoutGrid size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Recently Added"
                    value={loading ? "..." : (categories.length > 0 ? "Latest Available" : "0")}
                    icon={<LayoutGrid size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Category List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search categories..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-12 text-center">Loading categories...</div>
                    ) : filteredCategories.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 w-24">Order</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Image</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCategories.map((category, index) => (
                                    <tr key={category._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleMove(index, 'up')}
                                                    disabled={index === 0 || !!searchQuery}
                                                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${index === 0 || !!searchQuery ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                                                >
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleMove(index, 'down')}
                                                    disabled={index === filteredCategories.length - 1 || !!searchQuery}
                                                    className={`p-1 rounded hover:bg-gray-200 transition-colors ${index === filteredCategories.length - 1 || !!searchQuery ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                                                >
                                                    <ArrowDown size={16} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                                {category.image ? (
                                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <LayoutGrid size={20} />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${category.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {category.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
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
                                <LayoutGrid size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Categories Found</h3>
                            <p className="text-gray-500 max-w-md">
                                Start by creating a new product category using the button above.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Overlay */}
            {isFormOpen && (
                <CategoryForm
                    onClose={() => {
                        setIsFormOpen(false);
                        setEditingCategory(null);
                    }}
                    onSubmit={handleSaveCategory}
                    initialData={editingCategory}
                />
            )}
        </div>
    );
}
