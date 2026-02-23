"use client";

import { useEffect, useState } from "react";
import { Plus, Check, MoreVertical, Edit, Trash2, QrCode, Building2, CreditCard, Landmark, Pencil, X, Wallet, MonitorCheck, History } from "lucide-react";
import { getBankAccounts, createBankAccount, updateBankAccount, deleteBankAccount } from "@/services/bankAccountService";
import { toast, Toaster } from 'sonner';

// Note: If Dialog is custom, I'll adapt. I'll use a simple modal implementation if library not found.
// Actually, earlier pages used `BusinessPartnerFormModal` which is custom.
// I'll create a simple modal inline or use a library if standard.
// For now, I'll write a full page with inline modal logic to be safe.
import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';

export default function BankAccountsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [banks, setBanks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedBank, setSelectedBank] = useState<any>(null);
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });
    const [qrPreview, setQrPreview] = useState<string | null>(null);

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };
    // Form State
    const [formData, setFormData] = useState({
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        branchName: "",
        upiId: "",
        openingBalance: "0",
        qrCodeImage: null as File | null
    });

    const fetchBanks = async () => {
        try {
            setLoading(true);
            const data = await getBankAccounts();
            setBanks(data || []);
        } catch (error) {
            console.error("Error fetching banks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanks();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, qrCodeImage: file }));
            setQrPreview(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            bankName: "",
            accountNumber: "",
            ifscCode: "",
            accountHolderName: "",
            branchName: "",
            upiId: "",
            openingBalance: "0",
            qrCodeImage: null
        });
        setQrPreview(null);
        setEditMode(false);
        setSelectedBank(null);
    };



    // ... imports ...

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("bankName", formData.bankName);
            data.append("accountNumber", formData.accountNumber);
            data.append("ifscCode", formData.ifscCode);
            data.append("accountHolderName", formData.accountHolderName);
            data.append("branchName", formData.branchName);
            data.append("upiId", formData.upiId);
            data.append("openingBalance", formData.openingBalance);
            if (formData.qrCodeImage) {
                data.append("qrCodeImage", formData.qrCodeImage);
            }

            if (editMode && selectedBank) {
                await updateBankAccount(selectedBank._id, data);
            } else {
                await createBankAccount(data);
            }

            setShowModal(false);
            resetForm();
            fetchBanks();
            toast.success(editMode ? "Bank account updated successfully" : "Bank account added successfully");
        } catch (error: any) {
            console.error("Error saving bank:", error);
            const message = error.response?.data?.message || "Failed to save bank account.";
            toast.error(message);
        }
    };

    const handleEdit = (bank: any) => {
        setSelectedBank(bank);
        setFormData({
            bankName: bank.bankName,
            accountNumber: bank.accountNumber,
            ifscCode: bank.ifscCode,
            accountHolderName: bank.accountHolderName,
            branchName: bank.branchName || "",
            upiId: bank.upiId || "",
            openingBalance: bank.openingBalance?.toString() || "0",
            qrCodeImage: null
        });
        setQrPreview(bank.qrCodeImage?.url || null);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this bank account?")) {
            try {
                await deleteBankAccount(id);
                fetchBanks();
            } catch (error) {
                console.error("Error deleting bank:", error);
            }
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen">
            <Toaster position="top-right" theme="light" />
            <PageHeader
                title="Bank Accounts"
                description="Manage your bank accounts and UPI details"
                totalCount={banks.length}
                addButtonLabel="Add Bank Account"
                onAdd={() => { resetForm(); setShowModal(true); }}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Balance"
                    value={`₹${banks.reduce((acc, curr) => acc + (Number(curr.openingBalance) || 0), 0).toLocaleString('en-IN')}`}
                    icon={<Landmark size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Accounts"
                    value={banks.length.toString()}
                    icon={<CreditCard size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="UPI Enabled"
                    value={banks.filter(b => b.upiId).length.toString()}
                    icon={<MonitorCheck size={24} />}
                    color="#f59e0b"
                />
                <StatsCard
                    title="Last Entry"
                    value="Today"
                    icon={<History size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Bank Records</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[500px]">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search bank accounts..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="p-6">
                    {/* Bank List Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {banks.map((bank) => (
                            <div key={bank._id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow relative group">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(bank)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(bank._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800">{bank.bankName}</h3>
                                        <p className="text-sm text-gray-500">{bank.branchName}</p>
                                    </div>
                                    {bank.qrCodeImage?.url ? (
                                        <img src={bank.qrCodeImage.url} alt="QR" className="w-12 h-12 object-cover rounded-lg border" />
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                            <QrCode size={24} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Account No:</span>
                                        <span className="font-medium text-gray-800">{bank.accountNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">IFSC:</span>
                                        <span className="font-medium text-gray-800">{bank.ifscCode}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Holder:</span>
                                        <span className="font-medium text-gray-800">{bank.accountHolderName}</span>
                                    </div>
                                    {bank.upiId && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">UPI ID:</span>
                                            <span className="font-medium text-orange-600">{bank.upiId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {banks.length === 0 && !loading && (
                            <div className="col-span-full py-12 text-center text-gray-500">
                                No bank accounts found. Add one to get started.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editMode ? 'Edit Bank Account' : 'Add New Bank Account'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                                    <input
                                        name="bankName"
                                        value={formData.bankName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                        placeholder="e.g. HDFC Bank"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch Name</label>
                                    <input
                                        name="branchName"
                                        value={formData.branchName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                        placeholder="e.g. Indrapuri Branch"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                                    <input
                                        name="accountNumber"
                                        value={formData.accountNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                        placeholder="Enter account number"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                                    <input
                                        name="ifscCode"
                                        value={formData.ifscCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all uppercase"
                                        placeholder="Enter IFSC code"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                                    <input
                                        name="accountHolderName"
                                        value={formData.accountHolderName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                        placeholder="Name as per bank records"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                                    <input
                                        name="upiId"
                                        value={formData.upiId}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                        placeholder="e.g. username@okhdfcbank"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Opening Balance</label>
                                    <input
                                        type="number"
                                        name="openingBalance"
                                        value={formData.openingBalance}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 outline-none transition-all"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Image</label>
                                    <div className="flex items-center gap-4">
                                        {qrPreview && (
                                            <div className="w-24 h-24 border rounded-lg overflow-hidden relative group">
                                                <img src={qrPreview} alt="QR Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2.5 file:px-4
                                                file:rounded-xl file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-orange-50 file:text-orange-700
                                                hover:file:bg-orange-100
                                                cursor-pointer"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Upload QR Code image (JPG, PNG)</p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editMode ? 'Update Account' : 'Save Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
