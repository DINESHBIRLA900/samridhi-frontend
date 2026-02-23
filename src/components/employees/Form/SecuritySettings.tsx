import React from 'react';
import { Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

interface SecuritySettingsProps {
    formData: any;
    isEditing: boolean;
    refreshData?: () => void; // Callback to refresh user data after reset
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ formData, isEditing, refreshData }) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

    const copyToClipboard = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    const handleResetPassword = async () => {
        if (!window.confirm('Are you sure you want to reset the password to default (12345)? This will also clear the mPIN.')) {
            return;
        }

        try {
            await axios.put(`${API_URL}/api/users/reset-password/${formData._id}`);
            toast.success('Password reset to default (12345) successfully');
            if (refreshData) refreshData();
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                    Security Settings
                </h3>
                {isEditing && (
                    <button
                        type="button"
                        onClick={handleResetPassword}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all text-sm font-bold border border-red-200 shadow-sm transform active:scale-95"
                    >
                        <RefreshCw size={16} />
                        Reset Password
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* ID (Mobile Number) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Login ID (Mobile Number)
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.mobile_number || 'Not Set'}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 focus:outline-none cursor-default font-medium shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => copyToClipboard(formData.mobile_number, 'ID')}
                            className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-600 transition-colors"
                        >
                            <Copy size={16} />
                        </button>
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.visible_password || '******'}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl bg-orange-50/30 border border-orange-100 text-orange-700 font-mono focus:outline-none cursor-default font-bold shadow-sm"
                        />
                        {formData.visible_password && (
                            <button
                                type="button"
                                onClick={() => copyToClipboard(formData.visible_password, 'Password')}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-600 transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Default: '12345'. Changed by App.
                    </p>
                </div>

                {/* mPIN */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        mPIN
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={formData.visible_mpin || 'Not Set'}
                            readOnly
                            className="w-full px-4 py-3 rounded-xl bg-orange-50/30 border border-orange-100 text-orange-700 font-mono focus:outline-none cursor-default font-bold shadow-sm"
                        />
                        {formData.visible_mpin && (
                            <button
                                type="button"
                                onClick={() => copyToClipboard(formData.visible_mpin, 'mPIN')}
                                className="absolute right-3 top-3.5 text-gray-400 hover:text-orange-600 transition-colors"
                            >
                                <Copy size={16} />
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Set by App.
                    </p>
                </div>
            </div>

            <div className="mt-8 p-6 bg-orange-50 border border-orange-200 rounded-2xl shadow-sm">
                <p className="text-sm text-orange-800 flex items-start gap-3">
                    <span className="text-xl">⚠️</span>
                    <span>
                        <strong>Security Note:</strong> Passwords and mPINs are visible here as per requirements.
                        Please ensure this screen is only visible to authorized administrators.
                        <br />
                        <span className="text-orange-600 opacity-90 mt-2 block font-medium">
                            If the user forgets their password, use the <strong>Reset Password</strong> button to restore the default '12345'.
                        </span>
                    </span>
                </p>
            </div>
        </div>
    );
};

export default SecuritySettings;
