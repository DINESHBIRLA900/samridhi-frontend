"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { CalendarX, Clock, CheckCircle, FileText, User, Calendar, XCircle } from 'lucide-react';
import { getLeaveList, updateLeaveStatus } from '@/services/leaveService';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner';

export default function LeaveManagementPage() {
    const [leaves, setLeaves] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });
    const [stats, setStats] = useState({
        active: 0,
        pending: 0,
        approvedToday: 0,
        total: 0
    });

    const fetchLeaves = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (statusFilter !== 'All') params.status = statusFilter;

            const data = await getLeaveList(params);
            setLeaves(data);

            const active = data.filter((l: any) => l.status === 'Approved' && new Date(l.start_date) <= new Date() && new Date(l.end_date) >= new Date()).length;
            const pending = data.filter((l: any) => l.status === 'Pending').length;
            const approvedToday = data.filter((l: any) => l.status === 'Approved' && new Date(l.updated_at).toDateString() === new Date().toDateString()).length;

            setStats({
                active,
                pending,
                approvedToday,
                total: data.length
            });
        } catch (error) {
            console.error("Failed to fetch leaves", error);
            toast.error("Failed to load leave requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [statusFilter, dateFilter]);

    const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            await updateLeaveStatus(id, { status });
            toast.success(`Leave request ${status.toLowerCase()}`);
            fetchLeaves();
        } catch (error) {
            toast.error(`Failed to ${status.toLowerCase()} request`);
        }
    };

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const filteredLeaves = leaves.filter(l =>
        l.user_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.reason?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <PageHeader
                title="Leave Management"
                description="Manage and approve employee leave requests"
                totalCount={filteredLeaves.length}
                addButtonLabel="Apply Leave"
                onAdd={() => console.log('Apply Leave')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Active Leaves"
                    value={stats.active.toString()}
                    icon={<CalendarX size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Pending Approvals"
                    value={stats.pending.toString()}
                    icon={<Clock size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Approved Today"
                    value={stats.approvedToday.toString()}
                    icon={<CheckCircle size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Total Requests"
                    value={stats.total.toString()}
                    icon={<FileText size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full lg:w-auto">
                        {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${statusFilter === s
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                                    : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[500px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search by name or reason..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-400 bg-gray-50/50">
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Employee</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Type & Duration</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Reason</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Status</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-400">Loading leave requests...</td>
                                </tr>
                            ) : filteredLeaves.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 rounded-full bg-blue-50 mb-4 text-blue-600">
                                                <CalendarX size={48} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Leave Requests Found</h3>
                                            <p className="text-gray-500 max-w-md">Applications will appear here once submitted by employees.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredLeaves.map((leave) => (
                                    <tr key={leave._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                                    {leave.user_id?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-none mb-1">{leave.user_id?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase">{leave.user_id?.department?.name || 'General'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-gray-800">{leave.leave_type}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium">
                                                    <Calendar size={12} />
                                                    {format(new Date(leave.start_date), 'dd MMM')} - {format(new Date(leave.end_date), 'dd MMM yyyy')}
                                                    <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded ml-1 font-black underline uppercase tracking-widest text-[8px]">
                                                        {leave.total_days} Days
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 max-w-xs">
                                            <p className="text-xs text-gray-600 italic line-clamp-2">"{leave.reason}"</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                leave.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                                }`}>
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {leave.status === 'Pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(leave._id, 'Approved')}
                                                        className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all border border-emerald-100"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(leave._id, 'Rejected')}
                                                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all border border-red-100"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                                    Processed on {format(new Date(leave.updated_at), 'dd MMM')}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
