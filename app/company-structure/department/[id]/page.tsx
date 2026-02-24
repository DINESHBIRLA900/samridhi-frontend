"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from 'sonner';
import { getCompanyStructure } from "@/services/companyStructureService";
import { getUsers } from "@/services/userService";
import PageHeader from "@/components/common/PageHeader";
import EmployeeTable from "@/components/employees/EmployeeTable";
import Pagination from "@/components/common/Pagination";
import { LayoutGrid } from "lucide-react";

export default function DepartmentDetailsPage() {
    const params = useParams();
    const { id } = params;
    const router = useRouter();

    const [department, setDepartment] = useState<any>(null);
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;


    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id, currentPage]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Department Details by ID
            const allDepartments = await getCompanyStructure('department');
            const dept = allDepartments.find((d: any) => d._id === id);

            if (!dept) {
                toast.error("Department not found");
                setLoading(false);
                return;
            }
            setDepartment(dept);


            // 3. Fetch Employees for this Department using ID with pagination
            const data = await getUsers({
                department: id,
                page: currentPage,
                limit
            });
            setEmployees(data.users);
            setTotalPages(data.totalPages);
            setTotalCount(data.totalCount);

        } catch (error) {
            console.error("Failed to load details", error);
            toast.error("Failed to load department details");
        } finally {
            setLoading(false);
        }
    };


    if (loading && !department) {
        return (
            <div className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Loading department details...</p>
                </div>
            </div>
        );
    }

    if (!department) {
        return <div className="p-8 text-center text-gray-500 font-medium">Department not found</div>;
    }

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen bg-gray-50 p-6 md:p-8">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title={department.department_name.toUpperCase()}
                description={(department.description || 'Manage department employees and designations.').toUpperCase()}
                totalCount={totalCount}
                showBack={true}
            >
                <button
                    onClick={() => router.push(`/company-structure/department/${id}/designations`)}
                    className="flex items-center gap-2 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-2.5 rounded-xl transition-all font-bold w-full md:w-auto justify-center"
                >
                    <LayoutGrid size={20} />
                    DEPARTMENT DESIGNATIONS
                </button>
            </PageHeader>


            {/* Employees Section */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900 uppercase">Employees in {department.department_name}</h3>
                </div>
                <EmployeeTable
                    users={employees}
                    loading={loading}
                    onDelete={() => fetchData()}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

        </div>
    );
}
