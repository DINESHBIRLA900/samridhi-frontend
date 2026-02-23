"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Building2, Globe, User, Shield, Eye, Pencil, Check, X, Lock, Image as ImageIcon, FileText, Landmark, Truck } from "lucide-react";
import { toast, Toaster } from 'sonner';
import axios from "axios";
import CustomerB2BFormModal from "@/components/business-partners/CustomerB2BFormModal";
import { updateCustomer } from "@/services/customerService";

// Helper to get single customer
const getCustomerById = async (id: string) => {
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/customers`;
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default function B2BCustomerDashboard() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [customer, setCustomer] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    const fetchCustomer = async () => {
        setLoading(true);
        try {
            const data = await getCustomerById(id);
            setCustomer(data);
        } catch (error) {
            console.error("Failed to fetch customer details", error);
            toast.error("Failed to load customer details");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        await fetchCustomer();
        setIsEditModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-white">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-20 text-gray-400">
                <h2 className="text-2xl font-bold mb-2">Customer Not Found</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    const profileSections = [
        {
            title: "Business Info",
            icon: <Building2 className="text-orange-500" size={20} />,
            data: [
                { label: "Business Name", value: customer.name },
                { label: "Branch Type", value: customer.branch_type },
                { label: "Customer Type", value: customer.customer_type },
                { label: "GSTIN", value: customer.gstin || '-' },
                { label: "Status", value: customer.status, isStatus: true },
            ]
        },
        {
            title: "Contact Details",
            icon: <Phone className="text-blue-500" size={20} />,
            data: [
                { label: "Business Phone", value: customer.phone },
                { label: "WhatsApp Number", value: customer.whatsapp_number },
                { label: "Business Email", value: customer.email },
                { label: "Website", value: customer.website, isLink: true },
            ]
        },

        ...(customer.bank_details ? [{
            title: "Bank Details",
            icon: <Landmark className="text-purple-500" size={20} />,
            data: [
                { label: "Bank Name", value: customer.bank_details.bank_name },
                { label: "Account Holder", value: customer.bank_details.account_holder_name },
                { label: "Account Number", value: customer.bank_details.account_number },
                { label: "IFSC Code", value: customer.bank_details.ifsc_code },
                { label: "UPI ID", value: customer.bank_details.upi_id },
            ]
        }] : []),
        ...(customer.transport_details ? [{
            title: "Transport Details",
            icon: <Truck className="text-indigo-500" size={20} />,
            data: [
                { label: "Transport Name", value: customer.transport_details.transport_name },
                { label: "Transport Number", value: customer.transport_details.transport_number },
            ]
        }] : []),
        ...(customer.identity_proof_details ? [{
            title: "Identity Proof Details",
            icon: <Shield className="text-emerald-500" size={20} />,
            data: [
                { label: "AADHAAR Number", value: customer.identity_proof_details.aadhaar_number },
                { label: "PAN Number", value: customer.identity_proof_details.pan_number },
                { label: "Driving License", value: customer.identity_proof_details.driving_license_number },
            ]
        }] : []),
        {
            title: "Address Details",
            icon: <MapPin className="text-green-500" size={20} />,
            data: [
                { label: "Address Line", value: customer.address_line },
                { label: "City/Village", value: customer.village },
                { label: "Tehsil", value: customer.tehsil },
                { label: "District", value: customer.district },
                { label: "State", value: customer.state },
                { label: "Pincode", value: customer.pincode },
            ]
        },

    ];

    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 bg-gray-50 min-h-screen">
            <Toaster position="top-right" theme="light" />

            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 transition-colors group font-medium"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to List
                </button>

                <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-orange-50 to-orange-100 border-2 border-orange-100 flex items-center justify-center text-4xl font-bold text-orange-600 shadow-lg shadow-orange-500/10">
                        {customer.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsProfileOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                                >
                                    <Eye size={18} />
                                    <span>Profile</span>
                                </button>

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-colors font-medium"
                                >
                                    <Pencil size={18} />
                                    <span>Edit</span>
                                </button>

                                <span className={`text-sm font-semibold px-4 py-2 rounded-xl border ${customer.status === 'Active'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                    : 'bg-red-50 text-red-600 border-red-200'
                                    }`}>
                                    {customer.status}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-gray-600">
                            {customer.email && (
                                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-medium">
                                    <Mail size={16} className="text-blue-500" />
                                    {customer.email}
                                </span>
                            )}
                            {customer.phone && (
                                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-medium">
                                    <Phone size={16} className="text-green-500" />
                                    {customer.phone}
                                </span>
                            )}
                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-medium">
                                <Building2 size={16} className="text-orange-500" />
                                {customer.branch_type}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty Dashboard Grid (Placeholder for Future Widgets) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add widgets here later */}
            </div>

            {/* Profile Modal */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-6xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-2xl font-bold text-gray-800">Full Business Profile</h2>
                            <button onClick={() => setIsProfileOpen(false)} className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[80vh] bg-gray-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profileSections.map((section, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">{section.icon}</div>
                                            <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {section.data.map((item: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0 min-h-[32px]">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{item.label}</span>
                                                    {item.isLink && item.value ? (
                                                        <a
                                                            href={item.value}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm font-medium text-blue-600 hover:underline text-right max-w-[60%] break-all"
                                                        >
                                                            {item.value}
                                                        </a>
                                                    ) : (
                                                        <span className={`text-sm font-medium text-right max-w-[60%] break-all ${item.isStatus
                                                            ? (item.value === 'Active' ? 'text-emerald-600' : 'text-red-600')
                                                            : 'text-gray-800'
                                                            }`}>
                                                            {item.value || '-'}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Contact Persons Section (Custom Layout) */}
                                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-2">
                                    <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                                        <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
                                            <User className="text-purple-500" size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">Contact Persons</h3>
                                        <span className="bg-gray-100 text-xs font-bold px-2.5 py-1 rounded-full text-gray-600">
                                            {customer.contact_persons?.length || 0}
                                        </span>
                                    </div>

                                    {(!customer.contact_persons || customer.contact_persons.length === 0) ? (
                                        <div className="text-gray-400 italic p-6 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">No contact persons added.</div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                            {customer.contact_persons.map((person: any, index: number) => (
                                                <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-orange-200 hover:bg-orange-50/30 transition-colors group">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200 shadow-sm">
                                                            {person.person_name?.charAt(0).toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="text-gray-900 font-bold">{person.person_name}</div>
                                                            <div className="text-xs text-gray-500 font-medium">Contact #{index + 1}</div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        {person.number && (
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <Phone size={14} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                                                <span className="text-gray-700 font-medium">{person.number}</span>
                                                            </div>
                                                        )}
                                                        {person.mail_id && (
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                <Mail size={14} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                                                                <span className="text-gray-700 font-medium break-all">{person.mail_id}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Custom Business Address Block right to Contact Persons */}
                                {customer.business_address && (
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-1">
                                        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
                                                <MapPin className="text-orange-500" size={20} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">Business Address Details</h3>
                                        </div>
                                        <div className="space-y-4">
                                            {[
                                                { label: "Address Line", value: customer.business_address.address_line },
                                                { label: "City/Village", value: customer.business_address.village },
                                                { label: "Tehsil", value: customer.business_address.tehsil },
                                                { label: "District", value: customer.business_address.district },
                                                { label: "State", value: customer.business_address.state },
                                                { label: "Pincode", value: customer.business_address.pincode },
                                            ].map((item: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0 min-h-[32px]">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{item.label}</span>
                                                    <span className="text-sm font-medium text-right max-w-[60%] break-all text-gray-800">
                                                        {item.value || '-'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Custom Sections for Images & Licenses */}

                                {/* Business Photos */}
                                {customer.business_photos && customer.business_photos.length > 0 && (
                                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-3">
                                        <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                                            <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
                                                <ImageIcon className="text-orange-500" size={20} />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-800">Business Photos</h3>
                                            <span className="bg-gray-100 text-xs font-bold px-2.5 py-1 rounded-full text-gray-600">
                                                {customer.business_photos.length}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-4">
                                            {customer.business_photos.map((photo: any, index: number) => (
                                                <div key={index} className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group cursor-pointer" onClick={() => window.open(photo.url, '_blank')}>
                                                    <img src={photo.url} alt={`Business Photo ${index + 1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Licenses and Cheque wrapper for layout */}
                                {((customer.license_details && customer.license_details.length > 0) || (customer.cancelled_cheque && (customer.cancelled_cheque.number || customer.cancelled_cheque.image?.url))) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:col-span-3">

                                        {/* Licenses */}
                                        {customer.license_details && customer.license_details.length > 0 && (
                                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
                                                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
                                                        <Shield className="text-green-500" size={20} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-800">Licenses</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {customer.license_details.map((license: any, index: number) => (
                                                        <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-4">
                                                            <div className="flex-1 space-y-2">
                                                                <div className="text-sm font-bold text-gray-800">{license.license_name || 'Unnamed License'}</div>
                                                                <div className="text-xs text-gray-500 font-mono tracking-wider">{license.license_number || 'No Number'}</div>
                                                            </div>
                                                            {license.license_image?.url && (
                                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 shrink-0 cursor-pointer group" onClick={() => window.open(license.license_image.url, '_blank')}>
                                                                    <img src={license.license_image.url} alt={license.license_name} className="w-full h-full object-cover group-hover:opacity-80 transition-opacity" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cancelled Cheque */}
                                        {customer.cancelled_cheque && (customer.cancelled_cheque.cheque_number || customer.cancelled_cheque.number || customer.cancelled_cheque.image?.url) && (
                                            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-1">
                                                <div className="flex items-center gap-3 mb-5 border-b border-gray-100 pb-4">
                                                    <div className="p-2.5 bg-gray-50 rounded-xl text-gray-700">
                                                        <FileText className="text-blue-500" size={20} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-800">Cancelled Cheque</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {(customer.cancelled_cheque.cheque_number || customer.cancelled_cheque.number) && (
                                                        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase">Cheque No.</span>
                                                            <span className="text-sm font-bold text-gray-800 font-mono tracking-wider">{customer.cancelled_cheque.cheque_number || customer.cancelled_cheque.number}</span>
                                                        </div>
                                                    )}
                                                    {customer.cancelled_cheque.image?.url && (
                                                        <div className="w-full h-40 rounded-xl overflow-hidden border border-gray-200 shadow-sm relative group cursor-pointer" onClick={() => window.open(customer.cancelled_cheque.image.url, '_blank')}>
                                                            <img src={customer.cancelled_cheque.image.url} alt="Cancelled Cheque Image" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            <CustomerB2BFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                itemToEdit={customer}
                onSave={handleSave}
                service={{ create: async () => { }, update: updateCustomer }}
            />
        </div>
    );
}
