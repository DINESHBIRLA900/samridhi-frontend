"use client";

import React, { useState } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { FileText, Folder, ShieldCheck, AlertCircle } from 'lucide-react';

export default function EmployeeDocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <PageHeader
                title="Employee Documents"
                description="Digital repository for employee records and compliance files"
                totalCount={0}
                addButtonLabel="Upload Document"
                onAdd={() => console.log('Upload Document')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Documents"
                    value="0"
                    icon={<FileText size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Employee Folders"
                    value="0"
                    icon={<Folder size={24} />}
                    color="#8b5cf6"
                />
                <StatsCard
                    title="Verified Files"
                    value="0"
                    icon={<ShieldCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Expiring Docs"
                    value="0"
                    icon={<AlertCircle size={24} />}
                    color="#f59e0b"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Document Repository</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search employees or documents..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-12 text-center min-h-[400px] flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-slate-50 mb-4 text-slate-600">
                        <Folder size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Documents Reccorded</h3>
                    <p className="text-gray-500 max-w-md">
                        Digital copies of employee contracts, identity proofs, and records will be stored here.
                    </p>
                </div>
            </div>
        </div>
    );
}
