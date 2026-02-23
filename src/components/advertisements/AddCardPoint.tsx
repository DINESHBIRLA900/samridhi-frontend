"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface AddCardPointProps {
    onClose: () => void;
    onSuccess: (data?: any) => void;
    editData?: any;
    nextPointNumber?: number;
}

export default function AddCardPoint({
    onClose,
    onSuccess,
    editData,
    nextPointNumber = 1,
}: AddCardPointProps) {
    const [formData, setFormData] = useState({
        pointNumber: nextPointNumber,
        pointName: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                pointNumber: editData.pointNumber || nextPointNumber,
                pointName: editData.pointName || "",
            });
        } else {
            setFormData({
                pointNumber: nextPointNumber,
                pointName: "",
            });
        }
    }, [editData, nextPointNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.pointName.trim()) {
            newErrors.pointName = "Point name is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix the errors in the form");
            return;
        }

        setIsSubmitting(true);

        try {
            const { createCardPoint, updateCardPoint } = await import('@/services/advertisementService');

            if (editData) {
                // Update existing point
                const response = await updateCardPoint(editData._id, {
                    pointName: formData.pointName
                });
                onSuccess(response.data);
            } else {
                // Create new point
                const response = await createCardPoint({
                    pointName: formData.pointName
                });
                onSuccess(response.data);
            }
        } catch (error: any) {
            console.error("Failed to save card point", error);
            toast.error(error.response?.data?.message || "Failed to save card point");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#1e293b] border-b border-white/10 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                        {editData ? "Edit Card Point" : "Add Card Point"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Point Number (Auto-generated, Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Point Number <span className="text-emerald-400">(Auto Generated)</span>
                        </label>
                        <input
                            type="text"
                            name="pointNumber"
                            value={formData.pointNumber}
                            readOnly
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                    </div>

                    {/* Point Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Point Name <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            name="pointName"
                            value={formData.pointName}
                            onChange={handleChange}
                            rows={3}
                            className={`w-full px-4 py-3 bg-white/5 border ${errors.pointName ? "border-red-500" : "border-white/10"
                                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none`}
                            placeholder="Enter point name or description"
                        />
                        {errors.pointName && (
                            <p className="mt-1 text-sm text-red-400">{errors.pointName}</p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : editData
                                    ? "Update Point"
                                    : "Add Point"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
