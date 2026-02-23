"use client";

import { useState, useEffect } from "react";
import { createTeam, updateTeam } from "@/services/teamService";
import { getCompanyStructure } from "@/services/companyStructureService";
import { getUsers } from "@/services/userService";
import { X } from "lucide-react";
import { toast } from 'sonner';

interface TeamFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamToEdit?: any;
    onSave?: () => void;
    title?: string;
}

export default function TeamFormModal({ isOpen, onClose, teamToEdit, onSave, title }: TeamFormModalProps) {
    const [departments, setDepartments] = useState<any[]>([]);
    const [handlers, setHandlers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        team_name: "",
        zone_name: "",
        department: "",
        handler: "",
        status: "Active"
    });

    useEffect(() => {
        if (isOpen) {
            fetchMasterData();
            if (teamToEdit) {
                setFormData({
                    team_name: teamToEdit.team_name,
                    zone_name: teamToEdit.zone_name || "",
                    department: teamToEdit.department?._id || "",
                    handler: teamToEdit.handler?._id || "",
                    status: teamToEdit.status || "Active"
                });
            } else {
                setFormData({
                    team_name: "",
                    zone_name: "",
                    department: "",
                    handler: "",
                    status: "Active"
                });
            }
        }
    }, [isOpen, teamToEdit]);

    const fetchMasterData = async () => {
        try {
            const [deptData, usersData] = await Promise.all([
                getCompanyStructure('department'),
                getUsers()
            ]);
            setDepartments(deptData);
            setHandlers(usersData);
        } catch (error) {
            console.error("Failed to fetch master data", error);
            toast.error("Failed to load options");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Clean payload: remove empty strings for ObjectId fields
            const payload: any = { ...formData };
            if (!payload.department) delete payload.department;
            if (!payload.handler) delete payload.handler;

            if (teamToEdit) {
                await updateTeam(teamToEdit._id, payload);
                toast.success("Team updated successfully");
            } else {
                await createTeam(payload);
                toast.success("Team created successfully");
            }

            if (onSave) onSave();
            onClose();
        } catch (error: any) {
            console.error("Failed to save team", error);
            const errorMessage = error.response?.data?.message || "Failed to save team";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="sticky top-0 bg-[#1a1f2e]/95 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-10 rounded-t-2xl">
                    <h2 className="text-xl font-semibold text-white">
                        {title || (teamToEdit ? "Edit Team" : "Create New Team")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Team Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.team_name}
                                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                placeholder="Enter Team Name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Zone Name</label>
                            <input
                                type="text"
                                value={formData.zone_name}
                                onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                                placeholder="Enter Zone Name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Department</label>
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                            >
                                <option value="">Select Department</option>
                                {departments.map(d => (
                                    <option key={d._id} value={d._id}>{d.department_name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Handler (Manager)</label>
                            <select
                                value={formData.handler}
                                onChange={(e) => setFormData({ ...formData, handler: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
                            >
                                <option value="">Select Handler</option>
                                {handlers.map(u => (
                                    <option key={u._id} value={u._id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Status</label>
                            <div className="flex bg-black/20 rounded-xl p-1 border border-white/10 w-2/3">
                                {['Active', 'Inactive'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${formData.status === status
                                            ? status === 'Active'
                                                ? 'bg-emerald-500 text-white shadow-lg'
                                                : 'bg-red-500 text-white shadow-lg'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-gray-300 hover:bg-white/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : (teamToEdit ? "Save Changes" : "Create Team")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
