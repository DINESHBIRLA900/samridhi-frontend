"use client";

import Sidebar from "@/components/Sidebar";

export default function ServiceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-white text-black">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 w-full md:ml-72 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
