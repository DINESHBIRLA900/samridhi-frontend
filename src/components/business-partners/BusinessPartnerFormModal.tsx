"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from 'sonner';
import AddressDetails from "@/components/common/Form/AddressDetails";
import ContactPerson from "./Form/ContactPerson";

interface BusinessPartnerFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    itemToEdit?: any;
    onSave: () => void;
    type: 'Vendor' | 'Customer' | 'Supplier';
    service: {
        create: (data: any) => Promise<any>;
        update: (id: string, data: any) => Promise<any>;
    };
    defaultCustomerType?: string;
}

export default function BusinessPartnerFormModal({ isOpen, onClose, itemToEdit, onSave, type, service, defaultCustomerType = 'B2C' }: BusinessPartnerFormModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<any>({
        branch_type: "Head Office",
        name: "", // Company/Business Name
        contact_person: "", // Legacy single contact person field, kept for compatibility if needed
        email: "",
        phone: "",
        whatsapp_number: "",
        website: "",
        gstin: "",
        contact_persons: [{ person_name: '', number: '', whatsapp_number: '', mail_id: '' }],
        // Address fields
        pincode: "",
        state: "",
        district: "",
        tehsil: "",
        village: "",
        address_line: "",
        address: "", // Legacy address field
        status: "Active",
        customer_type: defaultCustomerType
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setFormData({
                    ...itemToEdit,
                    branch_type: itemToEdit.branch_type || "Head Office",
                    name: itemToEdit.name || "",
                    contact_person: itemToEdit.contact_person || "",
                    email: itemToEdit.email || "",
                    phone: itemToEdit.phone || "",
                    whatsapp_number: itemToEdit.whatsapp_number || "",
                    website: itemToEdit.website || "",
                    gstin: itemToEdit.gstin || "",
                    contact_persons: itemToEdit.contact_persons && itemToEdit.contact_persons.length > 0
                        ? itemToEdit.contact_persons
                        : [{ person_name: '', number: '', whatsapp_number: '', mail_id: '' }],
                    // Address
                    pincode: itemToEdit.pincode || "",
                    state: itemToEdit.state || "",
                    district: itemToEdit.district || "",
                    tehsil: itemToEdit.tehsil || "",
                    village: itemToEdit.village || "",
                    address_line: itemToEdit.address_line || "",
                    address: itemToEdit.address || "",

                    status: itemToEdit.status || "Active",
                    customer_type: itemToEdit.customer_type || defaultCustomerType
                });
            } else {
                // Reset
                setFormData({
                    branch_type: "Head Office",
                    name: "",
                    contact_person: "",
                    email: "",
                    phone: "",
                    whatsapp_number: "",
                    website: "",
                    gstin: "",
                    contact_persons: [{ person_name: '', number: '', whatsapp_number: '', mail_id: '' }],
                    pincode: "",
                    state: "",
                    district: "",
                    tehsil: "",
                    village: "",
                    address_line: "",
                    address: "",
                    status: "Active",
                    customer_type: defaultCustomerType
                });
            }
        }
    }, [isOpen, itemToEdit, defaultCustomerType]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure legacy fields are populated if empty, for safety
            const cleanPayload = { ...formData };

            // Remove system fields that shouldn't be sent in body
            delete cleanPayload._id;
            delete cleanPayload.createdAt;
            delete cleanPayload.updatedAt;
            delete cleanPayload.__v;

            // Remove customer_type for Vendor/Supplier as it's not in their schema
            if (type !== 'Customer') {
                delete cleanPayload.customer_type;
            }

            const payload = {
                ...cleanPayload,
                contact_person: formData.contact_persons[0]?.person_name || formData.contact_person,
                address: formData.address_line || formData.address
            };

            if (itemToEdit) {
                await service.update(itemToEdit._id, payload);
                toast.success(`${type} updated successfully`);
            } else {
                await service.create(payload);
                toast.success(`${type} added successfully`);
            }

            if (onSave) onSave();
            onClose();
        } catch (error: any) {
            console.error(`Failed to save ${type}`, error);
            toast.error(error.response?.data?.message || `Failed to save ${type}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-2 border-gray-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200 scrollbar-hide">
                <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 p-6 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {itemToEdit ? `Edit ${type}` : `Add New ${type}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-800"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {/* Branch Selection */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Office Type</h3>
                        <div className="flex gap-6">
                            {['Head Office', 'Branch Office'].map((branchType) => (
                                <label key={branchType} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.branch_type === branchType ? 'border-orange-500' : 'border-gray-300 group-hover:border-gray-400'}`}>
                                        {formData.branch_type === branchType && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
                                    </div>
                                    <input
                                        type="radio"
                                        name="branch_type"
                                        value={branchType}
                                        checked={formData.branch_type === branchType}
                                        onChange={handleInputChange}
                                        className="hidden"
                                    />
                                    <span className={`text-sm font-medium ${formData.branch_type === branchType ? 'text-gray-800' : 'text-gray-600 group-hover:text-gray-700'}`}>{branchType}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Company Details */}
                    <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6">
                        <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4">Business Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Business Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    placeholder={`Enter ${type} Name`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">GSTIN</label>
                                <input
                                    type="text"
                                    name="gstin"
                                    value={formData.gstin}
                                    onChange={(e) => {
                                        handleInputChange({ target: { name: 'gstin', value: e.target.value.toUpperCase() } } as any)
                                    }}
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="Enter GSTIN"
                                />
                            </div>
                        </div>

                        {/* Business Contact Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Business Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="Official Phone Number"
                                    maxLength={10}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                                <input
                                    type="tel"
                                    name="whatsapp_number"
                                    value={formData.whatsapp_number}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="WhatsApp Number"
                                    maxLength={10}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Business Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="official@business.com"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-gray-700">Website</label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-300 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    placeholder="https://business.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Persons */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider">Contact Persons</h3>
                            <button
                                type="button"
                                onClick={addContactPerson}
                                className="flex items-center gap-2 text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg hover:bg-orange-200 transition-colors"
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
                                            className="absolute -top-3 -right-3 p-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove Contact"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address Details */}
                    <AddressDetails
                        formData={formData}
                        handleChange={handleInputChange}
                        setFormData={setFormData}
                    />

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-300 w-full md:w-1/2">
                            {['Active', 'Inactive'].map((status) => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status })}
                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${formData.status === status
                                        ? status === 'Active'
                                            ? 'bg-emerald-500 text-white shadow-lg'
                                            : 'bg-red-500 text-white shadow-lg'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 -mx-6 -mb-6 px-6 pb-6 rounded-b-2xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all shadow-lg shadow-orange-500/25 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : (itemToEdit ? "Save Changes" : `Add ${type}`)}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
