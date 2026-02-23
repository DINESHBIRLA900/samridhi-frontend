"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Save, Printer, Download, UserPlus } from "lucide-react";
import CustomerB2BFormModal from "@/components/business-partners/CustomerB2BFormModal";
import CustomerB2CFormModal from "@/components/business-partners/CustomerB2CFormModal";
import { getCustomers, createCustomer, updateCustomer } from "@/services/customerService";

export default function SealsReturnPage() {
    const [returnDate, setReturnDate] = useState("");
    const [originalBillNo, setOriginalBillNo] = useState("");

    // Customer Details
    const [customerName, setCustomerName] = useState("");
    const [customerGST, setCustomerGST] = useState(""); // For B2B
    const [customerMobile, setCustomerMobile] = useState(""); // For B2C
    const [customerAddress, setCustomerAddress] = useState("");

    // Partner Type: Dealer (B2B) or Farmer (B2C)
    const [partnerType, setPartnerType] = useState<'Dealer' | 'Farmer'>('Dealer');

    const [customers, setCustomers] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    // Modals
    const [showB2BModal, setShowB2BModal] = useState(false);
    const [showB2CModal, setShowB2CModal] = useState(false);

    const [items, setItems] = useState([
        { id: 1, name: "", hsnCode: "", quantity: 0, unit: "", rate: 0, discount: 0, gstRate: 18 }
    ]);
    const [reason, setReason] = useState("");


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

    // Fetch Customers
    const fetchCustomers = async () => {
        try {
            const apiType = partnerType === 'Dealer' ? 'B2B' : 'B2C';
            const data = await getCustomers(apiType);

            const list = Array.isArray(data) ? data : (data.customers || []);
            setCustomers(list);
            setFilteredCustomers(list);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    // Initial Fetch & Type Change Logic
    useState(() => {
        fetchCustomers();
    });

    const handleTypeChange = (type: 'Dealer' | 'Farmer') => {
        setPartnerType(type);
        setCustomerName("");
        setCustomerGST("");
        setCustomerMobile("");
        setCustomerAddress("");

        const apiType = type === 'Dealer' ? 'B2B' : 'B2C';
        getCustomers(apiType).then(data => {
            const list = Array.isArray(data) ? data : (data.customers || []);
            setCustomers(list);
            setFilteredCustomers(list);
        }).catch(err => console.error(err));
    };


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomerName(value);
        setShowDropdown(true);

        const filtered = customers.filter(c =>
            (c.business_name && c.business_name.toLowerCase().includes(value.toLowerCase())) || // B2B
            (c.name && c.name.toLowerCase().includes(value.toLowerCase())) || // B2C/B2B
            (c.mobile && c.mobile.includes(value)) ||
            (c.gstin && c.gstin.toLowerCase().includes(value.toLowerCase()))
        );
        setFilteredCustomers(filtered);
    };

    const handleCustomerSelect = (customer: any) => {
        // B2B uses business_name, B2C uses name (usually)
        setCustomerName(customer.business_name || customer.name || "");

        if (partnerType === 'Dealer') {
            setCustomerGST(customer.gstin || "");
        } else {
            setCustomerMobile(customer.mobile || "");
        }

        const addressParts = [
            customer.address_line,
            customer.village,
            customer.city,
            customer.tehsil,
            customer.district,
            customer.state,
            customer.pincode
        ].filter(Boolean);

        setCustomerAddress(addressParts.join(", "));
        setShowDropdown(false);
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
                        <h1 className="text-3xl font-bold text-gray-800">Seals Return</h1>
                        <p className="text-gray-600 text-sm">Create credit note for sales return</p>
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">Return No / CN No</label>
                        <input
                            type="text"
                            value="SR-2026-001"
                            disabled
                            className="w-full px-4 py-3 rounded-xl bg-gray-100 border border-gray-300 text-gray-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Original Bill No</label>
                        <input
                            type="text"
                            value={originalBillNo}
                            onChange={(e) => setOriginalBillNo(e.target.value)}
                            placeholder="Enter Bill No"
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
                            <option value="customer_return">Customer Return</option>
                            <option value="incorrect_item">Incorrect Item</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Customer Details */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                    <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-300 w-full sm:w-auto min-w-[300px]">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('Dealer')}
                                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${partnerType === 'Dealer'
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                Dealer
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('Farmer')}
                                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-all ${partnerType === 'Farmer'
                                    ? 'bg-orange-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-200'
                                    }`}
                            >
                                Farmer
                            </button>
                        </div>

                        <button
                            onClick={() => partnerType === 'Dealer' ? setShowB2BModal(true) : setShowB2CModal(true)}
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
                                    value={customerName}
                                    onChange={handleNameChange}
                                    onFocus={() => {
                                        setShowDropdown(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    placeholder={`Search ${partnerType.toLowerCase()} name`}
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    autoComplete="off"
                                />
                                {showDropdown && filteredCustomers.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                                        {filteredCustomers.map((customer: any) => (
                                            <div
                                                key={customer._id || customer.id || Math.random()}
                                                className="px-4 py-3 hover:bg-orange-50 cursor-pointer flex justify-between items-center group border-b border-gray-100 last:border-0"
                                                onClick={() => handleCustomerSelect(customer)}
                                            >
                                                <div>
                                                    <div className="font-medium text-gray-800 group-hover:text-orange-700">
                                                        {customer.business_name || customer.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {partnerType === 'Dealer' ? (customer.gstin || 'No GST') : (customer.mobile || 'No Mobile')}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {partnerType === 'Dealer' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
                                <input
                                    type="text"
                                    value={customerGST}
                                    onChange={(e) => setCustomerGST(e.target.value)}
                                    placeholder="Enter GST number"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                <input
                                    type="text"
                                    value={customerMobile}
                                    onChange={(e) => setCustomerMobile(e.target.value)}
                                    placeholder="Enter Mobile number"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                            </div>
                        )}

                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Billing Address</label>
                            <textarea
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
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
                        <h3 className="text-lg font-semibold text-gray-800">Returned Items</h3>
                        <div className="flex gap-3">
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
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Notes/Remarks</label>
                                <textarea
                                    rows={4}
                                    placeholder="Enter any notes or remarks"
                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                ></textarea>
                            </div>
                        </div>
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

            {/* Modals */}
            <CustomerB2BFormModal
                isOpen={showB2BModal}
                onClose={() => setShowB2BModal(false)}
                onSave={fetchCustomers}
                itemToEdit={null}
                service={{ create: createCustomer, update: updateCustomer }}
            />
            <CustomerB2CFormModal
                isOpen={showB2CModal}
                onClose={() => setShowB2CModal(false)}
                onSave={fetchCustomers}
                itemToEdit={null}
                service={{ create: createCustomer, update: updateCustomer }}
            />
        </div>
    );
}
