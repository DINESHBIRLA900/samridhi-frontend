"use client";

import { useState, useEffect } from "react";
import { getCompanyStructure, updateCompanyStructure } from "@/services/companyStructureService";
import { PERMISSION_MODULES, PERMISSION_ACTIONS } from "@/constants/permissions";
import { Check, Shield, Save } from "lucide-react";
import { toast, Toaster } from 'sonner';

export default function PermissionsPage() {
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchRoles();
    }, []);

    useEffect(() => {
        if (selectedRoleId) {
            const role = roles.find(r => r._id === selectedRoleId);
            if (role) {
                setPermissions(role.permissions || []);
            }
        }
    }, [selectedRoleId, roles]);

    const fetchRoles = async () => {
        try {
            const data = await getCompanyStructure('roletype');
            setRoles(data);
            if (data.length > 0 && !selectedRoleId) {
                setSelectedRoleId(data[0]._id);
            }
        } catch (error) {
            console.error("Failed to fetch roles", error);
            toast.error("Failed to load roles");
        }
    };

    const handleTogglePermission = (moduleKey: string, actionKey: string) => {
        if (!selectedRoleId) return;

        const permissionString = `${moduleKey}_${actionKey}`;
        setPermissions(prev => {
            if (prev.includes(permissionString)) {
                return prev.filter(p => p !== permissionString);
            } else {
                return [...prev, permissionString];
            }
        });
    };

    const handleToggleModule = (moduleKey: string) => {
        if (!selectedRoleId) return;

        // Check if all actions in this module are currently selected
        const allActionsSelected = PERMISSION_ACTIONS.every(action =>
            permissions.includes(`${moduleKey}_${action.key}`)
        );

        setPermissions(prev => {
            const newPermissions = [...prev];

            PERMISSION_ACTIONS.forEach(action => {
                const permString = `${moduleKey}_${action.key}`;
                const index = newPermissions.indexOf(permString);

                if (allActionsSelected) {
                    // Deselect all
                    if (index > -1) newPermissions.splice(index, 1);
                } else {
                    // Select all
                    if (index === -1) newPermissions.push(permString);
                }
            });

            return newPermissions;
        });
    };

    const handleSave = async () => {
        if (!selectedRoleId) return;

        setSaving(true);
        try {
            await updateCompanyStructure('roletype', selectedRoleId, { permissions });

            // Update local state to reflect saved changes
            setRoles(prev => prev.map(r =>
                r._id === selectedRoleId ? { ...r, permissions } : r
            ));

            toast.success("Permissions updated successfully");
        } catch (error) {
            console.error("Failed to save permissions", error);
            toast.error("Failed to save permissions");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-orange-600 to-orange-500 mb-2">
                        Access Permissions
                    </h1>
                    <p className="text-gray-600">Manage role-based access controls for the application</p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-1 px-2 flex items-center gap-2">
                    <Shield className="text-orange-600" size={20} />
                    <span className="text-sm text-orange-700 font-medium">Role Based Access Control</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Role Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 shadow-md">
                        <h2 className="text-lg font-semibold text-black mb-4 px-2">Select Role</h2>
                        <div className="space-y-2">
                            {roles.map(role => (
                                <button
                                    key={role._id}
                                    onClick={() => setSelectedRoleId(role._id)}
                                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group ${selectedRoleId === role._id
                                        ? 'bg-orange-500 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                                        }`}
                                >
                                    <span className="font-medium">{role.role_name}</span>
                                    {selectedRoleId === role._id && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content: Permission Matrix */}
                <div className="lg:col-span-3">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg relative overflow-hidden">

                        {/* Header Actions */}
                        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-semibold text-black">
                                    {roles.find(r => r._id === selectedRoleId)?.role_name} Permissions
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Configure what this role can assess</p>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={saving || !selectedRoleId}
                                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Save size={18} />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>

                        {/* Matrix Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-200 text-gray-700">
                                        <th className="py-4 px-4 font-medium uppercase text-xs tracking-wider w-[30%]">Module</th>
                                        {PERMISSION_ACTIONS.map(action => (
                                            <th key={action.key} className="py-4 px-4 font-medium uppercase text-xs tracking-wider text-center w-[15%]">
                                                {action.label}
                                            </th>
                                        ))}
                                        <th className="py-4 px-4 font-medium uppercase text-xs tracking-wider text-right w-[10%]">All</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {PERMISSION_MODULES.map(module => (
                                        <tr key={module.key} className="hover:bg-gray-50 transition-colors group">
                                            <td className="py-4 px-4 text-gray-800 font-medium">
                                                {module.label}
                                            </td>
                                            {PERMISSION_ACTIONS.map(action => {
                                                const permString = `${module.key}_${action.key}`;
                                                const isChecked = permissions.includes(permString);
                                                return (
                                                    <td key={action.key} className="py-4 px-4 text-center">
                                                        <div className="flex justify-center">
                                                            <button
                                                                onClick={() => handleTogglePermission(module.key, action.key)}
                                                                className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all duration-200 ${isChecked
                                                                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                                                                    : 'border-gray-300 bg-transparent hover:border-orange-400'
                                                                    }`}
                                                            >
                                                                {isChecked && <Check size={14} strokeWidth={3} />}
                                                            </button>
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                            <td className="py-4 px-4 text-right">
                                                <button
                                                    onClick={() => handleToggleModule(module.key)}
                                                    className="text-xs font-semibold text-gray-600 hover:text-black px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
                                                >
                                                    Toggle
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
