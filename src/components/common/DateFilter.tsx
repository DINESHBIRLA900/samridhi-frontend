import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, Filter } from 'lucide-react';
import { format, subDays, startOfWeek, endOfWeek, isSameDay } from 'date-fns';

export type DateFilterOption = 'all' | 'today' | 'week' | 'custom';

export interface DateRange {
    from: Date | null;
    to: Date | null;
}

interface DateFilterProps {
    onFilterChange: (option: DateFilterOption, range?: DateRange) => void;
}

export default function DateFilter({ onFilterChange }: DateFilterProps) {
    const [selectedOption, setSelectedOption] = useState<DateFilterOption>('all');
    const [isOpen, setIsOpen] = useState(false);

    // Custom date range state
    const [customRange, setCustomRange] = useState<DateRange>({
        from: null,
        to: null
    });

    const handleOptionSelect = (option: DateFilterOption) => {
        setSelectedOption(option);

        let range: DateRange | undefined = undefined;
        const today = new Date();

        switch (option) {
            case 'today':
                range = { from: today, to: today };
                break;
            case 'week':
                // Assuming week starts on Monday (1)
                range = {
                    from: startOfWeek(today, { weekStartsOn: 1 }),
                    to: endOfWeek(today, { weekStartsOn: 1 })
                };
                break;
            case 'custom':
                // Don't close or trigger change immediately for custom, 
                // wait for them to input dates
                setIsOpen(true);
                return;
            case 'all':
            default:
                range = { from: null, to: null };
                break;
        }

        setIsOpen(false);
        onFilterChange(option, range);
    };

    const handleCustomDateChange = (type: 'from' | 'to', value: string) => {
        if (!value) return;

        const newDate = new Date(value);
        const newRange = { ...customRange, [type]: newDate };
        setCustomRange(newRange);

        if (newRange.from && newRange.to) {
            onFilterChange('custom', newRange);
            // Optionally auto-close when both are selected, but better to let user click away
        }
    };

    const getDisplayText = () => {
        switch (selectedOption) {
            case 'all': return 'All Time';
            case 'today': return 'Today';
            case 'week': return 'Current Week';
            case 'custom':
                if (customRange.from && customRange.to) {
                    return `${format(customRange.from, 'MMM d, yy')} - ${format(customRange.to, 'MMM d, yy')}`;
                }
                return 'Custom Range';
            default: return 'Filter by Date';
        }
    };

    return (
        <div className="relative">
            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all font-medium text-sm
                    ${isOpen || selectedOption !== 'all'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
            >
                <Filter size={16} className={selectedOption !== 'all' ? 'text-orange-500' : 'text-gray-400'} />
                <span>{getDisplayText()}</span>
                <ChevronDown size={14} className={`ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => handleOptionSelect('all')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedOption === 'all' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            All Time
                        </button>
                        <button
                            onClick={() => handleOptionSelect('today')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedOption === 'today' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => handleOptionSelect('week')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedOption === 'week' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Current Week
                        </button>
                        <button
                            onClick={() => handleOptionSelect('custom')}
                            className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${selectedOption === 'custom' ? 'bg-orange-50 text-orange-700' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            Custom Range
                        </button>
                    </div>

                    {/* Custom Range Inputs */}
                    {selectedOption === 'custom' && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">From Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={customRange.from ? format(customRange.from, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => handleCustomDateChange('from', e.target.value)}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                    <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">To Date</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={customRange.to ? format(customRange.to, 'yyyy-MM-dd') : ''}
                                        onChange={(e) => handleCustomDateChange('to', e.target.value)}
                                        min={customRange.from ? format(customRange.from, 'yyyy-MM-dd') : ''}
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                    <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Apply Filter
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Click away overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
