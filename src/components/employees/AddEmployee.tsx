import React, { useState, useEffect } from 'react';
import { X, Save, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import BasicInformation from '@/components/common/Form/BasicInformation';
import OfficeDetails from './Form/OfficeDetails';
import AddressDetails from '@/components/common/Form/AddressDetails';
import EmergencyContact from './Form/EmergencyContact';
import IdentityProofDetails from './Form/IdentityProofDetails';
import BankDetails from './Form/BankDetails';
import SecuritySettings from './Form/SecuritySettings';

interface AddEmployeeProps {
    onClose: () => void;
    onSuccess: () => void;
    editData?: any; // If provided, we are in edit mode
}

const AddEmployee: React.FC<AddEmployeeProps> = ({ onClose, onSuccess, editData }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        // Initial state
        name: '',
        phone: '',
        whatsapp_number: '',
        // ... other fields will be handled by components
    });

    const processUserData = (data: any) => {
        const transformedData = { ...data };

        // 1. Handle Populated Fields (Extract IDs)
        ['department', 'role', 'job_type', 'employee_category', 'team'].forEach(field => {
            if (data[field] && typeof data[field] === 'object') {
                transformedData[field] = data[field]._id;
            }
        });

        // 2. Handle Reporting Manager
        if (data.reporting_manager && typeof data.reporting_manager === 'object') {
            transformedData.manager = data.reporting_manager._id;
        } else if (data.reporting_manager) {
            transformedData.manager = data.reporting_manager;
        }

        // 3. Handle Bank Details (Flatten)
        if (data.bank_details) {
            transformedData.bank_name = data.bank_details.bank_name;
            transformedData.account_holder_name = data.bank_details.account_holder_name;
            transformedData.account_number = data.bank_details.account_number;
            transformedData.upi_id = data.bank_details.upi_id;
        }

        return transformedData;
    };

    useEffect(() => {
        if (editData) {
            setFormData(processUserData(editData));
        }
    }, [editData]);

    const tabs = [
        { id: 'basic', label: 'Basic Info' },
        { id: 'address', label: 'Address' },
        { id: 'office', label: 'Office' },
        { id: 'bank', label: 'Bank' },
        { id: 'emergency', label: 'Emergency' },
        { id: 'documents', label: 'Documents' },
        { id: 'security', label: 'Security' }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const fetchUserData = async () => {
        if (!editData?._id) return;
        try {
            const response = await axios.get(`${API_URL}/api/users/${editData._id}`);
            setFormData(processUserData(response.data));
        } catch (error) {
            console.error("Failed to refresh user data", error);
        }
    };

    const handleSubmit = async () => {
        // Basic Validation
        if (!formData.name || !formData.phone || !formData.whatsapp_number) {
            toast.error("Please fill all mandatory fields (Name, Mobile, WhatsApp)");
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();

            // Append all form data
            // Prepare Bank Details (Merge nested and flat, preferring flat edits)
            const bankDetails = { ...(formData.bank_details || {}) };
            if (formData.bank_name) bankDetails.bank_name = formData.bank_name;
            if (formData.account_holder_name) bankDetails.account_holder_name = formData.account_holder_name;
            if (formData.account_number) bankDetails.account_number = formData.account_number;
            if (formData.upi_id) bankDetails.upi_id = formData.upi_id;

            // fields to exclude from main loop
            const bankKeys = ['bank_details', 'bank_name', 'account_holder_name', 'account_number', 'upi_id'];
            const objectIdFields = ['department', 'role', 'job_type', 'employee_category', 'team', 'manager'];

            // Append all form data
            Object.keys(formData).forEach(key => {
                if (bankKeys.includes(key)) return; // Handle bank details separately

                // Skip empty ObjectId fields to prevent CastErrors
                if (objectIdFields.includes(key) && !formData[key]) return;

                if (key === 'profile_photo' && formData[key] instanceof File) {
                    data.append('profile_photo', formData[key]);
                } else if (typeof formData[key] === 'object' && formData[key] !== null && !(formData[key] instanceof File)) {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key] || '');
                }
            });

            // Append consolidated Bank Details
            if (bankDetails.bank_name) data.append('bank_name', bankDetails.bank_name);
            if (bankDetails.account_holder_name) data.append('account_holder_name', bankDetails.account_holder_name);
            if (bankDetails.account_number) data.append('account_number', bankDetails.account_number);
            if (bankDetails.upi_id) data.append('upi_id', bankDetails.upi_id);


            let response;
            if (editData) {
                response = await axios.put(`${API_URL}/api/users/${editData._id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Employee updated successfully");
            } else {
                response = await axios.post(`${API_URL}/api/users`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Employee created successfully");
            }
            onSuccess();
        } catch (error: any) {
            console.error("Submit Error:", error);
            toast.error(error.response?.data?.message || "Failed to save employee");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-3xl border border-orange-100 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-orange-50/30">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editData ? 'Edit Employee' : 'Add New Employee'}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {editData ? 'Update employee details' : 'Fill in the details to register a new employee'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 overflow-x-auto bg-white sticky top-0 z-10">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-4 text-sm font-semibold transition-all relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-orange-600 bg-orange-50/50'
                                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.3)]" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    {activeTab === 'basic' && (
                        <BasicInformation
                            formData={formData}
                            handleChange={handleChange}
                            setFormData={setFormData}
                        />
                    )}
                    {activeTab === 'address' && (
                        <AddressDetails
                            formData={formData}
                            handleChange={handleChange}
                            setFormData={setFormData}
                        />
                    )}
                    {activeTab === 'office' && (
                        <OfficeDetails
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}
                    {activeTab === 'bank' && (
                        <BankDetails
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}
                    {activeTab === 'emergency' && (
                        <EmergencyContact
                            formData={formData}
                            handleChange={handleChange}
                        />
                    )}
                    {activeTab === 'documents' && (
                        <IdentityProofDetails
                            formData={formData}
                            handleChange={handleChange}
                            setFormData={setFormData}
                        />
                    )}
                    {activeTab === 'security' && (
                        <SecuritySettings
                            formData={formData}
                            isEditing={!!editData}
                            refreshData={fetchUserData}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-2.5 bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl font-bold shadow-lg shadow-orange-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Employee
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEmployee;
