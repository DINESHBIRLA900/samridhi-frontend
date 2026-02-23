"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { AlertTriangle, Package, TrendingDown, BellRing } from 'lucide-react';

export default function MinStockAlertsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Minimum Stock Alerts"
                description="Monitor items that are below the safety stock threshold"
                totalCount={0}
                addButtonLabel="Set Thresholds"
                onAdd={() => console.log('Set Stock Thresholds')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Active Alerts"
                    value="0"
                    icon={<AlertTriangle size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Critical Stock"
                    value="0"
                    icon={<Package size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="To Reorder"
                    value="0"
                    icon={<BellRing size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Potential Loss"
                    value="₹0"
                    icon={<TrendingDown size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Alert List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search items with alerts..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-rose-50 mb-4 text-rose-600">
                        <AlertTriangle size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Stock Alerts</h3>
                    <p className="text-gray-500 max-w-md">
                        All your inventory items are currently above their minimum stock thresholds.
                    </p>
                </div>
            </div>
        </div>
    );
}
