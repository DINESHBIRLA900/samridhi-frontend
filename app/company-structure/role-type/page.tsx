"use client";

import CompanyStructurePage from "@/components/CompanyStructurePage";

export default function RoleTypePage() {
    return (
        <CompanyStructurePage
            title="Role Types"
            type="roletype"
            fields={[
                { name: "role_name", label: "Role Name", type: "text", required: true }
            ]}
        />
    );
}
