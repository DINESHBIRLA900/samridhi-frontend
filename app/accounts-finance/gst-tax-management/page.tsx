"use client";

import React, { useState } from "react";
import { Scale, FileCheck, FileWarning, History } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';

export default function GSTTaxManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen">
            <PageHeader
                title="GST / Tax Management"
                description="Manage GST returns and tax compliance records"
                totalCount={0}
                addButtonLabel="New Tax Entry"
                onAdd={() => console.log('New Tax Entry')}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Liability"
                    value="₹0"
                    icon={<Scale size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Returns Filed"
                    value="0"
                    icon={<FileCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Pending Returns"
                    value="0"
                    icon={<FileWarning size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Tax History"
                    value="0"
                    icon={<History size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Tax Records</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search tax records..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-blue-50 mb-4 text-blue-600">
                        <Scale size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Tax Records Found</h3>
                    <p className="text-gray-500 max-w-md">
                        Your GST returns and tax compliance logs will be displayed here once generated.
                    </p>
                </div>
            </div>
        </div>
    );
}
