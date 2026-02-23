"use client";

import React, { useState } from "react";
import { Handshake, Wallet, Clock, CheckCircle } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';

export default function CommissionSettlementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen">
            <PageHeader
                title="Commission Settlement"
                description="Track and settle commission payments"
                totalCount={0}
                addButtonLabel="Settle Commission"
                onAdd={() => console.log('Settle Commission')}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Commission"
                    value="₹0"
                    icon={<Handshake size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Pending Settlement"
                    value="₹0"
                    icon={<Clock size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Settled Amount"
                    value="₹0"
                    icon={<CheckCircle size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Available Balance"
                    value="₹0"
                    icon={<Wallet size={24} />}
                    color="#f59e0b"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Commission Records</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search commission records..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-emerald-50 mb-4 text-emerald-600">
                        <Handshake size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Commission Records</h3>
                    <p className="text-gray-500 max-w-md">
                        Your agent and referral commission logs will appear here. No settlements found for the current filter.
                    </p>
                </div>
            </div>
        </div>
    );
}
