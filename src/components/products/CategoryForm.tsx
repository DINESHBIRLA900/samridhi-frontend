"use client";

import React, { useState } from 'react';
import { X, Upload, Save, LayoutGrid } from 'lucide-react';
import { toast } from 'sonner';

interface CategoryFormProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function CategoryForm({ onClose, onSubmit }: CategoryFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        image: null as File | null
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                setFormData(prev => ({ ...prev, image: file }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Category Form Submitted:', formData);
        toast.success('Category saved successfully');
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-lg m-4 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add New Category</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Create a new product category</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                        title="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Layout */}
                <div className="p-6">
                    <form id="category-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* Image Section */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">Category Image</label>
                            <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center cursor-pointer group overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Category" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-white font-medium flex items-center gap-2"><Upload size={18} /> Change Image</span>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <LayoutGrid size={24} />
                                        </div>
                                        <span className="block text-sm font-medium text-gray-700">Click to upload image</span>
                                        <span className="block text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                                    </div>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={handleImageUpload} />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                                placeholder="Enter category name"
                            />
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-3xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 hover:bg-white hover:text-gray-900 rounded-xl transition-all font-medium border border-transparent hover:border-gray-200 hover:shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        form="category-form"
                        className="px-6 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all font-bold flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <Save size={18} />
                        Save Category
                    </button>
                </div>
            </div>
        </div>
    );
}
