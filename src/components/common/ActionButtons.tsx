import React from 'react';
import { Pencil, Trash2, Eye } from 'lucide-react';

interface ActionButtonsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    showView?: boolean;
    showEdit?: boolean;
    showDelete?: boolean;
}

export default function ActionButtons({
    onView,
    onEdit,
    onDelete,
    showView = false,
    showEdit = true,
    showDelete = true
}: ActionButtonsProps) {
    return (
        <div className="flex items-center justify-end gap-2 transition-opacity">
            {showView && onView && (
                <button
                    onClick={onView}
                    className="p-2 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                    title="View Details"
                >
                    <Eye size={16} />
                </button>
            )}
            {showEdit && (
                <button
                    onClick={onEdit}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Pencil size={16} />
                </button>
            )}
            {showDelete && (
                <button
                    onClick={onDelete}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    );
}
