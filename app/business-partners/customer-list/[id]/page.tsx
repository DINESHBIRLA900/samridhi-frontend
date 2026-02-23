"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin, Building2, User, Eye, Pencil, X, Calendar, UserCircle } from "lucide-react";
import { toast, Toaster } from 'sonner';
import axios from "axios";
import CustomerB2CFormModal from "@/components/business-partners/CustomerB2CFormModal";
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

export default function B2CCustomerDashboard() {
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

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const profileSections = [
        {
            title: "Personal Info",
            icon: <User className="text-orange-500" size={20} />,
            data: [
                { label: "Full Name", value: customer.name },
                { label: "Father's Name", value: customer.father_name },
                { label: "Gender", value: customer.gender },
                { label: "Date of Birth", value: formatDate(customer.dob) },
                { label: "Status", value: customer.status, isStatus: true },
            ]
        },
        {
            title: "Contact Details",
            icon: <Phone className="text-blue-500" size={20} />,
            data: [
                { label: "Mobile Number", value: customer.phone },
                { label: "WhatsApp Number", value: customer.whatsapp_number },
                { label: "Alternate Mobile", value: customer.alternate_mobile_number },
                { label: "Email ID", value: customer.email },
            ]
        },
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
                            {customer.phone && (
                                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-medium">
                                    <Phone size={16} className="text-emerald-500" />
                                    {customer.phone}
                                </span>
                            )}
                            {customer.email && (
                                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-medium">
                                    <Mail size={16} className="text-blue-500" />
                                    {customer.email}
                                </span>
                            )}
                            {customer.father_name && (
                                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-medium">
                                    <UserCircle size={16} className="text-purple-500" />
                                    S/O {customer.father_name}
                                </span>
                            )}
                            {customer.dob && (
                                <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 text-sm font-medium">
                                    <Calendar size={16} className="text-orange-500" />
                                    {formatDate(customer.dob)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Empty Dashboard Grid (Placeholder for Future Widgets) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Add widgets here later, e.g., Purchase History, Recent Activity */}
            </div>

            {/* Profile Modal */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-6xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-2xl font-bold text-gray-800">Full Personal Profile</h2>
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
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            <CustomerB2CFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                itemToEdit={customer}
                onSave={handleSave}
                service={{ create: async () => { }, update: updateCustomer }}
            />
        </div>
    );
}
