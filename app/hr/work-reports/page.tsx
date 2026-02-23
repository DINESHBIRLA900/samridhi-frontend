"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import Pagination from '@/components/common/Pagination';
import { ClipboardCheck, Clock, CheckCircle, XCircle, User, Calendar, FileText, ChevronRight } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { getWorkApprovals, updateWorkApprovalStatus } from '@/services/workApprovalService';
import { format } from 'date-fns';

export default function WorkReportsPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    // Stats
    const [stats, setStats] = useState({
        pending: 0,
        approvedToday: 0,
        rejectedToday: 0,
        total: 0
    });

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: currentPage,
                limit: 10,
                search: searchTerm,
            };

            if (statusFilter !== 'All') params.status = statusFilter;
            if (dateFilter.range?.from) params.startDate = dateFilter.range.from.toISOString();
            if (dateFilter.range?.to) params.endDate = dateFilter.range.to.toISOString();

            const data = await getWorkApprovals(params);

            // Note: If backend doesn't support pagination yet, we might need to handle array return
            const reportsData = Array.isArray(data) ? data : data.reports || [];
            setReports(reportsData);

            if (data.pagination) {
                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
            } else {
                setTotalCount(reportsData.length);
            }

            // Calculate local stats if backend doesn't provide them
            const pending = reportsData.filter((r: any) => r.status === 'Pending').length;
            const today = new Date().toDateString();
            const approvedToday = reportsData.filter((r: any) => r.status === 'Approved' && new Date(r.updated_at).toDateString() === today).length;
            const rejectedToday = reportsData.filter((r: any) => r.status === 'Rejected' && new Date(r.updated_at).toDateString() === today).length;

            setStats({
                pending,
                approvedToday,
                rejectedToday,
                total: reportsData.length
            });

        } catch (error) {
            console.error("Failed to fetch reports", error);
            toast.error("Failed to load work reports");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchReports();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, dateFilter, currentPage]);

    const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
        try {
            await updateWorkApprovalStatus(id, status);
            toast.success(`Report ${status.toLowerCase()} successfully`);
            fetchReports();
        } catch (error) {
            toast.error(`Failed to ${status.toLowerCase()} report`);
        }
    };

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
        setCurrentPage(1);
    };

    return (
        <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Daily Work Reports"
                description="Review and approve daily tasks submitted by employees"
                totalCount={totalCount}
                showBack={true}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
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
                    title="Rejected Today"
                    value={stats.rejectedToday.toString()}
                    icon={<XCircle size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Total Reports"
                    value={totalCount.toString()}
                    icon={<FileText size={24} />}
                    color="#3b82f6"
                />
            </div>

            {/* Main Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0 pb-1 w-full lg:w-auto">
                            {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => {
                                        setStatusFilter(s);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${statusFilter === s
                                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-200'
                                        : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-row items-center gap-4 w-full lg:max-w-3xl justify-end">
                            <div className="flex-1 min-w-[200px]">
                                <SearchInput
                                    value={searchTerm}
                                    onChange={(v) => {
                                        setSearchTerm(v);
                                        setCurrentPage(1);
                                    }}
                                    placeholder="Search by name or reason..."
                                />
                            </div>
                            <DateFilter onFilterChange={handleDateFilterChange} />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-700 bg-gray-50/50">
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest text-gray-400">Employee</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest text-gray-400">Date & Reason</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest text-gray-400">Task Description</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest text-gray-400">Status</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest text-gray-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
                                        <p className="mt-2 text-gray-500 font-medium">Loading reports...</p>
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 rounded-full bg-gray-50 mb-4">
                                                <ClipboardCheck size={48} className="text-gray-300" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">No reports found</h3>
                                            <p className="text-sm">There are no work reports matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold border border-orange-200">
                                                    {report.user_id?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{report.user_id?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500">{report.user_id?.email || '-'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {format(new Date(report.date), 'dd MMM yyyy')}
                                                </div>
                                                <p className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-100 inline-block uppercase">
                                                    {report.reason}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 max-w-md">
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                                {report.description}
                                            </p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${report.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                report.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-200' :
                                                    'bg-amber-50 text-amber-600 border-amber-200'
                                                }`}>
                                                {report.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {report.status === 'Pending' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleAction(report._id, 'Approved')}
                                                        className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm shadow-emerald-200"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(report._id, 'Rejected')}
                                                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100 hover:bg-red-100 transition-all"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 font-medium italic">
                                                    Processed on {format(new Date(report.updated_at), 'dd MMM')}
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="p-6 border-t border-gray-100">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
