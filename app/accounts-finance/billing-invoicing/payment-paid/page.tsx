"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Calendar, Hash, Banknote, FileText } from "lucide-react";
import { toast } from 'sonner';
import { getVendors } from "@/services/vendorService";
import { getSuppliers } from "@/services/supplierService";
import { getCustomers } from "@/services/customerService";

import { getBankAccounts } from "@/services/bankAccountService";

export default function PaymentPaidPage() {
    const [loading, setLoading] = useState(false);

    // Party Selection State
    const [partyType, setPartyType] = useState<"Vendor" | "Supplier" | "B2B" | "B2C">("Vendor");
    const [parties, setParties] = useState<any[]>([]);
    const [selectedParty, setSelectedParty] = useState<any>(null);
    const [partySearch, setPartySearch] = useState("");
    const [searchingParty, setSearchingParty] = useState(false);

    // Bank Accounts State
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);

    // Payment Form State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        payment_mode: "Cash",
        amount: "",
        bank_account: "",
        reference_number: "",
        remarks: ""
    });

    // Fetch Parties based on Type
    useEffect(() => {
        const fetchParties = async () => {
            setSearchingParty(true);
            try {
                let data = [];
                if (partyType === 'Vendor') {
                    data = await getVendors();
                } else if (partyType === 'Supplier') {
                    data = await getSuppliers();
                } else if (partyType === 'B2B' || partyType === 'B2C') {
                    data = await getCustomers(partyType);
                }
                setParties(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch partners", error);
                setParties([]);
            } finally {
                setSearchingParty(false);
            }
        };

        const fetchBanks = async () => {
            try {
                const data = await getBankAccounts();
                setBankAccounts(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch bank accounts", error);
            }
        };

        fetchParties();
        fetchBanks();
    }, [partyType]);

    const handlePartySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPartySearch(e.target.value);
        if (!e.target.value) {
            setSelectedParty(null);
        }
    };

    const handlePartySelect = (party: any) => {
        setSelectedParty(party);
        let name = "";
        if (partyType === 'B2B' || partyType === 'B2C') name = party.name;
        else if (partyType === 'Vendor') name = party.company_name || party.name;
        else if (partyType === 'Supplier') name = party.supplier_name || party.name;

        setPartySearch(name);
    };

    // Filtered parties for dropdown
    const filteredParties = parties.filter(p => {
        let name = "";
        let identifier = "";

        if (partyType === 'B2B') {
            name = p.name;
            identifier = p.gstin;
        } else if (partyType === 'B2C') {
            name = p.name;
            identifier = p.phone;
        } else if (partyType === 'Vendor') {
            name = p.company_name || p.name;
            identifier = p.phone || p.email;
        } else if (partyType === 'Supplier') {
            name = p.supplier_name || p.name;
            identifier = p.contact_number || p.email;
        }

        return name?.toLowerCase().includes(partySearch.toLowerCase()) ||
            identifier?.toLowerCase().includes(partySearch.toLowerCase());
    });

    const getPartyDisplayName = (p: any) => {
        if (partyType === 'B2B' || partyType === 'B2C') return p.name;
        if (partyType === 'Vendor') return p.company_name || p.name;
        if (partyType === 'Supplier') return p.supplier_name || p.name;
        return "";
    };

    const getPartyIdentifier = (p: any) => {
        if (partyType === 'B2B') return p.gstin;
        if (partyType === 'B2C') return p.phone;
        if (partyType === 'Vendor') return p.phone || p.email;
        if (partyType === 'Supplier') return p.contact_number || p.email;
        return "";
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedParty) {
            toast.error(`Please select a ${partyType}`);
            return;
        }
        if (!formData.amount || Number(formData.amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        setLoading(true);
        try {
            // Placeholder for API call
            console.log("Submitting Payment Paid:", { ...formData, party: selectedParty._id, party_type: partyType });
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API
            toast.success("Payment Details Saved Successfully");
            // Reset or Redirect
            setFormData({
                date: new Date().toISOString().split('T')[0],
                payment_mode: "Cash",
                amount: "",
                bank_account: "",
                reference_number: "",
                remarks: ""
            });
            setSelectedParty(null);
            setPartySearch("");
        } catch (error) {
            console.error("Error saving payment", error);
            toast.error("Failed to save payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/accounts-finance/billing-invoicing" className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 text-gray-600 transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Payment Paid</h1>
                        <p className="text-gray-500 font-medium">Record money paid to any party</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Party Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none" />

                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-red-500 rounded-full" />
                                Payee Details
                            </h2>

                            <div className="space-y-6">
                                {/* Party Type Toggle */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-1 bg-gray-100 rounded-xl">
                                    {['Vendor', 'Supplier', 'B2B', 'B2C'].map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => { setPartyType(type as any); setPartySearch(""); setSelectedParty(null); }}
                                            className={`py-2 text-xs md:text-sm font-semibold rounded-lg transition-all ${partyType === type
                                                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                                : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                                                }`}
                                        >
                                            {type === 'B2B' ? 'Dealer (B2B)' : type === 'B2C' ? 'Farmer (B2C)' : type}
                                        </button>
                                    ))}
                                </div>

                                {/* Party Search */}
                                <div className="space-y-2 relative">
                                    <label className="text-sm font-medium text-gray-700">Select Payee</label>
                                    <input
                                        type="text"
                                        value={partySearch}
                                        onChange={handlePartySearch}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        placeholder={`Search ${partyType} by Name...`}
                                    />

                                    {/* Dropdown for search results */}
                                    {partySearch && !selectedParty && filteredParties.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                            {filteredParties.map(party => (
                                                <div
                                                    key={party._id}
                                                    onClick={() => handlePartySelect(party)}
                                                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                                                >
                                                    <div className="font-medium text-gray-900">{getPartyDisplayName(party)}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {getPartyIdentifier(party)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedParty && (
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-100 flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-red-900">{getPartyDisplayName(selectedParty)}</p>
                                            <p className="text-sm text-red-700">
                                                {getPartyIdentifier(selectedParty)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedParty(null); setPartySearch(""); }}
                                            className="text-xs text-red-600 hover:text-red-800 underline"
                                        >
                                            Change
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-8 relative overflow-hidden">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full" />
                                Payment Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        />
                                        <Calendar className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Payment Mode</label>
                                    <div className="relative">
                                        <select
                                            name="payment_mode"
                                            value={formData.payment_mode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none appearance-none"
                                        >
                                            <option value="Cash">Cash</option>
                                            <option value="Online">Online / UPI</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                        </select>
                                        <Banknote className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {formData.payment_mode !== 'Cash' && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                        <label className="text-sm font-medium text-gray-700">Select Bank Account</label>
                                        <div className="relative">
                                            <select
                                                name="bank_account"
                                                value={formData.bank_account}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none appearance-none"
                                            >
                                                <option value="">Select Account</option>
                                                {bankAccounts.map(account => (
                                                    <option key={account._id} value={account._id}>
                                                        {account.bankName} - {account.accountNumber}
                                                    </option>
                                                ))}
                                            </select>
                                            <Banknote className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Amount Paid (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0.00"
                                    min="0"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none text-xl font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Reference / Cheque No.</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="reference_number"
                                        value={formData.reference_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none"
                                        placeholder="Optional"
                                    />
                                    <Hash className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>
                            <div className="col-span-1 md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-gray-700">Remarks</label>
                                <div className="relative">
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className="w-full px-4 py-3 pl-11 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all outline-none resize-none"
                                        placeholder="Any notes about this payment..."
                                    />
                                    <FileText className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary / Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Summary</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Payee</span>
                                <span className="font-semibold text-gray-900 truncate max-w-[150px]">
                                    {selectedParty ? getPartyDisplayName(selectedParty) : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-600">Mode</span>
                                <span className="font-semibold text-gray-900">{formData.payment_mode}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl border border-red-100">
                                <span className="text-red-700 font-medium">Total Amount</span>
                                <span className="text-2xl font-bold text-red-700">₹{Number(formData.amount).toLocaleString('en-IN') || '0'}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                                    Save & Record Payment
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}
