import React, { useState } from 'react';
import axios from 'axios';

interface AddressDetailsProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const AddressDetails: React.FC<AddressDetailsProps> = ({ formData, handleChange, setFormData }) => {
    const [loading, setLoading] = useState(false);

    const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const pincode = e.target.value;
        handleChange(e); // Update pincode in state

        if (pincode.length === 6) {
            setLoading(true);
            try {
                const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
                const data = response.data;

                if (data && data[0].Status === 'Success') {
                    const postOffice = data[0].PostOffice[0];
                    setFormData((prev: any) => ({
                        ...prev,
                        state: postOffice.State,
                        district: postOffice.District
                    }));
                }
            } catch (error) {
                console.error("Failed to fetch address details", error);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                Address Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Pincode */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode || ''}
                            onChange={handlePincodeChange}
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all font-mono shadow-sm font-medium"
                            placeholder="Enter Pincode"
                        />
                        {loading && (
                            <div className="absolute right-3 top-3.5">
                                <div className="animate-spin h-5 w-5 border-2 border-orange-500 rounded-full border-t-transparent"></div>
                            </div>
                        )}
                    </div>
                </div>

                {/* State */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                    </label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50/50 border border-orange-100 text-orange-700 placeholder-gray-300 focus:outline-none transition-all shadow-sm font-bold tracking-wide"
                        placeholder="State"
                        readOnly
                    />
                </div>

                {/* District */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        District
                    </label>
                    <input
                        type="text"
                        name="district"
                        value={formData.district || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-orange-50/50 border border-orange-100 text-orange-700 placeholder-gray-300 focus:outline-none transition-all shadow-sm font-bold tracking-wide"
                        placeholder="District"
                        readOnly
                    />
                </div>

                {/* Tehsil */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tehsil
                    </label>
                    <input
                        type="text"
                        name="tehsil"
                        value={formData.tehsil || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter Tehsil"
                    />
                </div>

                {/* City / Village */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City / Village
                    </label>
                    <input
                        type="text"
                        name="village"
                        value={formData.village || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter City / Village"
                    />
                </div>

                {/* Address Line */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address Line
                    </label>
                    <input
                        type="text"
                        name="address_line"
                        value={formData.address_line || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter Address Line"
                    />
                </div>
            </div>
        </div>
    );
};

export default AddressDetails;
