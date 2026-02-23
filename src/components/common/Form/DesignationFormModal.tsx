"use client";

import { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { toast } from 'sonner';
import { createDesignation, updateDesignation } from "@/services/designationService";

interface DesignationFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentId: string;
    departmentName: string;
    designationToEdit?: any;
    onSuccess: () => void;
}

export default function DesignationFormModal({
    isOpen,
    onClose,
    departmentId,
    departmentName,
    designationToEdit,
    onSuccess
}: DesignationFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        designation_name: "",
        level: 1,
        description: "" // Keep it in state but hidden from UI
    });

    useEffect(() => {
        if (designationToEdit) {
            setFormData({
                designation_name: designationToEdit.designation_name,
                level: designationToEdit.level || 1,
                description: designationToEdit.description || ""
            });
        } else {
            setFormData({
                designation_name: "",
                level: 1,
                description: ""
            });
        }
    }, [designationToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'level' ? parseInt(value) || 1 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!departmentId) {
            toast.error("Department context missing. Cannot create designation.");
            return;
        }

        setLoading(true);

        try {
            const data = {
                ...formData,
                department: departmentId
            };

            if (designationToEdit) {
                await updateDesignation(designationToEdit._id, data);
                toast.success("Designation updated successfully");
            } else {
                await createDesignation(data);
                toast.success("Designation created successfully");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Save Designation Error:', error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to save designation";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-lg rounded-3xl border border-orange-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50/30">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {designationToEdit ? 'Edit Designation' : 'Add New Designation'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-0.5">
                            For <span className="text-orange-600 font-semibold">{departmentName}</span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 shadow-sm"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-8 space-y-6">
                        {/* Designation Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Designation Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="designation_name"
                                value={formData.designation_name}
                                onChange={handleChange}
                                placeholder="e.g. SENIOR MANAGER"
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all uppercase"
                                required
                                autoFocus
                            />
                        </div>

                        {/* Hierarchical Level */}
                        <div>
                            <div className="space-y-4">
                                <label htmlFor="level" className="text-sm font-semibold text-gray-700">Hierarchy Level</label>
                                <div className="flex flex-col gap-2">
                                    <input
                                        id="level"
                                        type="number"
                                        min="1"
                                        max="100"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                        className="w-full h-12 px-4 border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl transition-all font-semibold text-lg bg-white outline-none"
                                        placeholder="e.g. 10"
                                    />
                                    <p className="text-[11px] text-gray-500 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                        Tip: Use higher numbers for more senior positions (e.g., Level 10 for Director, Level 1 for Junior). Hierarchy is sorted descending.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-white transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-2 flex items-center justify-center gap-2 px-8 py-3 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-300 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all transform active:scale-95"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Save size={18} />
                            )}
                            {designationToEdit ? 'Update Changes' : 'Save Designation'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
