"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { Home, MapPin, Package, Users } from 'lucide-react';

export default function WarehouseListPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Warehouse List"
                description="Manage and monitor all warehouse locations"
                totalCount={0}
                addButtonLabel="Add Warehouse"
                onAdd={() => console.log('Add Warehouse')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Warehouses"
                    value="0"
                    icon={<Home size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Locations"
                    value="0"
                    icon={<MapPin size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Stock Capacity"
                    value="0%"
                    icon={<Package size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Warehouse Staff"
                    value="0"
                    icon={<Users size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Warehouse Directory</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search warehouses..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-indigo-50 mb-4 text-indigo-600">
                        <Home size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Warehouses Found</h3>
                    <p className="text-gray-500 max-w-md">
                        Add your warehouse locations to start managing stock across them.
                    </p>
                </div>
            </div>
        </div>
    );
}
