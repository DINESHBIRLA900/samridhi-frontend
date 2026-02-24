"use client";

import { useState, useEffect } from "react";
import { createTeam, updateTeam } from "@/services/teamService";
import { getCompanyStructure } from "@/services/companyStructureService";
import { getUsers } from "@/services/userService";
import { X, Save } from "lucide-react";
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
            setHandlers(usersData.users || []);
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
                toast.success("TEAM UPDATED SUCCESSFULLY");
            } else {
                await createTeam(payload);
                toast.success("TEAM CREATED SUCCESSFULLY");
            }

            if (onSave) onSave();
            onClose();
        } catch (error: any) {
            console.error("Failed to save team", error);
            const errorMessage = error.response?.data?.message || "FAILED TO SAVE TEAM";
            toast.error(errorMessage.toUpperCase());
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white border border-orange-100 rounded-3xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50/30">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase">
                        {title || (teamToEdit ? "Edit Team" : "Create New Team")}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col">
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 uppercase">Team Name *</label>
                            <input
                                type="text"
                                required
                                value={formData.team_name}
                                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all uppercase"
                                placeholder="ENTER TEAM NAME"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 uppercase">Zone Name</label>
                            <input
                                type="text"
                                value={formData.zone_name}
                                onChange={(e) => setFormData({ ...formData, zone_name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all uppercase"
                                placeholder="ENTER ZONE NAME"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 uppercase">Department</label>
                                <select
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none"
                                >
                                    <option value="">SELECT DEPARTMENT</option>
                                    {departments.map(d => (
                                        <option key={d._id} value={d._id}>{d.department_name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 uppercase">Handler (Manager)</label>
                                <select
                                    value={formData.handler}
                                    onChange={(e) => setFormData({ ...formData, handler: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none"
                                >
                                    <option value="">SELECT HANDLER</option>
                                    {handlers.map(u => (
                                        <option key={u._id} value={u._id}>{u.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 uppercase">Status</label>
                            <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200 w-full md:w-2/3">
                                {['Active', 'Inactive'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, status })}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all uppercase ${formData.status === status
                                            ? status === 'Active'
                                                ? 'bg-emerald-500 text-white shadow-lg'
                                                : 'bg-red-500 text-white shadow-lg'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-white transition-colors font-medium uppercase"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-2 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-300 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all transform active:scale-95 disabled:active:scale-100 uppercase"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {teamToEdit ? 'Save Changes' : 'Create Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
