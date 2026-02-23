import React, { useState, useEffect } from 'react';
import { getCompanyStructure } from '@/services/companyStructureService';
import { getUsers } from '@/services/userService';
import { getDesignations } from '@/services/designationService';

// Define Manager interface to avoid any type issues
interface Manager {
    _id: string;
    name: string;
    [key: string]: any;
}

interface OfficeDetailsProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const OfficeDetails: React.FC<OfficeDetailsProps> = ({ formData, handleChange }) => {
    const [departments, setDepartments] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [jobTypes, setJobTypes] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [designations, setDesignations] = useState<any[]>([]);
    const [managers, setManagers] = useState<Manager[]>([]);
    const [loading, setLoading] = useState(true);

    // Initial Data Load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [deptData, roleData, jobData, catData, teamData, usersData] = await Promise.all([
                    getCompanyStructure('department'),
                    getCompanyStructure('roletype'),
                    getCompanyStructure('jobtype'),
                    getCompanyStructure('employee-category'),
                    getCompanyStructure('teams'),
                    getUsers(),
                ]);

                setDepartments(deptData);
                setRoles(roleData);
                setJobTypes(jobData);
                setCategories(catData);
                setTeams(teamData);
                setManagers(Array.isArray(usersData) ? usersData : usersData?.users || []);
            } catch (error) {
                console.error("Failed to fetch office details options", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Fetch designations when department changes
    useEffect(() => {
        const fetchDesignations = async () => {
            if (formData.department) {
                try {
                    const data = await getDesignations({ department: formData.department });
                    setDesignations(data);
                } catch (error) {
                    console.error("Failed to fetch designations", error);
                }
            } else {
                setDesignations([]);
            }
        };

        fetchDesignations();
    }, [formData.department]);


    const toTitleCase = (str: string) => {
        if (!str) return '';
        return str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    };

    const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange(e);

        // If department changes, the parent component handles clearing dependent fields.
    };

    const renderSelect = (label: string, name: string, options: any[], keyName: string, required = false) => (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <select
                name={name}
                value={formData[name] || ''}
                onChange={handleFieldChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E)] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat pr-10"
                required={required}
                disabled={loading}
            >
                <option value="">Select {label}</option>
                {Array.isArray(options) ? options.map((opt: any) => (
                    <option key={opt._id} value={opt._id}>
                        {toTitleCase(opt[keyName] || opt.name)}
                    </option>
                )) : null}
            </select>
        </div>
    );

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                Office Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {renderSelect('Department', 'department', departments, 'department_name', true)}


                {renderSelect('Role Type', 'role', roles, 'role_name', true)}
                {renderSelect('Job Type', 'job_type', jobTypes, 'job_type_name', true)}
                {renderSelect('Employee Category', 'employee_category', categories, 'category_name', true)}
                {renderSelect('Designation', 'designation', designations, 'designation_name', true)}

                {/* Optional Fields */}
                {renderSelect('Team (Optional)', 'team', teams, 'team_name', false)}
                {renderSelect('Reporting Manager (Optional)', 'manager', managers, 'name', false)}
            </div>
        </div>
    );
};

export default OfficeDetails;
