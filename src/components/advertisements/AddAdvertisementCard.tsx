"use client";

import { useState, useEffect } from "react";
import { X, Upload, Calendar } from "lucide-react";
import { toast } from "sonner";

interface AddAdvertisementCardProps {
    onClose: () => void;
    onSuccess: () => void;
    editData?: any;
    cardPointId?: string; // Card point ID for creating new cards
}

export default function AddAdvertisementCard({
    onClose,
    onSuccess,
    editData,
    cardPointId,
}: AddAdvertisementCardProps) {
    const [formData, setFormData] = useState({
        title: "",
        image: null as File | null,
        imagePreview: "",
        status: "Active",
        fromDate: "",
        toDate: "",
    });

    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                image: null,
                imagePreview: editData.image || "",
                status: editData.status || "Active",
                fromDate: editData.fromDate || "",
                toDate: editData.toDate || "",
            });
        }
    }, [editData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("Please select a valid image file");
                return;
            }

            // Validate file size (max 3MB)
            if (file.size > 3 * 1024 * 1024) {
                toast.error("Image size should be less than 3MB");
                return;
            }

            setFormData({
                ...formData,
                image: file,
                imagePreview: URL.createObjectURL(file),
            });
            setErrors({ ...errors, image: "" });
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors: any = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!editData && !formData.image) {
            newErrors.image = "Image is required";
        }

        if (!formData.fromDate) {
            newErrors.fromDate = "From date is required";
        }

        if (!formData.toDate) {
            newErrors.toDate = "To date is required";
        }

        if (formData.fromDate && formData.toDate) {
            const from = new Date(formData.fromDate);
            const to = new Date(formData.toDate);
            if (from >= to) {
                newErrors.toDate = "To date must be after from date";
            }
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
            const { createAdvertisementCard, updateAdvertisementCard } = await import('@/services/advertisementService');

            // Create FormData for image upload
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            if (formData.image) formDataToSend.append("image", formData.image);
            formDataToSend.append("status", formData.status);
            formDataToSend.append("fromDate", formData.fromDate);
            formDataToSend.append("toDate", formData.toDate);

            if (editData) {
                // Update existing card
                await updateAdvertisementCard(editData._id, formDataToSend);
            } else {
                // Create new card - cardPointId is required
                if (!cardPointId) {
                    toast.error("Card point ID is missing");
                    return;
                }
                formDataToSend.append("cardPointId", cardPointId);
                await createAdvertisementCard(formDataToSend);
            }

            onSuccess();
        } catch (error: any) {
            console.error("Failed to save card", error);
            toast.error(error.response?.data?.message || "Failed to save card");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-[#1e293b] border-b border-white/10 p-6 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">
                        {editData ? "Edit Advertisement Card" : "Add Advertisement Card"}
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
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 bg-white/5 border ${errors.title ? "border-red-500" : "border-white/10"
                                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors`}
                            placeholder="Enter card title"
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Image <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed ${errors.image ? "border-red-500" : "border-white/20"
                                    } rounded-lg cursor-pointer hover:border-emerald-500 transition-colors bg-white/5`}
                            >
                                {formData.imagePreview ? (
                                    <img
                                        src={formData.imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-contain rounded-lg"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload size={40} className="mb-2" />
                                        <p className="text-sm">Click to upload image</p>
                                        <p className="text-xs mt-1">PNG, JPG up to 3MB</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.image && (
                            <p className="mt-1 text-sm text-red-400">{errors.image}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-400">
                            Recommended sizes: 1200x600, 800x400
                        </p>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Status <span className="text-red-400">*</span>
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors"
                        >
                            <option value="Active" className="bg-[#1e293b]">
                                Active
                            </option>
                            <option value="Inactive" className="bg-[#1e293b]">
                                Inactive
                            </option>
                        </select>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* From Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                From Date <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white/5 border ${errors.fromDate ? "border-red-500" : "border-white/10"
                                        } rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                                />
                                <Calendar
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    size={20}
                                />
                            </div>
                            {errors.fromDate && (
                                <p className="mt-1 text-sm text-red-400">{errors.fromDate}</p>
                            )}
                        </div>

                        {/* To Date */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                To Date <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white/5 border ${errors.toDate ? "border-red-500" : "border-white/10"
                                        } rounded-lg text-white focus:outline-none focus:border-emerald-500 transition-colors`}
                                />
                                <Calendar
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    size={20}
                                />
                            </div>
                            {errors.toDate && (
                                <p className="mt-1 text-sm text-red-400">{errors.toDate}</p>
                            )}
                        </div>
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
                            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? "Saving..."
                                : editData
                                    ? "Update Card"
                                    : "Add Card"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
