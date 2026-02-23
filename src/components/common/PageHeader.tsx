import React from 'react';
import { Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    description: string;
    totalCount?: number;
    addButtonLabel?: string;
    onAdd?: () => void;
    children?: React.ReactNode;
    showBack?: boolean;
}

export default function PageHeader({
    title,
    description,
    totalCount,
    addButtonLabel,
    onAdd,
    children,
    showBack = false
}: PageHeaderProps) {
    const router = useRouter();

    return (
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-white border-2 border-orange-500 p-6 shadow-lg">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    {showBack && (
                        <button
                            onClick={() => router.back()}
                            className="p-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors border border-orange-200"
                            title="Go Back"
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        {title}
                    </h1>
                </div>
                <p className="text-gray-600 flex items-center gap-2 text-sm md:text-base">
                    {description}
                    {totalCount !== undefined && (
                        <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-xs border border-orange-300 text-orange-800 shrink-0 font-bold">
                            {totalCount} Total
                        </span>
                    )}
                </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                {children}
                {onAdd && addButtonLabel && (
                    <button
                        onClick={onAdd}
                        className="flex items-center gap-2 bg-linear-to-br from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 font-bold w-full md:w-auto justify-center"
                    >
                        <Plus size={20} />
                        {addButtonLabel}
                    </button>
                )}
            </div>
        </div>
    );
}
