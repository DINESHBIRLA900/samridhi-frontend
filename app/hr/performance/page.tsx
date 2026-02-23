"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { Target, TrendingUp, Star, Users } from 'lucide-react';

export default function PerformancePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Performance"
                description="Track employee KPIs and performance metrics"
                totalCount={0}
                addButtonLabel="Define KPI"
                onAdd={() => console.log('Define KPI')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Targets Met"
                    value="0%"
                    icon={<Target size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Top Performers"
                    value="0"
                    icon={<Star size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Avg Efficiency"
                    value="0%"
                    icon={<TrendingUp size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Staff Tracked"
                    value="0"
                    icon={<Users size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Performance Metrics</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search employees..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-violet-50 mb-4 text-violet-600">
                        <Target size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Performance Data</h3>
                    <p className="text-gray-500 max-w-md">
                        KPI tracking and performance analytics for your team will be displayed here.
                    </p>
                </div>
            </div>
        </div>
    );
}
