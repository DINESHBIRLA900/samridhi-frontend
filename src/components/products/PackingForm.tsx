"use client";

import React, { useState } from 'react';
import { X, Save, Box } from 'lucide-react';

interface PackingFormProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function PackingForm({ onClose, onSubmit }: PackingFormProps) {
    const [formData, setFormData] = useState({
        name: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-md m-4 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add New Packing</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Define a packing size</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form Layout */}
                <div className="p-6">
                    <form id="packing-form" onSubmit={handleSubmit} className="space-y-5">
                        <div className="text-center mb-6">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Box size={24} />
                            </div>
                        </div>

                        {/* Fields */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Packing Name / Size <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                                placeholder="e.g., 500 ml"
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
                        form="packing-form"
                        className="px-6 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all font-bold flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <Save size={18} />
                        Save Packing
                    </button>
                </div>
            </div>
        </div>
    );
}
