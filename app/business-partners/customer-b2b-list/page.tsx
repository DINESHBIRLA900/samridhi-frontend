"use client";

import { useState, useEffect } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/services/customerService";
import { Users, UserCheck, UserX, MessageCircle } from "lucide-react";
import { toast, Toaster } from 'sonner';
import CustomerB2BFormModal from "@/components/business-partners/CustomerB2BFormModal";
import StatsCard from "@/components/StatsCard";
import DashboardHeader from "@/components/common/DashboardHeader";

import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from "@/components/common/DateFilter";
import ActionButtons from "@/components/common/ActionButtons";

export default function CustomerB2BListPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState<{ option: DateFilterOption, range?: DateRange }>({ option: 'all' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);

    const handleDateFilterChange = (option: DateFilterOption, range?: DateRange) => {
        setDateFilter({ option, range });
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchData(searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchData = async (search = "") => {
        setLoading(true);
        try {
            const data = await getCustomers('B2B', search);
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
            toast.error("Failed to load customer list");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item: any = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this customer?")) return;
        try {
            await deleteCustomer(id);
            toast.success("Customer deleted");
            fetchData();
        } catch (error) {
            console.error("Failed to delete customer", error);
            toast.error("Failed to delete customer");
        }
    };

    // Generic filtering logic removed in favor of backend search
    const filteredItems = items;

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            <DashboardHeader
                title="Dealer List"
                description="Manage your Dealers"
                totalCount={items.length}
                addButtonLabel="Add Dealer"
                onAdd={() => handleOpenModal()}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Dealers"
                    value={items.length.toString()}
                    icon={<Users size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Dealers"
                    value={items.filter(i => i.status === 'Active').length.toString()}
                    icon={<UserCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Dealers"
                    value={items.filter(i => i.status === 'Inactive').length.toString()}
                    icon={<UserX size={24} />}
                    color="#ef4444"
                />
                <StatsCard
                    title="Recently Added"
                    value="0"
                    icon={<Users size={24} />}
                    color="#8b5cf6"
                />
            </div>

            {/* Content Area with Search & Filter & Table */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mt-6">
                <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-4">
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Dealer List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search dealers..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-700 bg-gray-50">
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Dealer / Company</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Contact Person</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Location</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">GSTIN</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Status</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        No dealers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <a
                                                    href={`/business-partners/customer-b2b-list/${item._id}`}
                                                    className="font-bold text-gray-900 hover:text-orange-600 transition-colors"
                                                >
                                                    {item.company_name || item.name}
                                                </a>
                                                <span className="text-xs text-gray-400 capitalize">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-gray-700 font-medium">
                                                    {item.contact_persons?.[0]?.person_name || item.contact_person || '-'}
                                                </span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="text-xs text-gray-500">
                                                        {item.contact_persons?.[0]?.number || item.phone}
                                                    </span>
                                                    {item.whatsapp_number && (
                                                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                                                            <MessageCircle size={10} className="fill-emerald-500" />
                                                            {item.whatsapp_number}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-700 uppercase tracking-tight">
                                                    {item.business_address?.district || item.district || '-'}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {item.business_address?.state || item.state || '-'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-mono text-gray-500 mb-1">{item.gstin || '-'}</span>
                                                <span className="text-[10px] text-gray-300 truncate max-w-[120px]">{item.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${item.status === 'Active'
                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                : 'bg-red-50 text-red-600 border-red-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <ActionButtons
                                                showView={true}
                                                onView={() => window.location.href = `/business-partners/customer-b2b-list/${item._id}`}
                                                onEdit={() => handleOpenModal(item)}
                                                onDelete={() => handleDelete(item._id)}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CustomerB2BFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                itemToEdit={currentItem}
                onSave={fetchData}
                service={{ create: createCustomer, update: updateCustomer }}
            />
        </div>
    );
}
