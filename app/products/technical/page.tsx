"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { ClipboardList } from 'lucide-react';
import TechnicalForm from '@/components/products/TechnicalForm';
import { Toaster } from 'sonner';

export default function TechnicalListPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const handleAddTechnical = (data: any) => {
        console.log("New Technical Data:", data);
        // Here you would typically make an API call to save the data
        setIsFormOpen(false);
    };

    // Define handleAdd to match the instruction's snippet for onAdd
    const handleAdd = () => {
        setIsFormOpen(true);
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Technical List"
                description="Manage technical specifications and variants"
                addButtonLabel="Add Technical"
                onAdd={handleAdd}
                showBack={true}
            />

            {/* 4 Static Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Technicals"
                    value="0"
                    icon={<ClipboardList size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Specifications"
                    value="0"
                    icon={<ClipboardList size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Specifications"
                    value="0"
                    icon={<ClipboardList size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Custom Variants"
                    value="0"
                    icon={<ClipboardList size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
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

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-orange-50 mb-4 text-orange-600">
                        <ClipboardList size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Technical Items Found</h3>
                    <p className="text-gray-500 max-w-md">
                        Start by adding a new technical specification using the button above.
                    </p>
                </div>
            </div>

            {/* Modal Overlay */}
            {isFormOpen && (
                <TechnicalForm
                    onClose={() => setIsFormOpen(false)}
                    onSubmit={handleAddTechnical}
                />
            )}
        </div>
    );
}
