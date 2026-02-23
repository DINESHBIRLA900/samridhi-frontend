"use client";

import CompanyStructurePage from "@/components/CompanyStructurePage";

export default function JobTypePage() {
    return (
        <CompanyStructurePage
            title="Job Types"
            type="jobtype"
            fields={[
                { name: "job_type_name", label: "Job Type Name", type: "text", required: true }
            ]}
        />
    );
}
