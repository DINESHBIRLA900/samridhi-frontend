"use client";

import React, { useState } from 'react';
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/StatsCard";
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from "@/components/common/DateFilter";
import { XCircle, RefreshCcw, AlertTriangle, FileX } from "lucide-react";

export default function SalesCancelPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Cancelled Orders"
                description="View and manage all cancelled sales orders"
                totalCount={0}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Cancelled"
                    value="0"
                    icon={<XCircle size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Refunded"
                    value="0"
                    icon={<RefreshCcw size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Pending Refund"
                    value="0"
                    icon={<AlertTriangle size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Rejected Cancellations"
                    value="0"
                    icon={<FileX size={24} />}
                    color="#6b7280"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Cancelled Orders List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search cancelled orders..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">No cancelled sales orders found.</p>
                </div>
            </div>
        </div>
    );
}
