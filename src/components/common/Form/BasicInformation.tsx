import React, { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface BasicInformationProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
    showProfilePhoto?: boolean;
    personType?: 'Employee' | 'Customer' | 'Farmer';
}

const BasicInformation: React.FC<BasicInformationProps> = ({ formData, handleChange, setFormData, showProfilePhoto = true, personType = 'Employee' }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(formData.profile_photo_preview || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create preview URL
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Update parent state
            setFormData((prev: any) => ({
                ...prev,
                profile_photo_preview: url,
                profile_photo: file
            }));
        }
    };

    const handleRemovePhoto = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFormData((prev: any) => ({
            ...prev,
            profile_photo_preview: null,
            profile_photo: null
        }));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                Personal Information
            </h3>

            {/* Profile Photo Section */}
            {showProfilePhoto && (
                <div className="flex flex-col items-center justify-center mb-10 pb-10 border-b border-gray-100">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 bg-orange-50/50 flex items-center justify-center shadow-inner">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Camera className="w-12 h-12 text-orange-200" />
                            )}
                        </div>

                        {previewUrl && (
                            <button
                                onClick={handleRemovePhoto}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                title="Remove Photo"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="mt-6 flex gap-4">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                            name="profile_photo"
                        />

                        <button
                            onClick={triggerFileInput}
                            className="flex items-center gap-2 px-6 py-2.5 bg-orange-50 text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-100 transition-all font-semibold shadow-sm"
                        >
                            <Upload className="w-4 h-4" />
                            {previewUrl ? 'Change Photo' : 'Upload Photo'}
                        </button>
                    </div>
                    <p className="mt-3 text-xs text-gray-500">
                        Supported formats: JPG, PNG. Max size: 5MB.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Full Name */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {personType} Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter full name"
                        required
                    />
                </div>

                {/* Father's Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Father's Name
                    </label>
                    <input
                        type="text"
                        name="father_name"
                        value={formData.father_name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter father's name"
                    />
                </div>

                {/* Gender */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Gender
                    </label>
                    <select
                        name="gender"
                        value={formData.gender || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E)] bg-size-[1.25rem_1.25rem] bg-position-[right_0.5rem_center] bg-no-repeat pr-10"
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date of Birth (DOB)
                    </label>
                    <input
                        type="date"
                        name="dob"
                        value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                    />
                </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-8 mt-12 pt-8 border-t border-gray-100 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {/* Mobile Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter mobile number"
                        required
                    />
                </div>

                {/* What's app Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What's app Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="whatsapp_number"
                        value={formData.whatsapp_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter WhatsApp number"
                        required
                    />
                </div>

                {/* Alternate Mobile Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Alternate Mobile Number
                    </label>
                    <input
                        type="text"
                        name="alternate_mobile_number"
                        value={formData.alternate_mobile_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter alternate mobile number"
                    />
                </div>

                {/* Email ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email ID
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter email ID"
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInformation;
