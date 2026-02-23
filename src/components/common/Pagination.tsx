import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            pages.push('...');
        }
    }

    const uniquePages = pages.filter((item, index) => pages.indexOf(item) === index);

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 border-t border-gray-100">
            <div className="text-sm text-gray-500">
                Page <span className="font-medium text-gray-900">{currentPage}</span> of <span className="font-medium text-gray-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <ChevronLeft size={20} />
                </button>

                {uniquePages.map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-3 py-1.5 text-gray-400">...</span>
                        ) : (
                            <button
                                onClick={() => onPageChange(page as number)}
                                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${currentPage === page
                                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                                    : 'text-gray-600 hover:bg-white hover:text-orange-600'
                                    }`}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
