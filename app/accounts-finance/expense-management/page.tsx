"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { Plus, Trash2, Calendar, FileText, CreditCard, Banknote, X, Settings, List, Receipt, IndianRupee, Wallet, PieChart } from "lucide-react";
import { toast } from 'sonner';
import { getExpenses, addExpense, deleteExpense, getCategories, addCategory, deleteCategoryById } from "@/services/expenseService";
import { getBankAccounts } from "@/services/bankAccountService";
import StatsCard from '@/components/StatsCard';
import DateFilter, { DateFilterOption, DateRange } from '@/components/common/DateFilter';

export default function ExpenseManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showCategoryListModal, setShowCategoryListModal] = useState(false);
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    const [newCategory, setNewCategory] = useState("");

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        category: "Bank Charges",
        amount: "",
        paymentMode: "Cash",
        bankAccount: "",
        description: "",
        referenceNumber: ""
    });

    useEffect(() => {
        fetchExpenses();
        fetchBankAccounts();
        fetchCategories();
    }, []);

    const fetchExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch expenses", error);
            // toast.error("Failed to load expenses");
        } finally {
            setLoading(false);
        }
    };

    const fetchBankAccounts = async () => {
        try {
            const data = await getBankAccounts();
            setBankAccounts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch bank accounts", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            if (response.success) {
                setCategories(response.data);
                // Seed default categories if empty (Logic can be added here or backend)
                if (response.data.length === 0) {
                    // Optionally seed defaults via frontend or just let user add them
                }
            }
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.amount || Number(formData.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (formData.paymentMode === 'Online' && !formData.bankAccount) {
            toast.error("Please select a Bank Account for Online payment");
            return;
        }

        try {
            await addExpense(formData);
            toast.success("Expense added successfully");
            setShowModal(false);
            fetchExpenses();
            setFormData({
                date: new Date().toISOString().split('T')[0],
                category: "Bank Charges",
                amount: "",
                paymentMode: "Cash",
                bankAccount: "",
                description: "",
                referenceNumber: ""
            });
        } catch (error) {
            console.error("Error adding expense", error);
            toast.error("Failed to add expense");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this expense?")) {
            try {
                await deleteExpense(id);
                toast.success("Expense deleted successfully");
                fetchExpenses();
            } catch (error) {
                console.error("Error deleting expense", error);
                toast.error("Failed to delete expense");
            }
        }
    };

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            await addCategory({ name: newCategory });
            toast.success("Category added successfully");
            setNewCategory("");
            setShowCategoryModal(false);
            fetchCategories();
        } catch (error) {
            console.error("Error adding category", error);
            toast.error("Failed to add category");
        }
    };

    const handleDeleteCategory = async (id: string, name: string) => {
        if (confirm(`Delete category "${name}" ? `)) {
            try {
                await deleteCategoryById(id);
                toast.success("Category deleted");
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category", error);
                toast.error("Failed to delete category");
            }
        }
    };

    const filteredExpenses = expenses.filter(expense =>
        expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.amount.toString().includes(searchTerm)
    );

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen">
            <PageHeader
                title="Expense Management"
                description="Track company expenses and bank charges"
                totalCount={expenses.length}
                addButtonLabel="Add Expense"
                onAdd={() => setShowModal(true)}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Expenses"
                    value={`₹${expenses.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString('en-IN')} `}
                    icon={<IndianRupee size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Online Payments"
                    value={expenses.filter(e => e.paymentMode === 'Online').length.toString()}
                    icon={<CreditCard size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Cash Payments"
                    value={expenses.filter(e => e.paymentMode === 'Cash').length.toString()}
                    icon={<Banknote size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Categories"
                    value={categories.length.toString()}
                    icon={<PieChart size={24} />}
                    color="#f59e0b"
                />
            </div>

            {/* Content Area Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-gray-50">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowCategoryListModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-gray-100"
                        >
                            <List size={14} />
                            Categories
                        </button>
                        <button
                            onClick={() => setShowCategoryModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-all text-xs font-bold uppercase tracking-wider border border-gray-100"
                        >
                            <Plus size={14} />
                            Add Type
                        </button>
                    </div>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[500px]">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search by category, desc or amount..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-2">Date</div>
                    <div className="col-span-3">Category & Description</div>
                    <div className="col-span-2">Mode</div>
                    <div className="col-span-2">Bank / Ref</div>
                    <div className="col-span-2 text-right">Amount</div>
                    <div className="col-span-1 text-center">Action</div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading expenses...</div>
                ) : filteredExpenses.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FileText className="text-gray-400" size={32} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No Expenses Found</h3>
                        <p className="text-gray-500 mt-1">Start by adding a new expense record.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredExpenses.map((expense) => (
                            <div key={expense._id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                                <div className="col-span-2 text-gray-600 text-sm">
                                    {new Date(expense.date).toLocaleDateString('en-GB')}
                                </div>
                                <div className="col-span-3">
                                    <div className="font-medium text-gray-900">{expense.category}</div>
                                    <div className="text-xs text-gray-500 truncate">{expense.description || '-'}</div>
                                </div>
                                <div className="col-span-2">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${expense.paymentMode === 'Online'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                        }`}>
                                        {expense.paymentMode}
                                    </span>
                                </div>
                                <div className="col-span-2 text-sm text-gray-600">
                                    {expense.paymentMode === 'Online' ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-800">{expense.bankAccount?.bankName}</span>
                                            <span className="text-xs">{expense.bankAccount?.accountNumber?.slice(-4) ? `** ${expense.bankAccount?.accountNumber.slice(-4)} ` : ''}</span>
                                        </div>
                                    ) : (
                                        expense.referenceNumber || '-'
                                    )}
                                </div>
                                <div className="col-span-2 text-right font-bold text-gray-900">
                                    ₹{expense.amount.toLocaleString('en-IN')}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    <button
                                        onClick={() => handleDelete(expense._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900">Add New Expense</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                        placeholder="0.00"
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none appearance-none"
                                >
                                    {categories.length > 0 ? (
                                        categories.map(cat => (
                                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                                        ))
                                    ) : (
                                        <option value="Bank Charges">Bank Charges</option>
                                    )}
                                </select>
                                {categories.length === 0 && <p className="text-xs text-orange-500">No categories found. Please add a category first.</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Payment Mode</label>
                                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                                    {['Cash', 'Online'].map(mode => (
                                        <button
                                            key={mode}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, paymentMode: mode }))}
                                            className={`py - 2 text - sm font - semibold rounded - lg transition - all ${formData.paymentMode === mode
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                                } `}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {formData.paymentMode === 'Online' && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                    <label className="text-sm font-medium text-gray-700">Select Bank Account</label>
                                    <select
                                        name="bankAccount"
                                        value={formData.bankAccount}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none appearance-none"
                                        required
                                    >
                                        <option value="">Select Account</option>
                                        {bankAccounts.map(account => (
                                            <option key={account._id} value={account._id}>
                                                {account.bankName} - {account.accountNumber}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Description / Remarks</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none"
                                    placeholder="Enter expense details..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/25 transition-all mt-4"
                            >
                                Save Expense
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Add Category</h3>
                            <button onClick={() => setShowCategoryModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddCategory} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category Name</label>
                                <input
                                    type="text"
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                                    placeholder="e.g. Travel, Food"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/25 transition-all"
                            >
                                Add Category
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Categories Modal */}
            {showCategoryListModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Manage Categories</h3>
                            <button onClick={() => setShowCategoryListModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            {categories.length === 0 ? (
                                <p className="text-center text-gray-500">No categories found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {categories.map(cat => (
                                        <div key={cat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-medium text-gray-700">{cat.name}</span>
                                            <button
                                                onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={() => { setShowCategoryListModal(false); setShowCategoryModal(true); }}
                                className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                + Add New Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
