"use client";

import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";

export default function CustomerPaymentsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            {/* Header Box */}
            <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-white border-2 border-orange-500 p-6 shadow-lg">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Customer Payments</h2>
                    <p className="text-gray-600 text-sm md:text-base">Track and manage customer payment records</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 shadow-lg border-2 border-orange-500 shrink-0"></div>
            </header>

            <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search customer payments..."
            />

            {/* Content will be added later */}
        </div>
    );
}
