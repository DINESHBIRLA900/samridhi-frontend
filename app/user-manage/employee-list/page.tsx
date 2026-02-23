"use client";

import { useState, useEffect } from "react";
import { getUsers, deleteUser } from "@/services/userService";
import { Plus, Users, UserCheck, UserMinus, UserPlus } from "lucide-react";
import { toast, Toaster } from 'sonner';

import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';
import Pagination from "@/components/common/Pagination";
import AddEmployee from "@/components/employees/AddEmployee";
import EmployeeTable from "@/components/employees/EmployeeTable";

export default function EmployeeListPage() {
    // State
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Initial and conditional fetch
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(1); // Reset to page 1 on new search
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page: number) => {
        setLoading(true);
        try {
            const data = await getUsers({
                page,
                limit,
                search: searchTerm
            });
            setUsers(data.users);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);
            setCurrentPage(data.currentPage);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Failed to load employee list");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this employee?")) return;
        try {
            await deleteUser(id);
            toast.success("Employee deleted");
            fetchUsers(currentPage);
        } catch (error) {
            console.error("Failed to delete employee", error);
            toast.error("Failed to delete employee");
        }
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setShowAddModal(true);
    };

    const handleCloseModal = () => {
        setShowAddModal(false);
        setSelectedUser(null);
    };

    const handleSuccess = () => {
        handleCloseModal();
        fetchUsers(1);
    };

    return (
        <div className="p-8 w-full max-w-[1600px] mx-auto min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            {/* Header */}
            <PageHeader
                title="Employee List"
                description="View and manage all employees in a list format"
                totalCount={totalCount}
                addButtonLabel="Add Employee"
                onAdd={handleAdd}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Employees"
                    value={totalCount.toString()}
                    icon={<Users size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Employees"
                    value="0"
                    icon={<UserCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="On Leave (Today)"
                    value="0"
                    icon={<UserMinus size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="New Joiners (Month)"
                    value="0"
                    icon={<UserPlus size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter & Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Employee Directory</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchTerm}
                                onChange={(val) => {
                                    setSearchTerm(val);
                                    setCurrentPage(1); // Reset page on input
                                }}
                                placeholder="Search employees..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <EmployeeTable
                    users={users}
                    loading={loading}
                    onDelete={handleDelete}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {showAddModal && (
                <AddEmployee
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                    editData={selectedUser}
                />
            )}
        </div>
    );
}
