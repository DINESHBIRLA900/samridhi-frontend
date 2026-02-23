"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserById, updateUser, getUsers } from "@/services/userService";
import { getCompanyStructure } from "@/services/companyStructureService";
import { ArrowLeft, Mail, Phone, MapPin, Building2, CreditCard, User, Shield, Eye, Pencil, Check, X, Lock, IndianRupee, ShoppingCart, CalendarCheck, Briefcase } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import { toast } from 'sonner';
import StatsCard from "@/components/StatsCard";
import AddEmployee from "@/components/employees/AddEmployee";
import axios from "axios";

export default function EmployeeDashboardPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Options for Dropdowns
    const [departments, setDepartments] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [teams, setTeams] = useState<any[]>([]);
    const [managers, setManagers] = useState<any[]>([]);

    // Stats State
    const [workApprovalCount, setWorkApprovalCount] = useState(0);

    // Editing State
    const [editingSection, setEditingSection] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<any>({});

    const toTitleCase = (str: string) => {
        if (!str) return '';
        return str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [deptData, roleData, teamData, usersData] = await Promise.all([
                    getCompanyStructure('department'),
                    getCompanyStructure('roletype'),
                    getCompanyStructure('teams'),
                    getUsers(),
                ]);
                setDepartments(deptData);
                setRoles(roleData);
                setTeams(teamData);
                setManagers(usersData);
            } catch (error) {
                console.error("Failed to fetch dropdown options", error);
            }
        };
        fetchOptions();
    }, []);


    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const data = await getUserById(id);

            setUser(data);
        } catch (error) {
            console.error("Failed to fetch user details", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWorkApprovals = async () => {
        try {
            const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/attendance/work-approval/user/${id}`;
            const response = await axios.get(API_URL);
            setWorkApprovalCount(response.data.length);
        } catch (error) {
            console.error("Failed to fetch work approvals", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchWorkApprovals();
        }
    }, [id]);

    const handleStatusToggle = async () => {
        if (!user) return;

        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        setUpdatingStatus(true);

        try {
            await updateUser(user._id, { status: newStatus });
            setUser({ ...user, status: newStatus });
            toast.success(`User ${newStatus === 'Active' ? 'activated' : 'blocked'} successfully`);
        } catch (error: any) {
            console.error("Failed to update status", error);
            const msg = error.response?.data?.message || "Failed to update status";
            toast.error(msg);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        fetchUser();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-white">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-20 text-gray-400">
                <h2 className="text-2xl font-bold mb-2">Employee Not Found</h2>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // Helper to format date
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    const handleEditClick = (section: any) => {
        const formData: any = {};
        section.data.forEach((item: any) => {
            if (item.key) {
                let value = user[item.key];

                // Handle objects (like department, role, etc.)
                if (value && typeof value === 'object' && value._id) {
                    value = value._id;
                }

                formData[item.key] = value || "";

                if (section.id === 'bank') {
                    formData[item.key] = user.bank_details?.[item.key] || "";
                }
                // Handle reporting_manager specific case if key differs, but item.key is 'reporting_manager' in profileSections, 
                // and user.reporting_manager is populated. Logic above covers it.
            }
        });
        setEditFormData(formData);
        setEditingSection(section.id);
    };

    const handleCancelEdit = () => {
        setEditingSection(null);
        setEditFormData({});
    };

    const handleSaveProfile = async () => {
        if (!editingSection || !user) return;

        try {
            const updatePayload: any = { ...editFormData };

            // Sanitize payload: valid ObjectIds or null, never empty strings for these fields
            const objectIdFields = ['department', 'role', 'job_type', 'employee_category', 'team', 'reporting_manager'];

            objectIdFields.forEach(field => {
                if (updatePayload[field] === "") {
                    updatePayload[field] = null; // Unset optional fields or fail validation gracefully
                }
            });

            console.log("Sending Update Payload:", updatePayload);
            await updateUser(user._id, updatePayload);
            await fetchUser();
            toast.success("Profile updated successfully");
            setEditingSection(null);
        } catch (error: any) {
            console.error("Failed to update profile", error);
            const msg = error.response?.data?.message || "Failed to update profile";
            toast.error(msg);
        }
    };

    const handleInputChange = (key: string, value: string) => {
        setEditFormData((prev: any) => ({ ...prev, [key]: value }));
    };



    // ... (fetchUser logic and other effects) ...

    const profileSections = user ? [
        {
            id: 'basic',
            title: "Basic Info",
            icon: <User className="text-blue-400" size={20} />,
            data: [
                { key: "name", label: "Name", value: user.name },
                { key: "father_name", label: "Father's Name", value: user.father_name },

                // Mother's Name removed
                { key: "dob", label: "DOB", value: formatDate(user.dob), type: "date" }, // Note: Date input needs YYYY-MM-DD
                { key: "gender", label: "Gender", value: user.gender },
                // Marital Status removed
                // Blood Group removed
            ]
        },
        {
            id: 'contact',
            title: "Contact Details",
            icon: <Phone className="text-emerald-400" size={20} />,
            data: [
                { key: "phone", label: "Phone", value: user.phone },
                { key: "email", label: "Email", value: user.email },
                { key: "whatsapp_number", label: "WhatsApp", value: user.whatsapp_number },
                { key: "alternate_mobile_number", label: "Alt. Mobile", value: user.alternate_mobile_number },
            ]
        },
        {
            id: 'security_access',
            title: "Security & Access",
            icon: <Lock className="text-red-500" size={20} />,
            data: [
                { key: "username", label: "Username / Mobile", value: user.phone, readOnly: true },
                { key: "password", label: "Password", value: user.visible_password, readOnly: true },
                { key: "mpin", label: "Security Code (mPIN)", value: user.visible_mpin ? "Set" : "Not Set", readOnly: true },
                { key: "role", label: "Access Level", value: user.role?.role_name, readOnly: true },
            ],
            isNonEditable: true
        },
        {
            id: 'address',
            title: "Address Details",
            icon: <MapPin className="text-blue-400" size={20} />,
            data: [
                { key: "address_line", label: "Address Line", value: user.address_line },
                { key: "state", label: "State", value: user.state },
                { key: "district", label: "District", value: user.district },
                { key: "tehsil", label: "Tehsil", value: user.tehsil },
                { key: "village", label: "City/Village", value: user.village },
                { key: "pincode", label: "Pincode", value: user.pincode },
            ]
        },
        {
            id: 'office',
            title: "Office Details",
            icon: <Building2 className="text-purple-400" size={20} />,
            data: [
                { key: "department", label: "Department", value: user.department?.department_name, type: 'select', options: departments, optionKey: 'department_name' },
                { key: "role", label: "Role", value: user.role?.role_name, type: 'select', options: roles, optionKey: 'role_name' },
                { key: "team", label: "Team", value: user.team?.team_name, type: 'select', options: teams, optionKey: 'team_name' },
                { key: "reporting_manager", label: "Reporting Manager", value: user.reporting_manager?.name, type: 'select', options: managers, optionKey: 'name' },
                { key: "created_at", label: "Date of Joining", value: formatDate(user.created_at), readOnly: true },
            ]
        },
        {
            id: 'bank',
            title: "Bank Details",
            icon: <CreditCard className="text-yellow-400" size={20} />,
            data: [
                { key: "bank_name", label: "Bank Name", value: user.bank_details?.bank_name },
                { key: "account_holder_name", label: "Account Holder", value: user.bank_details?.account_holder_name },
                { key: "account_number", label: "Account Number", value: user.bank_details?.account_number },
                { key: "upi_id", label: "UPI ID", value: user.bank_details?.upi_id },
            ]
        },
        {
            id: 'emergency',
            title: "Emergency Contact",
            icon: <Shield className="text-red-400" size={20} />,
            data: [
                { key: "emergency_person_name", label: "Person Name", value: user.emergency_person_name },
                { key: "emergency_relation", label: "Relation", value: user.emergency_relation },
                { key: "emergency_contact_number", label: "Contact Number", value: user.emergency_contact_number },
            ]
        },
        {
            id: 'documents',
            title: "Documents",
            icon: <Shield className="text-orange-400" size={20} />,
            data: [
                { key: "aadhaar_number", label: "Aadhaar Number", value: user.aadhaar_number },
                { key: "pan_number", label: "PAN Number", value: user.pan_number },
                { key: "driving_license_number", label: "Driving License", value: user.driving_license_number },
            ]
        },

    ] : [];



    return (
        <div className="w-full max-w-[1600px] mx-auto p-6 md:p-8 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 transition-colors group font-medium"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to List
                </button>

                <div className="flex flex-col md:flex-row md:items-center gap-6 rounded-2xl bg-white border-2 border-orange-500 p-6 shadow-lg">
                    <div className="w-24 h-24 shrink-0 rounded-full bg-linear-to-br from-orange-400 to-orange-600 border border-orange-200 flex items-center justify-center text-4xl font-bold text-white shadow-md">
                        {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user?.name || 'Unknown User'}</h1>
                            <div className="flex items-center flex-wrap gap-3">
                                <button
                                    onClick={() => setIsProfileOpen(true)}
                                    className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors font-medium"
                                >
                                    <Eye size={18} />
                                    <span>Profile</span>
                                </button>

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-2 px-4 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-colors font-medium"
                                >
                                    <Pencil size={18} />
                                    <span>Edit</span>
                                </button>

                                <div className={`flex items-center gap-2 px-4 h-10 rounded-xl border ${user.status === 'Active' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                                    <button
                                        onClick={handleStatusToggle}
                                        disabled={updatingStatus}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shadow-sm ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-red-500'
                                            } ${updatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        title={`Click to ${user.status === 'Active' ? 'Block' : 'Activate'} User`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md ${user.status === 'Active' ? 'translate-x-[22px]' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                    <span className={`text-sm font-semibold tracking-wide ${user.status === 'Active' ? 'text-emerald-600' : 'text-red-600'
                                        }`}>
                                        {user.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 text-gray-500">
                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium">
                                <Mail size={16} className="text-blue-500" />
                                {user.email}
                            </span>
                            <span className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium">
                                <Phone size={16} className="text-emerald-500" />
                                {user.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Revenue"
                    value="₹ 0"
                    icon={<IndianRupee size={24} />}
                    color="#10b981"
                    trend="+0%"
                    trendUp={true}
                />
                <StatsCard
                    title="Work Approvals"
                    value={workApprovalCount}
                    icon={<CalendarCheck size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Total Orders"
                    value="0"
                    icon={<ShoppingCart size={24} />}
                    color="#8b5cf6"
                />
                <StatsCard
                    title="Total Visits"
                    value="0"
                    icon={<MapPin size={24} />}
                    color="#ec4899"
                />
            </div>


            {/* Profile Modal */}
            {isProfileOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <div className="relative w-full max-w-6xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden my-8">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-2xl font-bold text-gray-900">Full Employee Profile</h2>
                            <button onClick={() => setIsProfileOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[80vh] bg-gray-50/30">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {profileSections.map((section, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all relative group">
                                        <div className="flex items-center justify-between gap-3 mb-4 border-b border-gray-100 pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-orange-50 rounded-lg text-orange-600">{section.icon}</div>
                                                <h3 className="text-lg font-bold text-gray-800">{section.title}</h3>
                                            </div>
                                            {!section.isNonEditable && (
                                                <div className="flex items-center gap-2">
                                                    {editingSection === section.id ? (
                                                        <>
                                                            <button
                                                                onClick={handleSaveProfile}
                                                                className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                                title="Save"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={handleCancelEdit}
                                                                className="p-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                                title="Cancel"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleEditClick(section)}
                                                            className="p-1.5 rounded-full bg-gray-50 text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-colors opacity-0 group-hover:opacity-100"
                                                            title="Edit"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            {section.data.map((item: any, i: number) => (
                                                <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0 min-h-[32px]">
                                                    <span className="text-xs text-gray-500 uppercase tracking-wide mt-0.5 font-medium">{item.label}</span>
                                                    {editingSection === section.id && item.key && !item.readOnly ? (
                                                        item.type === 'select' ? (
                                                            <select
                                                                value={editFormData[item.key] || ''}
                                                                onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                                className="text-sm bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-right text-gray-900 w-[65%] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm appearance-none"
                                                            >
                                                                <option value="" className="text-gray-400">Select {item.label}</option>
                                                                {item.options?.map((opt: any) => (
                                                                    <option key={opt._id} value={opt._id} className="text-gray-900">
                                                                        {toTitleCase(opt[item.optionKey] || opt.name)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                type={item.type || "text"}
                                                                value={editFormData[item.key] || ''}
                                                                onChange={(e) => handleInputChange(item.key, e.target.value)}
                                                                className="text-sm bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-right text-gray-900 w-[65%] focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all shadow-sm"
                                                            />
                                                        )
                                                    ) : (
                                                        <span className="text-sm text-gray-900 font-semibold text-right max-w-[60%] break-all">{item.value || '-'}</span>
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
            {isEditModalOpen && (
                <AddEmployee
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                    editData={user}
                />
            )}
        </div>
    );
}
