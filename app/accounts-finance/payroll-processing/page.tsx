"use client";

import React, { useState } from "react";
import { Landmark, Users, CheckCircle, Clock, PieChart } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';

export default function PayrollProcessingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen">
            <PageHeader
                title="Payroll Processing"
                description="Manage employee salaries and payroll processing"
                totalCount={0}
                addButtonLabel="Run Payroll"
                onAdd={() => console.log('Run Payroll')}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Payout"
                    value="₹0"
                    icon={<Landmark size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Employees"
                    value="0"
                    icon={<Users size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Processed"
                    value="0"
                    icon={<CheckCircle size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Pending"
                    value="0"
                    icon={<Clock size={24} />}
                    color="#ef4444"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Payroll Records</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search payroll records..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-orange-50 mb-4 text-orange-500">
                        <Users size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Payroll Data</h3>
                    <p className="text-gray-500 max-w-md">
                        Employee salary records and processing history will be listed here after you run the monthly payroll.
                    </p>
                </div>
            </div>
        </div>
    );
}
