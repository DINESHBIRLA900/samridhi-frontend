import React from 'react';
import { Mail, Phone, MessageCircle, Eye } from 'lucide-react';
import Link from 'next/link';
import ActionButtons from '@/components/common/ActionButtons';

interface EmployeeTableProps {
    users: any[];
    loading: boolean;
    onDelete: (id: string) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ users, loading, onDelete }) => {
    if (loading) {
        return (
            <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading employees...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-gray-200 text-gray-700 bg-gray-50">
                        <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Profile</th>
                        <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Role & Dept & Desig</th>
                        <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Manager & Team</th>
                        <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Status</th>
                        <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-500">
                                No employees found matching your criteria.
                            </td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user._id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 font-bold shadow-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{user.name}</div>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="text-xs text-gray-400">{user.email}</span>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-xs text-gray-500 font-medium">{user.phone}</span>
                                                    {user.whatsapp_number && (
                                                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                                                            <MessageCircle size={10} className="fill-emerald-500" />
                                                            {user.whatsapp_number}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-1 items-start">
                                        <span className="px-2.5 py-1 rounded-md bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-wider inline-block">
                                            {user.designation?.designation_name || '-'}
                                        </span>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-gray-700">{user.role?.role_name || '-'}</span>
                                            <span className="text-[11px] text-gray-500">{user.department?.department_name || '-'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="text-sm font-medium text-gray-800 flex items-center gap-1.5">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Mgr:</span>
                                            {user.reporting_manager?.name || 'Self'}
                                        </div>
                                        <div className="text-xs text-gray-500 flex items-center gap-1.5">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">Team:</span>
                                            {user.team?.team_name || '-'}
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${user.status === 'Active'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                        : 'bg-red-50 text-red-600 border-red-200'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            href={`/user-manage/employee-list/${user._id}`}
                                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </Link>
                                        <ActionButtons
                                            showEdit={false}
                                            onDelete={() => onDelete(user._id)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeTable;
