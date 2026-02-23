import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface WhatsAppMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    phoneNumber: string;
    recipientName?: string;
}

const WhatsAppMessageModal: React.FC<WhatsAppMessageModalProps> = ({
    isOpen,
    onClose,
    phoneNumber,
    recipientName
}) => {
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSend = () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        // Clean phone number (remove any non-numeric characters)
        const cleanNumber = phoneNumber.replace(/\D/g, '');

        // WhatsApp API link
        // Use https://wa.me/ for both mobile and web
        const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

        // Open in new tab
        window.open(whatsappUrl, '_blank');

        // Close modal and clear message
        onClose();
        setMessage('');
    };

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0f172a] w-full max-w-md rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                            <MessageCircle size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Send WhatsApp</h2>
                            <p className="text-gray-400 text-xs mt-0.5">
                                To: <span className="text-emerald-500 font-medium">{recipientName || 'Recipient'}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-[#0f172a]">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                Your Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full h-32 px-4 py-3 rounded-xl bg-black/20 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none"
                                placeholder="Type your message here..."
                                autoFocus
                            />
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                            <div className="p-1 rounded-full bg-emerald-500/20">
                                <Send size={12} className="text-emerald-500" />
                            </div>
                            This will redirect you to WhatsApp to send the message manually.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        className="flex-2 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
                    >
                        <Send size={18} />
                        Send Message
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhatsAppMessageModal;
