"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Printer, Download, UserPlus } from "lucide-react";
import BusinessPartnerFormModal from "@/components/business-partners/BusinessPartnerFormModal";
import { createVendor, updateVendor, getVendors } from "@/services/vendorService";
import { createSupplier, updateSupplier, getSuppliers } from "@/services/supplierService";
// import { Search } from "lucide-react"; // Unused in original, keeping it out

export default function PurchaseReturnPage() {
    const [returnDate, setReturnDate] = useState("");
    const [vendorName, setVendorName] = useState("");
    const [vendorGST, setVendorGST] = useState("");
    const [originalInvoiceNo, setOriginalInvoiceNo] = useState(""); // Changed from vendorInvoiceNo
    const [vendorAddress, setVendorAddress] = useState("");
    const [partnerType, setPartnerType] = useState<'Vendor' | 'Supplier'>('Vendor');
    const [partners, setPartners] = useState<any[]>([]);
    const [filteredPartners, setFilteredPartners] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [items, setItems] = useState([
        { id: 1, name: "", hsnCode: "", quantity: 0, unit: "", rate: 0, discount: 0, gstRate: 18 }
    ]);
    const [reason, setReason] = useState("");

    // Payment/Refund States (optional for return, maybe 'Refund Mode'?)
    // For now keeping it simple or maybe removing payment logic if it's just a debit note creation.
    // Usually return implies a Debit Note.

    // Total calculation logic (Same as Purchase Bill)
    const addItem = () => {
        setItems([...items, {
            id: items.length + 1,
            name: "",
            hsnCode: "",
            quantity: 0,
            unit: "",
            rate: 0,
            discount: 0,
            gstRate: 18
        }]);
    };

    const removeItem = (id: number) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleItemChange = (id: number, field: string, value: any) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateItemTotal = (item: any) => {
        const taxableAmount = (item.quantity * item.rate) - item.discount;
        const gstAmount = (taxableAmount * item.gstRate) / 100;
        return taxableAmount + gstAmount;
    };

    const calculateGrossTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    };

    const calculateTotalDiscount = () => {
        return items.reduce((sum, item) => sum + (item.discount || 0), 0);
    };

    const calculateSubTotal = () => {
        return calculateGrossTotal() - calculateTotalDiscount();
    };

    const calculateTotalGST = () => {
        return items.reduce((sum, item) => {
            const taxableAmount = (item.quantity * item.rate) - item.discount;
            return sum + (taxableAmount * item.gstRate) / 100;
        }, 0);
    };

    const calculateTotalAmount = () => {
        return calculateSubTotal() + calculateTotalGST();
    };

    const calculateRoundOff = () => {
        const total = calculateTotalAmount();
        return Math.round(total) - total;
    };

    const calculateGrandTotal = () => {
        return Math.round(calculateTotalAmount());
    };

    // Fetch partners logic (Same as Purchase Bill)
    useState(() => {
        const fetchPartners = async () => {
            try {
                const data = partnerType === 'Vendor' ? await getVendors() : await getSuppliers();
                setPartners(data);
                setFilteredPartners(data);
            } catch (error) {
                console.error("Error fetching partners:", error);
            }
        };
        fetchPartners();
    });

    const updatePartnersList = async () => {
        try {
            const data = partnerType === 'Vendor' ? await getVendors() : await getSuppliers();
            setPartners(data);
            setFilteredPartners(data);
        } catch (error) {
            console.error("Error fetching partners:", error);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setVendorName(value);
        setShowDropdown(true);

        const filtered = partners.filter(p =>
            p.name.toLowerCase().includes(value.toLowerCase()) ||
            (p.gstin && p.gstin.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredPartners(filtered);
    };

    const handlePartnerSelect = (partner: any) => {
        setVendorName(partner.name);
        setVendorGST(partner.gstin || "");

        const addressParts = [
            partner.address_line,
            partner.village,
            partner.city,
            partner.tehsil,
            partner.district,
            partner.state,
            partner.pincode
        ].filter(Boolean);

        setVendorAddress(addressParts.join(", "));
        setShowDropdown(false);
    };

    const handlePartnerAdded = async () => {
        await updatePartnersList();
        setShowVendorModal(false);
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/accounts-finance/billing-invoicing"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="text-gray-600" size={24} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Purchase Return</h1>
                        <p className="text-gray-600 text-sm">Create new purchase return (Debit Note)</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium">
                        <Printer size={18} />
                        Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg font-medium">
                        <Download size={18} />
                        Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-lg font-medium">
                        <Save size={18} />
                        Save Return
                    </button>
                </div>
            </div>

            {/* Bill Form */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 pb-8 border-b border-gray-200">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Return No / DN No</label>
                        <input
                            type="text"
                            value="PR-2026-001"
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Original Invoice No</label>
                        <input
                            type="text"
                            value={originalInvoiceNo}
                            onChange={(e) => setOriginalInvoiceNo(e.target.value)}
                            placeholder="Enter Original Bill No"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Return</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        >
                            <option value="">Select Reason</option>
                            <option value="damaged">Damaged Goods</option>
                            <option value="defective">Defective</option>
                            <option value="incorrect_item">Incorrect Item</option>
                            <option value="excess_quantity">Excess Quantity</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Partner Details */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                    <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-300 w-full sm:w-auto min-w-[300px]">
                            <button
                                type="button"
                                onClick={() => {
                                    setPartnerType('Vendor');
                                    setVendorName("");
                                    setVendorGST("");
                                    setTimeout(() => updatePartnersList(), 0);
                                }}
                                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${partnerType === 'Vendor'
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                Vendor
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPartnerType('Supplier');
                                    setVendorName("");
                                    setVendorGST("");
                                    setTimeout(() => updatePartnersList(), 0);
                                }}
                                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${partnerType === 'Supplier'
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                Supplier
                            </button>
                        </div>

                        <button
                            onClick={() => setShowVendorModal(true)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all shadow-md font-medium"
                        >
                            <UserPlus size={18} />
                            Add New {partnerType}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{partnerType} Name *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vendorName}
                                    onChange={handleNameChange}
                                    onFocus={() => {
                                        updatePartnersList();
                                        setShowDropdown(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    placeholder={`Search ${partnerType.toLowerCase()} name`}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    autoComplete="off"
                                />
                                {showDropdown && filteredPartners.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {filteredPartners.map((partner: any) => (
                                            <div
                                                key={partner._id || partner.current_id || Math.random()}
                                                className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center group border-b border-gray-100 last:border-0"
                                                onClick={() => handlePartnerSelect(partner)}
                                            >
                                                <div>
                                                    <div className="font-medium text-gray-800 group-hover:text-orange-700">{partner.name}</div>
                                                    <div className="text-xs text-gray-500">{partner.gstin || 'No GST'}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">{partnerType} GST Number</label>
                            <input
                                type="text"
                                value={vendorGST}
                                onChange={(e) => setVendorGST(e.target.value)}
                                placeholder="Enter GST number"
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            />
                        </div>

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">{partnerType} Address</label>
                            <textarea
                                value={vendorAddress}
                                onChange={(e) => setVendorAddress(e.target.value)}
                                placeholder={`Enter ${partnerType.toLowerCase()} address`}
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Return Items</h3>
                        <div className="flex gap-3">
                            {/* Optional: Add Product from Library */}
                            <button
                                onClick={addItem}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all font-medium"
                            >
                                <Plus size={18} />
                                Add Item
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b-2 border-gray-300 bg-gray-50">
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[40px]">S.No</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700">Item Name</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[120px]">HSN Code</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[100px]">Qty</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[80px]">Unit</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[120px]">Rate (₹)</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[100px]">Disc (₹)</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[100px]">GST %</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[120px]">Total (₹)</th>
                                    <th className="p-3 font-semibold text-sm text-gray-700 w-[60px]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="p-3 text-center text-gray-600">{index + 1}</td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.name || ''}
                                                onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                                                placeholder="Item name"
                                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.hsnCode || ''}
                                                onChange={(e) => handleItemChange(item.id, 'hsnCode', e.target.value)}
                                                placeholder="HSN"
                                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={item.quantity || ''}
                                                onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                                                placeholder="0"
                                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                value={item.unit || ''}
                                                onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                                placeholder="Pcs"
                                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={item.rate || ''}
                                                onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                value={item.discount || ''}
                                                onChange={(e) => handleItemChange(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <select
                                                value={item.gstRate}
                                                onChange={(e) => handleItemChange(item.id, 'gstRate', parseFloat(e.target.value))}
                                                className="w-full px-2 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="0">0%</option>
                                                <option value="5">5%</option>
                                                <option value="12">12%</option>
                                                <option value="18">18%</option>
                                                <option value="28">28%</option>
                                            </select>
                                        </td>
                                        <td className="p-3 text-right font-medium text-gray-800">
                                            ₹{calculateItemTotal(item).toFixed(2)}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left side - Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes/Remarks</label>
                        <textarea
                            rows={4}
                            placeholder="Enter any notes or remarks"
                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        ></textarea>
                    </div>

                    {/* Right side - Summary */}
                    <div>
                        <div className="bg-gray-50 border-2 border-gray-300 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Return Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Sub Total:</span>
                                    <span className="font-medium">₹{calculateGrossTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-red-500">
                                    <span>Discount:</span>
                                    <span className="font-medium">-₹{calculateTotalDiscount().toFixed(2)}</span>
                                </div>
                                <div className="border-t border-gray-200 my-2"></div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>CGST Amount:</span>
                                    <span className="font-medium">₹{(calculateTotalGST() / 2).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>SGST Amount:</span>
                                    <span className="font-medium">₹{(calculateTotalGST() / 2).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700 font-medium">
                                    <span>Total GST:</span>
                                    <span className="text-orange-600">₹{calculateTotalGST().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Round Off:</span>
                                    <span className="font-medium">
                                        {calculateRoundOff() > 0 ? '+' : ''}
                                        ₹{calculateRoundOff().toFixed(2)}
                                    </span>
                                </div>
                                <div className="border-t-2 border-gray-300 pt-3 flex justify-between text-lg font-bold text-gray-800">
                                    <span>Grand Total:</span>
                                    <span className="text-orange-600">₹{calculateGrandTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BusinessPartnerFormModal
                isOpen={showVendorModal}
                onClose={() => setShowVendorModal(false)}
                itemToEdit={null}
                onSave={handlePartnerAdded}
                type={partnerType}
                service={partnerType === 'Vendor'
                    ? { create: createVendor, update: updateVendor }
                    : { create: createSupplier, update: updateSupplier }
                }
            />
        </div>
    );
}
