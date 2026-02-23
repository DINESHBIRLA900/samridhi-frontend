import React from 'react';
import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
    title?: string;
    description?: string;
    totalCount?: number;
    addButtonLabel?: string;
    onAdd?: () => void;
    children?: React.ReactNode;
}

export default function DashboardHeader({
    title = "Samridhdhi Super Admin",
    description = "Manage your business",
    totalCount,
    addButtonLabel,
    onAdd,
    children
}: DashboardHeaderProps) {
    return (
        <header className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-white border-2 border-orange-500 p-6 shadow-lg">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{title}</h2>
                    {totalCount !== undefined && (
                        <span className="px-3 py-1 rounded-full bg-orange-100 text-xs font-semibold text-orange-700 border border-orange-200">
                            {totalCount} Total
                        </span>
                    )}
                </div>
                <p className="text-gray-600 text-sm md:text-base">{description}</p>
            </div>

            <div className="flex items-center gap-4">
                {children}

                {onAdd && addButtonLabel && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
                    >
                        <Plus size={20} />
                        {addButtonLabel}
                    </button>
                )}

                {/* Decorative Icon - kept from original dashboard design */}
                <div className="h-10 w-10 rounded-full bg-linear-to-br from-orange-500 to-orange-600 shadow-lg border-2 border-orange-500 shrink-0 hidden md:block"></div>
            </div>
        </header>
    );
}
