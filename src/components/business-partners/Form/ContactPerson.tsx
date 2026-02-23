import React from 'react';

interface ContactPersonProps {
    formData: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ContactPerson: React.FC<ContactPersonProps> = ({ formData, handleChange }) => {
    return (
        <div className="bg-orange-50/50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Person Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Person Name
                    </label>
                    <input
                        type="text"
                        name="person_name"
                        value={formData.person_name || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                        placeholder="Enter person name"
                    />
                </div>

                {/* Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number
                    </label>
                    <input
                        type="text"
                        name="number"
                        value={formData.number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                        placeholder="Enter number"
                    />
                </div>

                {/* What's Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        What's Number
                    </label>
                    <input
                        type="text"
                        name="whatsapp_number"
                        value={formData.whatsapp_number || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                        placeholder="Enter WhatsApp number"
                    />
                </div>

                {/* Mail ID */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mail ID
                    </label>
                    <input
                        type="email"
                        name="mail_id"
                        value={formData.mail_id || ''}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                        placeholder="Enter mail ID"
                    />
                </div>
            </div>
        </div>
    );
};

export default ContactPerson;
