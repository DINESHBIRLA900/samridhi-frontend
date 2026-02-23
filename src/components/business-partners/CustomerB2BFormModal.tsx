"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Upload } from "lucide-react";
import { toast } from 'sonner';
import AddressDetails from "@/components/common/Form/AddressDetails";
import ContactPerson from "./Form/ContactPerson";

interface CustomerB2BFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit?: any;
    onSave: () => void;
    service: {
        create: (data: any) => Promise<any>;
        update: (id: string, data: any) => Promise<any>;
    };
}

export default function CustomerB2BFormModal({ isOpen, onClose, itemToEdit, onSave, service }: CustomerB2BFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        branch_type: "Head Office",
        name: "", // Company Name
        gstin: "",
        phone: "",
        whatsapp_number: "",
        email: "",
        website: "",
        contact_persons: [{ person_name: '', number: '', whatsapp_number: '', mail_id: '' }], // Start with 1 empty contact
        // Address fields (flattened for AddressDetails compatibility)
        pincode: "",
        state: "",
        district: "",
        tehsil: "",
        village: "",
        address_line: "",
        customer_type: "B2B",
        status: "Active",
        // New Fields
        business_photos: [], // Array of files or existing photo objects
        license_details: [], // Array of { license_name, license_number, license_image }
        cancelled_cheque: { cheque_number: '', image: null },
        bank_details: { bank_name: '', account_number: '', re_enter_account_number: '', ifsc_code: '', account_holder_name: '', upi_id: '' },
        transport_details: { transport_name: '', transport_number: '' },
        identity_proof_details: { aadhaar_number: '', pan_number: '', driving_license_number: '' },
        business_address: { pincode: '', state: '', district: '', tehsil: '', village: '', address_line: '' }
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                // Populate Logic - assuming itemToEdit has these structures
                setFormData({
                    ...itemToEdit,
                    branch_type: itemToEdit.branch_type || "Head Office",
                    phone: itemToEdit.phone || "",
                    whatsapp_number: itemToEdit.whatsapp_number || "",
                    email: itemToEdit.email || "",
                    website: itemToEdit.website || "",
                    contact_persons: itemToEdit.contact_persons && itemToEdit.contact_persons.length > 0
                        ? itemToEdit.contact_persons
                        : [{ person_name: '', number: '', whatsapp_number: '', mail_id: '' }],
                    // Ensure address fields are present
                    pincode: itemToEdit.pincode || "",
                    state: itemToEdit.state || "",
                    district: itemToEdit.district || "",
                    tehsil: itemToEdit.tehsil || "",
                    village: itemToEdit.village || "",
                    address_line: itemToEdit.address_line || "",
                    // New Fields Population
                    business_photos: itemToEdit.business_photos || [],
                    license_details: (itemToEdit.license_details || []).map((l: any) => ({
                        license_name: l.license_name || l.name || "",
                        license_number: l.license_number || l.number || "",
                        license_image: l.license_image || l.image || null
                    })),
                    cancelled_cheque: {
                        cheque_number: itemToEdit.cancelled_cheque?.cheque_number || itemToEdit.cancelled_cheque?.number || "",
                        image: itemToEdit.cancelled_cheque?.image || null
                    },
                    bank_details: itemToEdit.bank_details || { bank_name: '', account_number: '', re_enter_account_number: '', ifsc_code: '', account_holder_name: '', upi_id: '' },
                    transport_details: itemToEdit.transport_details || { transport_name: '', transport_number: '' },
                    identity_proof_details: itemToEdit.identity_proof_details || { aadhaar_number: '', pan_number: '', driving_license_number: '' },
                    business_address: itemToEdit.business_address || { pincode: '', state: '', district: '', tehsil: '', village: '', address_line: '' },
                    customer_type: "B2B"
                });
            } else {
                // Reset
                setFormData({
                    branch_type: "Head Office",
                    name: "",
                    gstin: "",
                    phone: "",
                    whatsapp_number: "",
                    email: "",
                    website: "",
                    contact_persons: [{ person_name: '', number: '', whatsapp_number: '', mail_id: '' }],
                    pincode: "",
                    state: "",
                    district: "",
                    tehsil: "",
                    village: "",
                    address_line: "",
                    customer_type: "B2B",
                    status: "Active",
                    business_photos: [],
                    license_details: [],
                    cancelled_cheque: { cheque_number: '', image: null },
                    bank_details: { bank_name: '', account_number: '', re_enter_account_number: '', ifsc_code: '', account_holder_name: '', upi_id: '' },
                    transport_details: { transport_name: '', transport_number: '' },
                    identity_proof_details: { aadhaar_number: '', pan_number: '', driving_license_number: '' },
                    business_address: { pincode: '', state: '', district: '', tehsil: '', village: '', address_line: '' }
                });
            }
        }
    }, [isOpen, itemToEdit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (section: string, field: string, value: any) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleBusinessAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        handleNestedChange('business_address', name, value);
    };

    // Handler for Contact Person changes
    const handleContactPersonChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const updatedContacts = [...formData.contact_persons];
        updatedContacts[index] = { ...updatedContacts[index], [name]: value };
        setFormData((prev: any) => ({ ...prev, contact_persons: updatedContacts }));
    };

    const addContactPerson = () => {
        setFormData((prev: any) => ({
            ...prev,
            contact_persons: [...prev.contact_persons, { person_name: '', number: '', whatsapp_number: '', mail_id: '' }]
        }));
    };

    const removeContactPerson = (index: number) => {
        if (formData.contact_persons.length === 1) {
            toast.error("At least one contact person is required");
            return;
        }
        const updatedContacts = formData.contact_persons.filter((_: any, i: number) => i !== index);
        setFormData((prev: any) => ({ ...prev, contact_persons: updatedContacts }));
    };

    // License Handlers
    const addLicense = () => {
        setFormData((prev: any) => ({
            ...prev,
            license_details: [...prev.license_details, { license_name: '', license_number: '', license_image: null }]
        }));
    };

    const handleLicenseChange = (index: number, field: string, value: any) => {
        const updatedLicenses = [...formData.license_details];
        updatedLicenses[index] = { ...updatedLicenses[index], [field]: value };
        setFormData((prev: any) => ({ ...prev, license_details: updatedLicenses }));
    };

    const removeLicense = (index: number) => {
        const updatedLicenses = formData.license_details.filter((_: any, i: number) => i !== index);
        setFormData((prev: any) => ({ ...prev, license_details: updatedLicenses }));
    };

    // File Handler Helper
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (file: File) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size should be less than 5MB");
                return;
            }
            callback(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Validate Bank Details if entered
            if (formData.bank_details.account_number && formData.bank_details.account_number !== formData.bank_details.re_enter_account_number) {
                toast.error("Account numbers do not match");
                setLoading(false);
                return;
            }

            // Construct FormData
            const formPayload = new FormData();

            // Append simple fields
            Object.keys(formData).forEach(key => {
                if (key === 'business_photos' || key === 'license_details' || key === 'cancelled_cheque' || key === 'bank_details' || key === 'transport_details' || key === 'identity_proof_details' || key === 'contact_persons' || key === 'business_address') {
                    return; // Handle separately
                }
                formPayload.append(key, formData[key]);
            });

            // Append complex fields as JSON strings or iterate
            formPayload.append('contact_persons', JSON.stringify(formData.contact_persons));
            formPayload.append('bank_details', JSON.stringify(formData.bank_details));
            formPayload.append('transport_details', JSON.stringify(formData.transport_details));
            formPayload.append('identity_proof_details', JSON.stringify(formData.identity_proof_details));
            formPayload.append('business_address', JSON.stringify(formData.business_address));

            // Handle Files
            // Business Photos
            if (formData.business_photos && formData.business_photos.length > 0) {
                formData.business_photos.forEach((photo: any) => {
                    if (photo instanceof File) {
                        formPayload.append('business_photos', photo);
                    } else {
                        // Existing photos - assumption: backend handles keeping existing if not provided, or we send a list of kept IDs
                        // For simplicity in this edit, we might just append new files. 
                        // Ideally, we should send 'existing_business_photos' IDs.
                        // Let's assume we append existing as JSON string if backend supports it, or just files.
                        // If we are strictly appending files, existing ones might be lost if backend replaces arrays.
                        // Correct approach: Separate existing and new.
                        formPayload.append('existing_business_photos', JSON.stringify(photo));
                    }
                });
            }

            // Licenses - Complicated because it's an array of objects with files.
            // Often easiest to send metadata as JSON and files separately with indices.
            const licenseMeta = formData.license_details.map((l: any, index: number) => ({
                license_name: l.license_name,
                license_number: l.license_number,
                // We'll map the file by index in separate field
                fileIndex: l.license_image instanceof File ? index : -1,
                existingImage: !(l.license_image instanceof File) ? l.license_image : null
            }));
            formPayload.append('license_details_meta', JSON.stringify(licenseMeta));
            formData.license_details.forEach((l: any) => {
                if (l.license_image instanceof File) {
                    formPayload.append('license_images', l.license_image);
                }
            });

            // Cancelled Cheque
            formPayload.append('cancelled_cheque_meta', JSON.stringify({ cheque_number: formData.cancelled_cheque.cheque_number, existingImage: !(formData.cancelled_cheque.image instanceof File) ? formData.cancelled_cheque.image : null }));
            if (formData.cancelled_cheque.image instanceof File) {
                formPayload.append('cancelled_cheque_image', formData.cancelled_cheque.image);
            }

            if (itemToEdit) {
                await service.update(itemToEdit._id, formPayload);
                toast.success("Client updated successfully");
            } else {
                await service.create(formPayload);
                toast.success("Client added successfully");
            }
            if (onSave) onSave();
            onClose();
        } catch (error: any) {
            console.error("Failed to save client", error);
            toast.error(error.response?.data?.message || "Failed to save client");
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
                        {itemToEdit ? "Edit Dealer" : "Add New Dealer"}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Branch Selection */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Office Type</h3>
                        <div className="flex gap-6">
                            {['Head Office', 'Branch Office'].map((type) => (
                                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${formData.branch_type === type ? 'border-orange-500' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                        {formData.branch_type === type && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="branch_type"
                                        value={type}
                                        checked={formData.branch_type === type}
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />
                                    <span className={`text-sm ${formData.branch_type === type ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Company Details */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Business Details</h3>
                        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        placeholder="Enter Business Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN</label>
                                    <input
                                        type="text"
                                        name="gstin"
                                        value={formData.gstin}
                                        onChange={(e) => {
                                            // Auto uppercase for GST
                                            handleInputChange({ target: { name: 'gstin', value: e.target.value.toUpperCase() } } as any)
                                        }}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono"
                                        placeholder="Enter GSTIN"
                                    />
                                </div>
                            </div>

                            {/* Business Contact Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        placeholder="Official Phone Number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        name="whatsapp_number"
                                        value={formData.whatsapp_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        placeholder="WhatsApp Number"
                                        maxLength={10}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        placeholder="official@business.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        placeholder="https://business.com"
                                    />
                                </div>
                            </div>

                            {/* Business Photos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Business Photos</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setFormData((prev: any) => ({ ...prev, business_photos: [...prev.business_photos, ...Array.from(e.target.files || [])] }));
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                />
                                <div className="flex gap-2 flex-wrap mt-2">
                                    {formData.business_photos && formData.business_photos.map((photo: any, idx: number) => (
                                        <div key={idx} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                                            {photo instanceof File ? (
                                                <img src={URL.createObjectURL(photo)} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <img src={photo.url} alt="existing" className="w-full h-full object-cover" />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setFormData((prev: any) => ({ ...prev, business_photos: prev.business_photos.filter((_: any, i: number) => i !== idx) }))}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-bl-lg p-1"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Business Address Details */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Business Address Details</h3>
                        <AddressDetails
                            formData={formData.business_address}
                            handleChange={handleBusinessAddressChange}
                            setFormData={(setter) => {
                                setFormData((prev: any) => {
                                    if (typeof setter === 'function') {
                                        const updatedFlatState = setter(prev.business_address);
                                        return {
                                            ...prev,
                                            business_address: updatedFlatState
                                        };
                                    } else {
                                        return {
                                            ...prev,
                                            business_address: { ...prev.business_address, ...setter }
                                        };
                                    }
                                });
                            }}
                        />
                    </div>

                    {/* Transport Details */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Transport Details</h3>
                        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Transport Name</label>
                                    <input
                                        type="text"
                                        value={formData.transport_details?.transport_name || ""}
                                        onChange={(e) => handleNestedChange('transport_details', 'transport_name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        placeholder="Enter Transport Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Transport Number</label>
                                    <input
                                        type="text"
                                        value={formData.transport_details?.transport_number || ""}
                                        onChange={(e) => handleNestedChange('transport_details', 'transport_number', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono uppercase"
                                        placeholder="Enter Transport Number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Licenses */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Licenses</h3>
                            <button
                                type="button"
                                onClick={addLicense}
                                className="flex items-center gap-2 text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                <Plus size={14} /> Add License
                            </button>
                        </div>
                        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6 space-y-4">
                            {formData.license_details && formData.license_details.map((license: any, index: number) => (
                                <div key={index} className="flex gap-4 items-end bg-white p-4 rounded-xl relative group shadow-sm border border-orange-100">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs font-medium text-gray-700">License Name</label>
                                        <input
                                            type="text"
                                            value={license?.license_name || ""}
                                            onChange={(e) => handleLicenseChange(index, 'license_name', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
                                            placeholder="e.g. Shop Act"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-xs font-medium text-gray-700">License Number</label>
                                        <input
                                            type="text"
                                            value={license?.license_number || ""}
                                            onChange={(e) => handleLicenseChange(index, 'license_number', e.target.value)}
                                            className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:bg-white focus:border-orange-500 focus:outline-none transition-colors"
                                            placeholder="License No."
                                        />
                                    </div>
                                    <div className="w-32 space-y-2">
                                        <label className="text-xs font-medium text-gray-700">Photo</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileChange(e, (file) => handleLicenseChange(index, 'license_image', file))}
                                                className="hidden"
                                                id={`license-upload-${index}`}
                                            />
                                            <label htmlFor={`license-upload-${index}`} className="block w-full h-9 bg-gray-50 border border-gray-200 rounded-lg text-xs leading-9 text-center text-gray-500 cursor-pointer overflow-hidden truncate px-2 hover:border-orange-500 hover:bg-white transition-colors">
                                                {license.license_image ? (license.license_image instanceof File ? license.license_image.name : 'View Image') : 'Upload'}
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeLicense(index)}
                                        className="p-2 text-red-500 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Bank Details & Cancelled Cheque */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Bank Details</h3>

                        {/* The new inner "double box" container */}
                        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Bank Name</label>
                                    <input
                                        type="text"
                                        value={formData.bank_details?.bank_name || ""}
                                        onChange={(e) => handleNestedChange('bank_details', 'bank_name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-orange-500 focus:outline-none transition-all"
                                        placeholder="Enter Bank Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
                                    <input
                                        type="text"
                                        value={formData.bank_details?.account_holder_name || ""}
                                        onChange={(e) => handleNestedChange('bank_details', 'account_holder_name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-orange-500 focus:outline-none transition-all"
                                        placeholder="Enter Account Holder Name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Account Number</label>
                                    <input
                                        type="password"
                                        value={formData.bank_details?.account_number || ""}
                                        onChange={(e) => handleNestedChange('bank_details', 'account_number', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-orange-500 focus:outline-none transition-all"
                                        placeholder="Enter Account Number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Re-enter Account Number</label>
                                    <input
                                        type="text"
                                        value={formData.bank_details?.re_enter_account_number || ""}
                                        onChange={(e) => handleNestedChange('bank_details', 're_enter_account_number', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-xl bg-white border ${formData.bank_details?.account_number && formData.bank_details?.re_enter_account_number && formData.bank_details?.account_number !== formData.bank_details?.re_enter_account_number ? 'border-red-500' : 'border-gray-300'} text-gray-900 focus:border-orange-500 focus:outline-none transition-all`}
                                        placeholder="Re-enter Account Number"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                                    <input
                                        type="text"
                                        value={formData.bank_details?.ifsc_code || ""}
                                        onChange={(e) => handleNestedChange('bank_details', 'ifsc_code', e.target.value.toUpperCase())}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-orange-500 focus:outline-none transition-all font-mono uppercase"
                                        placeholder="IFSC Code"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">UPI ID</label>
                                    <input
                                        type="text"
                                        value={formData.bank_details?.upi_id || ""}
                                        onChange={(e) => handleNestedChange('bank_details', 'upi_id', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-orange-500 focus:outline-none transition-all"
                                        placeholder="user@upi"
                                    />
                                </div>
                            </div>

                            {/* Cancelled Cheque (Inside the same inner container, separated by a line) */}
                            <div className="mt-8 pt-6 border-t border-orange-200/50">
                                <h4 className="text-xs font-semibold text-gray-700 mb-4 uppercase tracking-wider">Cancelled Cheque Details</h4>
                                <div className="flex gap-4 items-start">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Cheque Number</label>
                                        <input
                                            type="text"
                                            value={formData.cancelled_cheque?.cheque_number || ""}
                                            onChange={(e) => handleNestedChange('cancelled_cheque', 'cheque_number', e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:border-orange-500 focus:outline-none"
                                            placeholder="Enter Cheque Number"
                                        />
                                    </div>
                                    <div className="w-40 space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Cheque Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, (file) => handleNestedChange('cancelled_cheque', 'image', file))}
                                            className="hidden"
                                            id="cheque-upload"
                                        />
                                        <label htmlFor="cheque-upload" className="flex flex-col items-center justify-center w-full h-14 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-500 bg-white transition-colors overflow-hidden">
                                            {formData.cancelled_cheque.image ? (
                                                formData.cancelled_cheque.image instanceof File ? (
                                                    <img src={URL.createObjectURL(formData.cancelled_cheque.image)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <img src={formData.cancelled_cheque.image.url} alt="Existing" className="w-full h-full object-cover" />
                                                )
                                            ) : (
                                                <div className="text-center">
                                                    <span className="text-xs text-gray-500 font-medium">Upload Image</span>
                                                </div>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Contact Persons */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Contact Persons</h3>
                            <button
                                type="button"
                                onClick={addContactPerson}
                                className="flex items-center gap-2 text-xs font-medium bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors"
                            >
                                <Plus size={14} /> Add Contact
                            </button>
                        </div>

                        <div className="space-y-6">
                            {formData.contact_persons.map((person: any, index: number) => (
                                <div key={index} className="relative group">
                                    <ContactPerson
                                        formData={person}
                                        handleChange={(e) => handleContactPersonChange(index, e)}
                                    />
                                    {formData.contact_persons.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeContactPerson(index)}
                                            className="absolute -top-3 -right-3 p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 hover:text-red-700 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                                            title="Remove Contact"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Identity Proof Details */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Identity Proof Details</h3>
                        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Aadhaar Number</label>
                                    <input
                                        type="text"
                                        value={formData.identity_proof_details?.aadhaar_number || ""}
                                        onChange={(e) => handleNestedChange('identity_proof_details', 'aadhaar_number', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono"
                                        placeholder="XXXX XXXX XXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
                                    <input
                                        type="text"
                                        value={formData.identity_proof_details?.pan_number || ""}
                                        onChange={(e) => handleNestedChange('identity_proof_details', 'pan_number', e.target.value.toUpperCase())}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono uppercase"
                                        placeholder="ABCDE1234F"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Driving License Number</label>
                                    <input
                                        type="text"
                                        value={formData.identity_proof_details?.driving_license_number || ""}
                                        onChange={(e) => handleNestedChange('identity_proof_details', 'driving_license_number', e.target.value.toUpperCase())}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-mono uppercase"
                                        placeholder="DL-1420110012345"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Personal/Other Address Details */}
                    <div className="space-y-4 border border-orange-200 bg-orange-50/10 p-5 rounded-2xl">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Address Details</h3>
                        <AddressDetails
                            formData={formData}
                            handleChange={handleInputChange}
                            setFormData={setFormData}
                        />
                    </div>

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
                            {loading ? "Saving..." : (itemToEdit ? "Save Changes" : "Add Customer")}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
