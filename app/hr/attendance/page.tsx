"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { Clock, UserCheck, UserX, AlertCircle } from 'lucide-react';

export default function AttendancePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Attendance"
                description="Monitor daily attendance and work hours"
                totalCount={0}
                addButtonLabel="Log Attendance"
                onAdd={() => console.log('Log Attendance')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Present Today"
                    value="0"
                    icon={<UserCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Late Arrivals"
                    value="0"
                    icon={<Clock size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="On Leave"
                    value="0"
                    icon={<UserX size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Avg Hours"
                    value="0h"
                    icon={<AlertCircle size={24} />}
                    color="#3b82f6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Daily Attendance</h2>
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
                    <div className="p-4 rounded-full bg-emerald-50 mb-4 text-emerald-600">
                        <UserCheck size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Attendance Logs Found</h3>
                    <p className="text-gray-500 max-w-md">
                        Employee clock-in and clock-out data for your selected range will appear here.
                    </p>
                </div>
            </div>
        </div>
    );
}
