import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: string;
    trendUp?: boolean;
    color?: string; // Hex color for icon background/text
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendUp, color = '#10b981' }) => {
    return (
        <div className="group relative overflow-hidden rounded-3xl border border-orange-200 bg-white p-6 transition-all hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
                </div>
                {icon && (
                    <div
                        className="p-3 rounded-2xl bg-gray-50 border border-gray-100"
                        style={{ color: color }}
                    >
                        {icon}
                    </div>
                )}
            </div>

            {trend && (
                <div className="mt-4 flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {trend}
                    </span>
                    <span className="text-xs text-gray-400">vs last month</span>
                </div>
            )}

            {/* Background Glow Effect */}
            <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full blur-3xl opacity-10 transition-all group-hover:opacity-20 pointer-events-none"
                style={{ backgroundColor: color }}
            ></div>
        </div>
    );
};

export default StatsCard;
