"use client";

import CompanyStructurePage from "@/components/CompanyStructurePage";

export default function EmployeeCategoryPage() {
    return (
        <CompanyStructurePage
            title="Employee Category"
            type="category"
            fields={[
                { name: "category_name", label: "Category Name", type: "text", required: true }
            ]}
        />
    );
}
