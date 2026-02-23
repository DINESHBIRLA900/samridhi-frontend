"use client";

import Sidebar from "@/components/Sidebar";

export default function AccountsFinanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen w-full bg-white text-black">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 transition-all duration-300 md:ml-72 px-4 pt-16 pb-4 md:p-8 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
