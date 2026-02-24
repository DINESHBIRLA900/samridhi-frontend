"use client";

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/StatsCard';
import SearchInput from '@/components/common/SearchInput';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import { Clock, UserCheck, UserX, AlertCircle, MapPin, Calendar, Clock4 } from 'lucide-react';
import { getAttendanceList } from '@/services/attendanceService';
import { format } from 'date-fns';
import { toast, Toaster } from 'sonner';

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });
    const [stats, setStats] = useState({
        present: 0,
        late: 0,
        leave: 0,
        avgHours: 0
    });

    const fetchAttendance = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (dateFilter.range?.from) params.startDate = dateFilter.range.from.toISOString();
            if (dateFilter.range?.to) params.endDate = dateFilter.range.to.toISOString();

            const data = await getAttendanceList(params);
            setAttendance(data);

            // Simple stats calculation for today
            const today = new Date().toDateString();
            const todayLogs = data.filter((log: any) => new Date(log.date).toDateString() === today);

            const present = todayLogs.length;
            const late = todayLogs.filter((log: any) => log.status === 'Late').length;

            // Note: On Leave would come from Leave API, setting 0 for now
            setStats({
                present,
                late,
                leave: 0,
                avgHours: data.length > 0 ? Math.round(data.reduce((acc: number, curr: any) => acc + (curr.work_duration || 0), 0) / (data.length * 60)) : 0
            });

        } catch (error) {
            console.error("Failed to fetch attendance", error);
            toast.error("Failed to load attendance logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, [dateFilter]);

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const filteredAttendance = attendance.filter(log =>
        log.user_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.user_id?.employee_id?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            <Toaster position="top-right" />
            <PageHeader
                title="Attendance"
                description="Monitor daily attendance and work hours"
                totalCount={filteredAttendance.length}
                addButtonLabel="Log Attendance"
                onAdd={() => console.log('Log Attendance')}
                showBack={true}
            />

            {/* 4 Standard Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Present Today"
                    value={stats.present.toString()}
                    icon={<UserCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Late Arrivals"
                    value={stats.late.toString()}
                    icon={<Clock size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="On Leave"
                    value={stats.leave.toString()}
                    icon={<UserX size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Avg Hours"
                    value={`${stats.avgHours}h`}
                    icon={<AlertCircle size={24} />}
                    color="#3b82f6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Daily Attendance Logs</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search employees by name or ID..."
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
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Date</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Check In</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Check Out</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest">Duration</th>
                                <th className="py-4 px-6 font-bold uppercase text-[10px] tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center text-gray-400">Loading attendance...</td>
                                </tr>
                            ) : filteredAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="p-4 rounded-full bg-emerald-50 mb-4 text-emerald-600">
                                                <UserCheck size={48} />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Attendance Logs Found</h3>
                                            <p className="text-gray-500 max-w-md">No logs found for the selected range.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAttendance.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                                                    {log.user_id?.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 leading-none mb-1">{log.user_id?.name || 'Unknown'}</p>
                                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{log.user_id?.employee_id || 'EMP-000'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                                                <Calendar size={14} className="text-gray-400" />
                                                {format(new Date(log.date), 'dd MMM yyyy')}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                    <Clock size={14} className="text-emerald-500" />
                                                    {format(new Date(log.check_in.time), 'hh:mm a')}
                                                </div>
                                                {log.check_in.location?.address && (
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-400 max-w-[150px] truncate italic">
                                                        <MapPin size={10} />
                                                        {log.check_in.location.address}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            {log.check_out ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                                                        <Clock4 size={14} className="text-orange-500" />
                                                        {format(new Date(log.check_out.time), 'hh:mm a')}
                                                    </div>
                                                    {log.check_out.location?.address && (
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 max-w-[150px] truncate italic">
                                                            <MapPin size={10} />
                                                            {log.check_out.location.address}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-amber-500 font-medium italic">In Progress</span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="text-sm font-black text-gray-700">
                                                {log.work_duration ? `${Math.floor(log.work_duration / 60)}h ${log.work_duration % 60}m` : '--'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${log.status === 'Present' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                log.status === 'Late' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                    'bg-red-50 text-red-600 border-red-200'
                                                }`}>
                                                {log.status}
                                            </span>
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
