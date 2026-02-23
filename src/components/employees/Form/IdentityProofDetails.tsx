import React from 'react';

interface IdentityProofDetailsProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormData?: React.Dispatch<React.SetStateAction<any>>;
}

const IdentityProofDetails: React.FC<IdentityProofDetailsProps> = ({ formData, handleChange, setFormData }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                Identity Proof Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Aadhaar Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Aadhaar Number
                    </label>
                    <input
                        type="text"
                        name="aadhaar_number"
                        value={formData.aadhaar_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-mono tracking-wide shadow-sm font-medium"
                        placeholder="Enter Aadhaar number"
                    />
                </div>

                {/* PAN Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PAN Number
                    </label>
                    <input
                        type="text"
                        name="pan_number"
                        value={formData.pan_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-mono uppercase shadow-sm font-medium"
                        placeholder="Enter PAN number"
                    />
                </div>

                {/* Driving License Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Driving License Number <span className="text-xs text-gray-400 ml-1 font-normal">(Optional)</span>
                    </label>
                    <input
                        type="text"
                        name="driving_license_number"
                        value={formData.driving_license_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-mono uppercase shadow-sm font-medium"
                        placeholder="Enter Driving License number"
                    />
                </div>
            </div>
        </div>
    );
};

export default IdentityProofDetails;
