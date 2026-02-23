import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    color?: 'orange' | 'blue' | 'green' | 'red';
}

export default function StatsCard({ title, value, icon: Icon, color = 'orange' }: StatsCardProps) {
    // Map color to classes
    const colorClasses = {
        orange: {
            text: 'text-orange-600',
            bg: 'bg-orange-500/10',
            hoverBg: 'group-hover:bg-orange-500/20',
            border: 'border-orange-200'
        },
        blue: {
            text: 'text-blue-600',
            bg: 'bg-blue-500/10',
            hoverBg: 'group-hover:bg-blue-500/20',
            border: 'border-blue-200'
        },
        green: {
            text: 'text-green-600',
            bg: 'bg-green-500/10',
            hoverBg: 'group-hover:bg-green-500/20',
            border: 'border-green-200'
        },
        red: {
            text: 'text-red-600',
            bg: 'bg-red-500/10',
            hoverBg: 'group-hover:bg-red-500/20',
            border: 'border-red-200'
        }
    };

    const currentTheme = colorClasses[color];

    return (
        <div className={`group relative overflow-hidden rounded-3xl border ${currentTheme.border} bg-white p-6 transition-all hover:bg-gray-50 hover:shadow-lg`}>
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
                    {Icon && (
                        <div className={`p-2 rounded-xl ${currentTheme.bg}`}>
                            <Icon size={20} className={currentTheme.text} />
                        </div>
                    )}
                </div>
                <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${currentTheme.text}`}>{value}</p>
                </div>
            </div>

            {/* Decorative Background Element */}
            <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full ${currentTheme.bg} blur-2xl transition-all ${currentTheme.hoverBg}`}></div>
        </div>
    );
}
