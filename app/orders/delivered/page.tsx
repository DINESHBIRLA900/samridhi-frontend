"use client";

import React, { useState } from 'react';
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/StatsCard";
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from "@/components/common/DateFilter";
import { PackageCheck, Truck, Clock, CornerUpLeft } from "lucide-react";

export default function MaterialDeliveredPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Material Delivered"
                description="Track and confirm all delivered materials"
                totalCount={0}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Delivered"
                    value="0"
                    icon={<PackageCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="In Transit"
                    value="0"
                    icon={<Truck size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Delayed"
                    value="0"
                    icon={<Clock size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Return Requested"
                    value="0"
                    icon={<CornerUpLeft size={24} />}
                    color="#ef4444"
                />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Delivered List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search deliveries..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">No material deliveries found.</p>
                </div>
            </div>
        </div>
    );
}
