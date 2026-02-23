"use client";

import React, { useState } from "react";
import { TrendingUp, Users, Gift, CheckCircle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';

export default function IncentiveProcessingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen">
            <PageHeader
                title="Incentive Processing"
                description="Manage employee incentives and bonus payments"
                totalCount={0}
                addButtonLabel="Calculate Incentives"
                onAdd={() => console.log('Calculate Incentives')}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Incentives"
                    value="₹0"
                    icon={<Gift size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Eligible Employees"
                    value="0"
                    icon={<Users size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Paid This Month"
                    value="₹0"
                    icon={<CheckCircle size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Processing"
                    value="0"
                    icon={<TrendingUp size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Incentive Records</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search incentive records..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-orange-50 mb-4 text-orange-500">
                        <Gift size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Incentives Processed</h3>
                    <p className="text-gray-500 max-w-md">
                        Bonuses and incentive records will appear here once the rewards cycles are calculated and finalized.
                    </p>
                </div>
            </div>
        </div>
    );
}
