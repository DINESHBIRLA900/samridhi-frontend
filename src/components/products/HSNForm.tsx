"use client";

import React, { useState } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface HSNFormProps {
    onClose: () => void;
    onSubmit: (data: any) => void;
}

export default function HSNForm({ onClose, onSubmit }: HSNFormProps) {
    const [formData, setFormData] = useState({
        hsn_code: '',
        gst_rate: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // For GST Rate, ensure it's a number or empty
        if (name === 'gst_rate' && value !== '' && isNaN(Number(value))) {
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('HSN Form Submitted:', formData);
        toast.success('HSN Code saved successfully');
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-xl w-full max-w-lg m-4 overflow-hidden animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add HSN/SAC Code</h2>
                        <p className="text-gray-500 text-sm mt-0.5">Register a new HSN or SAC code</p>
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
                    <form id="hsn-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="text-center mb-2">
                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText size={24} />
                            </div>
                        </div>

                        {/* Fields */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">HSN Code <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="hsn_code"
                                    value={formData.hsn_code}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm font-mono"
                                    placeholder="e.g. 123456"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">GST Rate (%) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="gst_rate"
                                        value={formData.gst_rate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm pr-8"
                                        placeholder="18"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">%</span>
                                </div>
                            </div>
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
                        form="hsn-form"
                        className="px-6 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transition-all font-bold flex items-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <Save size={18} />
                        Save Code
                    </button>
                </div>
            </div>
        </div>
    );
}
