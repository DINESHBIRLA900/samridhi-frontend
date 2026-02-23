"use client";

import CompanyStructurePage from "@/components/CompanyStructurePage";
import { useRouter } from "next/navigation";

export default function DepartmentPage() {
    const router = useRouter();
    return (
        <CompanyStructurePage
            title="Departments"
            type="department"
            fields={[
                { name: "department_name", label: "Department Name", type: "text", required: true }
            ]}
            viewMode="grid"
            onItemClick={(item) => router.push(`/company-structure/department/${item._id}`)}
        />
    );
}
