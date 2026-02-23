"use client";

import React, { useState } from 'react';
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/StatsCard";
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from "@/components/common/DateFilter";
import { FilePlus, FileCheck, FileX, Clock } from "lucide-react";

export default function PurchaseRequestPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
        // Fetch new data here based on filter
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            {/* Standardized Header */}
            <PageHeader
                title="Purchase Requests"
                description="Manage and track all internal purchase requests"
                totalCount={0}
                addButtonLabel="Create Request"
                onAdd={() => console.log('Create request clicked')}
            />

            {/* 4 Static Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Requests"
                    value="0"
                    icon={<FilePlus size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Pending Approval"
                    value="0"
                    icon={<Clock size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Approved"
                    value="0"
                    icon={<FileCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Rejected"
                    value="0"
                    icon={<FileX size={24} />}
                    color="#ef4444"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Request List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search requests..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">No purchase requests found.</p>
                    <button className="text-orange-600 hover:text-orange-700 font-medium">
                        + Create your first request
                    </button>
                </div>
            </div>
        </div>
    );
}
