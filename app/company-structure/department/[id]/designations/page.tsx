"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, Toaster } from 'sonner';
import { getCompanyStructure } from "@/services/companyStructureService";
import { getDesignations, deleteDesignation } from "@/services/designationService";
import PageHeader from "@/components/common/PageHeader";
import DesignationFormModal from "@/components/common/Form/DesignationFormModal";
import ActionButtons from "@/components/common/ActionButtons";

export default function DepartmentDesignationsPage() {
    const params = useParams();
    const { id } = params;
    const router = useRouter();

    const [department, setDepartment] = useState<any>(null);
    const [designations, setDesignations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Designation Modal State
    const [isDesignationModalOpen, setIsDesignationModalOpen] = useState(false);
    const [designationToEdit, setDesignationToEdit] = useState<any>(null);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

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
                    <p className="text-gray-500 font-medium">Loading designations...</p>
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
                title={`${department.department_name.toUpperCase()} DESIGNATIONS`}
                description={`MANAGE DESIGNATIONS FOR THE ${department.department_name.toUpperCase()} DEPARTMENT.`}
                totalCount={designations.length}
                showBack={true}
                addButtonLabel="ADD NEW DESIGNATION"
                onAdd={() => {
                    setDesignationToEdit(null);
                    setIsDesignationModalOpen(true);
                }}
            />

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 text-gray-500 bg-white">
                                <th className="py-4 px-6 font-semibold uppercase text-[10px] tracking-wider">Sr. No.</th>
                                <th className="py-4 px-6 font-semibold uppercase text-[10px] tracking-wider">Seniority (Level)</th>
                                <th className="py-4 px-6 font-semibold uppercase text-[10px] tracking-wider">Designation Name</th>
                                <th className="py-4 px-6 font-semibold uppercase text-[10px] tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {designations.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                                        No designations added yet. Click "Add New Designation" to begin.
                                    </td>
                                </tr>
                            ) : (
                                designations.map((designation, index) => (
                                    <tr key={designation._id} className="hover:bg-orange-50/30 transition-colors group">
                                        <td className="py-4 px-6 text-gray-500 font-mono text-sm">
                                            {index + 1}
                                        </td>
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
