"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from 'sonner';
import BasicInformation from "@/components/common/Form/BasicInformation";
import AddressDetails from "@/components/common/Form/AddressDetails";

interface CustomerB2CFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit?: any;
    onSave: () => void;
    service: {
        create: (data: any) => Promise<any>;
        update: (id: string, data: any) => Promise<any>;
    };
}

export default function CustomerB2CFormModal({ isOpen, onClose, itemToEdit, onSave, service }: CustomerB2CFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        // Basic Info
        name: "", // Full Name
        father_name: "",
        gender: "",
        dob: "",

        // Contact Details
        phone: "",
        whatsapp_number: "",
        alternate_mobile_number: "",
        email: "",

        // Address fields
        pincode: "",
        state: "",
        district: "",
        tehsil: "",
        village: "",
        address_line: "",

        customer_type: "B2C",
        status: "Active"
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData({
                    ...itemToEdit,
                    // Flattening fields if necessary, or assuming API returns flat structure
                    name: itemToEdit.name || "",
                    father_name: itemToEdit.father_name || "",
                    gender: itemToEdit.gender || "",
                    dob: itemToEdit.dob || "",

                    phone: itemToEdit.phone || "",
                    whatsapp_number: itemToEdit.whatsapp_number || "",
                    alternate_mobile_number: itemToEdit.alternate_mobile_number || "",
                    email: itemToEdit.email || "",

                    pincode: itemToEdit.pincode || "",
                    state: itemToEdit.state || "",
                    district: itemToEdit.district || "",
                    tehsil: itemToEdit.tehsil || "",
                    village: itemToEdit.village || "",
                    address_line: itemToEdit.address_line || "",

                    customer_type: "B2C",
                    status: itemToEdit.status || "Active"
                });
            } else {
                // Reset
                setFormData({
                    name: "",
                    father_name: "",
                    gender: "",
                    dob: "",
                    phone: "",
                    whatsapp_number: "",
                    alternate_mobile_number: "",
                    email: "",
                    pincode: "",
                    state: "",
                    district: "",
                    tehsil: "",
                    village: "",
                    address_line: "",
                    customer_type: "B2C",
                    status: "Active"
                });
            }
        }
    }, [isOpen, itemToEdit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (itemToEdit) {
                await service.update(itemToEdit._id, formData);
                toast.success("Customer updated successfully");
            } else {
                await service.create(formData);
                toast.success("Customer added successfully");
            }
            if (onSave) onSave();
            onClose();
        } catch (error: any) {
            console.error("Failed to save customer", error);
            toast.error(error.response?.data?.message || "Failed to save customer");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 scrollbar-hide">
                <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 p-6 flex justify-between items-center z-10">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {itemToEdit ? "Edit Farmer" : "Add New Farmer"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">

                    {/* Basic Information Section */}
                    <BasicInformation
                        formData={formData}
                        handleChange={handleInputChange}
                        setFormData={setFormData}
                        showProfilePhoto={false}
                        personType="Farmer"
                    />

                    {/* Address Details Section */}
                    <AddressDetails
                        formData={formData}
                        handleChange={handleInputChange as any}
                        setFormData={setFormData}
                    />

                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : (itemToEdit ? "Save Changes" : "Add Farmer")}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
