import React, { useState } from 'react';

interface BankDetailsProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BankDetails: React.FC<BankDetailsProps> = ({ formData, handleChange }) => {
    const [reEnterAccountNumber, setReEnterAccountNumber] = useState(formData.account_number || '');
    const [error, setError] = useState('');

    const handleReEnterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setReEnterAccountNumber(value);
        if (value !== formData.account_number) {
            setError('Account numbers do not match');
        } else {
            setError('');
        }
    };

    const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e);
        if (reEnterAccountNumber && e.target.value !== reEnterAccountNumber) {
            setError('Account numbers do not match');
        } else {
            setError('');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                Bank Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Bank Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Name
                    </label>
                    <input
                        type="text"
                        name="bank_name"
                        value={formData.bank_name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter Bank Name"
                    />
                </div>

                {/* Account Holder Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Holder Name
                    </label>
                    <input
                        type="text"
                        name="account_holder_name"
                        value={formData.account_holder_name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter Account Holder Name"
                    />
                </div>

                {/* Account Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Number
                    </label>
                    <input
                        type="password"
                        name="account_number"
                        value={formData.account_number || ''}
                        onChange={handleAccountChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter Account Number"
                    />
                </div>

                {/* Re-Enter Account Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Re-Enter Account Number
                    </label>
                    <input
                        type="text"
                        value={reEnterAccountNumber}
                        onChange={handleReEnterChange}
                        className={`w-full px-4 py-3 rounded-xl bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-200'} text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium`}
                        placeholder="Re-Enter Account Number"
                    />
                    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>

                {/* UPI ID */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        UPI ID
                    </label>
                    <input
                        type="text"
                        name="upi_id"
                        value={formData.upi_id || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter UPI ID"
                    />
                </div>
            </div>
        </div>
    );
};

export default BankDetails;
