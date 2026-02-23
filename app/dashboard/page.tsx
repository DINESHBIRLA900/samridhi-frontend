
"use client";

import Sidebar from "../../src/components/Sidebar";

export default function Dashboard() {
    return (
        <div className="min-h-screen w-full bg-white text-black">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="transition-all duration-300 md:ml-72 px-4 pt-16 pb-4 md:p-8">
                {/* Header */}
                <header className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-white border-2 border-orange-500 p-6 shadow-lg">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Samridhdhi Super Admin</h2>
                        <p className="text-gray-600 text-sm md:text-base">Manage your business</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 shadow-lg border-2 border-orange-500 shrink-0"></div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Card 1 */}
                    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-8 transition-all hover:bg-gray-100 hover:shadow-lg">
                        <h3 className="text-lg font-medium text-gray-700">Total Products</h3>
                        <p className="mt-4 text-5xl font-extrabold text-orange-600">0</p>
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl transition-all group-hover:bg-orange-500/20"></div>
                    </div>

                    {/* Card 2 */}
                    <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-8 transition-all hover:bg-gray-100 hover:shadow-lg">
                        <h3 className="text-lg font-medium text-gray-700">Total Sales</h3>
                        <p className="mt-4 text-5xl font-extrabold text-orange-600">₹0</p>
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl transition-all group-hover:bg-orange-500/20"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}
