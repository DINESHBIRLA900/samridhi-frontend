"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, ChevronRight, ChevronDown, Folder, FileText, Landmark, PieChart, TrendingUp, Wallet } from "lucide-react";
import { getAccountHeads, createAccountHead, updateAccountHead, deleteAccountHead } from "@/services/accountHeadService";
import { toast, Toaster } from 'sonner';
import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';

interface AccountHead {
    _id: string;
    name: string;
    code?: string;
    type: string;
    parentHead?: { _id: string; name: string };
    description?: string;
    isActive: boolean;
}

export default function ChartOfAccountsPage() {
    const [accounts, setAccounts] = useState<AccountHead[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<AccountHead | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        code: "",
        type: "Asset",
        parentHead: "",
        description: ""
    });

    const accountTypes = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const data = await getAccountHeads();
            setAccounts(data || []);
        } catch (error) {
            console.error("Error fetching accounts:", error);
            toast.error("Failed to load chart of accounts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            code: "",
            type: "Asset",
            parentHead: "",
            description: ""
        });
        setEditMode(false);
        setSelectedAccount(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                parentHead: formData.parentHead || null // Send null if empty
            };

            if (editMode && selectedAccount) {
                await updateAccountHead(selectedAccount._id, payload);
                toast.success("Account head updated successfully");
            } else {
                await createAccountHead(payload);
                toast.success("Account head created successfully");
            }

            setShowModal(false);
            resetForm();
            fetchAccounts();
        } catch (error: any) {
            console.error("Error saving account:", error);
            const message = error.response?.data?.message || "Failed to save account head";
            toast.error(message);
        }
    };

    const handleEdit = (account: AccountHead) => {
        setSelectedAccount(account);
        setFormData({
            name: account.name,
            code: account.code || "",
            type: account.type,
            parentHead: account.parentHead?._id || "",
            description: account.description || ""
        });
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this account head?")) {
            try {
                await deleteAccountHead(id);
                toast.success("Account head deleted successfully");
                fetchAccounts();
            } catch (error: any) {
                console.error("Error deleting account:", error);
                const message = error.response?.data?.message || "Failed to delete account";
                toast.error(message);
            }
        }
    };

    // Filter accounts based on search
    const filteredAccounts = accounts.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.code && a.code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Group accounts by type for display
    const groupedAccounts = accountTypes.reduce((acc, type) => {
        acc[type] = filteredAccounts.filter(a => a.type === type);
        return acc;
    }, {} as Record<string, AccountHead[]>);

    return (
        <div className="w-full max-w-[1600px] mx-auto p-0 min-h-screen">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title="Chart of Accounts"
                description="Manage your financial account structure (Assets, Liabilities, Income, Expenses)"
                totalCount={accounts.length}
                addButtonLabel="Add Account Head"
                onAdd={() => { resetForm(); setShowModal(true); }}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Accounts"
                    value={accounts.length.toString()}
                    icon={<Landmark size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Asset Accounts"
                    value={accounts.filter(a => a.type === 'Asset').length.toString()}
                    icon={<TrendingUp size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Expense Items"
                    value={accounts.filter(a => a.type === 'Expense').length.toString()}
                    icon={<Wallet size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Account Groups"
                    value={accountTypes.length.toString()}
                    icon={<PieChart size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Account Hierarchy</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Search accounts or codes..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                {accountTypes.map(type => (
                    <div key={type} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <Folder size={18} className="text-orange-500" />
                                {type}
                            </h3>
                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                {groupedAccounts[type]?.length || 0}
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {groupedAccounts[type]?.length === 0 ? (
                                <div className="p-6 text-center text-gray-400 text-sm">No accounts found</div>
                            ) : (
                                groupedAccounts[type]?.map(account => (
                                    <div key={account._id} className="p-4 hover:bg-gray-50 flex items-center justify-between group transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-gray-800">{account.name}</h4>
                                                {account.code && <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border">{account.code}</span>}
                                            </div>
                                            {account.parentHead && (
                                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                    <span className="text-gray-400">↳</span> Parent: {account.parentHead.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEdit(account)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(account._id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editMode ? 'Edit Account Head' : 'Add Account Head'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                    placeholder="e.g. Office Rent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Code</label>
                                    <input
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                        placeholder="e.g. 1001"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Type *</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all bg-white"
                                        required
                                    >
                                        {accountTypes.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Account (Optional)</label>
                                <select
                                    name="parentHead"
                                    value={formData.parentHead}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all bg-white"
                                >
                                    <option value="">None (Top Level)</option>
                                    {accounts
                                        .filter(a => a._id !== selectedAccount?._id) // Prevent selecting self as parent
                                        .filter(a => a.type === formData.type) // Only show same type
                                        .map(a => (
                                            <option key={a._id} value={a._id}>{a.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                    placeholder="Optional description"
                                    rows={3}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-medium shadow-lg"
                                >
                                    {editMode ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
