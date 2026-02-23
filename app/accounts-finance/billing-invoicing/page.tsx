"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, Receipt, Clock, AlertCircle, FileDigit } from "lucide-react";
import PageHeader from "@/components/common/PageHeader";
import StatsCard from '@/components/StatsCard';
import SearchInput from "@/components/common/SearchInput";

export default function BillingInvoicingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("Seals Bill");

    return (
        <div className="w-full max-w-[1600px] mx-auto min-h-screen">
            <PageHeader
                title="Billing / Invoicing"
                description="Create and manage invoices and billing records"
                totalCount={0}
                addButtonLabel="Create Bill"
                onAdd={() => console.log('Create Bill')}
            />

            {/* Quick Navigation Links - Restored */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8 mt-6">
                <Link href="/accounts-finance/billing-invoicing/seals-bill" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-orange-500 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <FileDigit size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Seals Bill</span>
                </Link>
                <Link href="/accounts-finance/billing-invoicing/seals-return" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-orange-500 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Receipt size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Seals Return</span>
                </Link>
                <Link href="/accounts-finance/billing-invoicing/payment-received" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-2 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                        <FileText size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Received</span>
                </Link>
                <Link href="/accounts-finance/billing-invoicing/payment-paid" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-red-500 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-2 group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <Receipt size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Paid</span>
                </Link>
                <Link href="/accounts-finance/billing-invoicing/purchase-bill" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-500 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <FileDigit size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Purchase Bill</span>
                </Link>
                <Link href="/accounts-finance/billing-invoicing/purchase-return" className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-700 hover:shadow-md transition-all group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center mb-2 group-hover:bg-blue-700 group-hover:text-white transition-colors">
                        <Receipt size={20} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">P. Return</span>
                </Link>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-orange-100 overflow-hidden mb-8">
                <div className="p-8 flex flex-col items-center">
                    <div className="w-full max-w-2xl">
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider text-center">Find Invoice / Bill</label>
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Enter Bill Number, Customer Name or Phone..."
                        />
                    </div>
                </div>

                {searchTerm ? (
                    <div className="border-t border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4 bg-gray-50/50">
                            <div className="flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
                                {['Seals Bill', 'Seals Return', 'Purchase Bill', 'Purchase Return'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm border ${activeTab === tab
                                            ? 'bg-orange-500 text-white border-orange-500'
                                            : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-100'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                            <p className="text-sm font-medium text-gray-500 italic">Showing results for: <span className="text-orange-600 font-bold">"{searchTerm}"</span></p>
                        </div>

                        <div className="p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
                            <div className="p-4 rounded-full bg-gray-100 mb-4 text-gray-400">
                                <FileText size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No matches found for "{activeTab}"</h3>
                            <p className="text-gray-500 max-w-md">
                                We couldn't find any records matching your search criteria in the selected category.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-20 text-center flex flex-col items-center justify-center border-t border-gray-50">
                        <div className="p-6 rounded-full bg-orange-50 mb-6 text-orange-500 animate-pulse">
                            <FileDigit size={64} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 mb-3">Welcome to Billing Search</h3>
                        <p className="text-gray-500 max-w-lg text-lg">
                            Please enter a bill number, customer name, or mobile number in the search box above to view details.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
