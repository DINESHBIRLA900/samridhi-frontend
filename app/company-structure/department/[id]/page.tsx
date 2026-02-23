"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from 'sonner';
import { getCompanyStructure } from "@/services/companyStructureService";
import { getUsers } from "@/services/userService";
import { getDesignations, deleteDesignation } from "@/services/designationService";
import PageHeader from "@/components/common/PageHeader";
import EmployeeTable from "@/components/employees/EmployeeTable";
import Pagination from "@/components/common/Pagination";
import DesignationFormModal from "@/components/common/Form/DesignationFormModal";
import ActionButtons from "@/components/common/ActionButtons";

export default function DepartmentDetailsPage() {
    const params = useParams();
    const { id } = params;

    const [department, setDepartment] = useState<any>(null);
    const [employees, setEmployees] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 10;

    // Designation Modal State
    const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
    const [designationToEdit, setDesignationToEdit] = useState<any>(null);

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

            // 2. Fetch Designations for this Department
            const designationsData = await getDesignations({ department: id });
            setDesignations(designationsData);

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

    const handleDeleteDesignation = async (designationId: string) => {
        if (window.confirm("Are you sure you want to delete this designation?")) {
            try {
                await deleteDesignation(designationId);
                toast.success("Designation deleted successfully");
                fetchData();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Failed to delete designation");
            }
        }
    };

    const handleEditDesignation = (designation: any) => {
        setDesignationToEdit(designation);
        setIsDesignationModalOpen(true);
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
                title={department.department_name}
                description={department.description || 'Manage department employees and designations.'}
                totalCount={totalCount}
                showBack={true}
                addButtonLabel="Add Designation"
                onAdd={() => {
                    setDesignationToEdit(null);
                    setIsDesignationModalOpen(true);
                }}
            />

            {/* Designations Section */}
            <div className="mb-8 overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Department Designations</h3>
                </div>
                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 text-gray-500 bg-white">
                                    <th className="py-3 px-6 font-semibold uppercase text-[10px] tracking-wider">Seniority (Level)</th>
                                    <th className="py-3 px-6 font-semibold uppercase text-[10px] tracking-wider">Designation Name</th>
                                    <th className="py-3 px-6 font-semibold uppercase text-[10px] tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {designations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                                            No designations added yet. Click "Add Designation" to begin.
                                        </td>
                                    </tr>
                                ) : (
                                    designations.map((designation) => (
                                        <tr key={designation._id} className="hover:bg-orange-50/30 transition-colors group">
                                            <td className="py-4 px-6">
                                                <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-orange-100 text-orange-700 font-mono text-xs font-bold shadow-xs">
                                                    {designation.level || 1}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-bold text-gray-900 text-sm tracking-wide uppercase">
                                                    {designation.designation_name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <ActionButtons
                                                    onEdit={() => handleEditDesignation(designation)}
                                                    onDelete={() => handleDeleteDesignation(designation._id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Employees Section */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900">Employees in {department.department_name}</h3>
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

            <DesignationFormModal
                isOpen={isDesignationModalOpen}
                onClose={() => setIsDesignationModalOpen(false)}
                departmentId={id as string}
                departmentName={department.department_name}
                designationToEdit={designationToEdit}
                onSuccess={fetchData}
            />
        </div>
    );
}
