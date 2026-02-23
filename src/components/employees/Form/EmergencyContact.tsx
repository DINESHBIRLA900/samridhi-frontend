import React from 'react';

interface EmergencyContactProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmergencyContact: React.FC<EmergencyContactProps> = ({ formData, handleChange }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                Emergency Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Person Name */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Person Name
                    </label>
                    <input
                        type="text"
                        name="emergency_person_name"
                        value={formData.emergency_person_name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter person name"
                    />
                </div>

                {/* Relation */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Relation
                    </label>
                    <input
                        type="text"
                        name="emergency_relation"
                        value={formData.emergency_relation || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter relation"
                    />
                </div>

                {/* Contact Number */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Number
                    </label>
                    <input
                        type="text"
                        name="emergency_contact_number"
                        value={formData.emergency_contact_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 transition-all shadow-sm font-medium"
                        placeholder="Enter contact number"
                    />
                </div>
            </div>
        </div>
    );
};

export default EmergencyContact;
