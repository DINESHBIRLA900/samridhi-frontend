"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { AlertTriangle, Trash2, ShieldX, TrendingDown } from 'lucide-react';

export default function DamagedScrapPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Damaged & Scrap"
                description="Manage and record damaged items and scrap disposal"
                totalCount={0}
                addButtonLabel="Report Damage"
                onAdd={() => console.log('Report Damage')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Damaged Total"
                    value="0"
                    icon={<AlertTriangle size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Scrapped Items"
                    value="0"
                    icon={<Trash2 size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Non-Repairable"
                    value="0"
                    icon={<ShieldX size={24} />}
                    color="#6b7280"
                />
                <StatsCard
                    title="Loss Value"
                    value="₹0"
                    icon={<TrendingDown size={24} />}
                    color="#7c2d12"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Damage Logs</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search damage logs..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-red-50 mb-4 text-red-600">
                        <AlertTriangle size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Damage Records</h3>
                    <p className="text-gray-500 max-w-md">
                        All reported damaged goods and scrap items will be listed here.
                    </p>
                </div>
            </div>
        </div>
    );
}
