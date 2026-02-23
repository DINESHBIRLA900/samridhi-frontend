"use client";

import React, { useState } from 'react';
import PageHeader from "@/components/common/PageHeader";
import StatsCard from "@/components/StatsCard";
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from "@/components/common/DateFilter";
import { FileText, Truck, PackageCheck, XCircle } from "lucide-react";

export default function PurchaseOrderPage() {
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
                title="Purchase Orders"
                description="Manage and track all issued purchase orders"
                totalCount={0}
                addButtonLabel="Create Order"
                onAdd={() => console.log('Create order clicked')}
            />

            {/* 4 Static Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total POs"
                    value="0"
                    icon={<FileText size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Pending Delivery"
                    value="0"
                    icon={<Truck size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Received"
                    value="0"
                    icon={<PackageCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Cancelled"
                    value="0"
                    icon={<XCircle size={24} />}
                    color="#ef4444"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Order List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search orders..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <p className="text-gray-500 mb-4">No purchase orders found.</p>
                    <button className="text-orange-600 hover:text-orange-700 font-medium">
                        + Create your first order
                    </button>
                </div>
            </div>
        </div>
    );
}
