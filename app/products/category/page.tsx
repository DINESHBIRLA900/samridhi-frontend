"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { LayoutGrid } from 'lucide-react';
import CategoryForm from '@/components/products/CategoryForm';
import { Toaster } from 'sonner';

export default function CategoryPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const handleAddCategory = (data: any) => {
        console.log("New Category Data:", data);
        // Here you would typically make an API call to save the category
        setIsFormOpen(false);
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Category"
                description="Manage product categories"
                totalCount={0}
                addButtonLabel="Add Category"
                onAdd={() => setIsFormOpen(true)}
                showBack={true}
            />

            {/* 4 Static Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Categories"
                    value="0"
                    icon={<LayoutGrid size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Categories"
                    value="0"
                    icon={<LayoutGrid size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Categories"
                    value="0"
                    icon={<LayoutGrid size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="New This Month"
                    value="0"
                    icon={<LayoutGrid size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
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

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-orange-50 mb-4 text-orange-600">
                        <LayoutGrid size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Categories Found</h3>
                    <p className="text-gray-500 max-w-md">
                        Start by creating a new product category using the button above.
                    </p>
                </div>
            </div>

            {/* Modal Overlay */}
            {isFormOpen && (
                <CategoryForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleAddCategory}
                />
            )}
        </div>
    );
}
