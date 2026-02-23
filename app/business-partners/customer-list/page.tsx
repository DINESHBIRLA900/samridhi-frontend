"use client";

import { useState, useEffect } from "react";
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from "@/services/customerService";
import { Users, UserCheck, UserX, MessageCircle } from "lucide-react";
import { toast, Toaster } from 'sonner';
import CustomerB2CFormModal from "@/components/business-partners/CustomerB2CFormModal";
import StatsCard from "@/components/StatsCard";
import DashboardHeader from "@/components/common/DashboardHeader";

import SearchInput from "@/components/common/SearchInput";
import DateFilter, { DateFilterOption, DateRange } from "@/components/common/DateFilter";
import ActionButtons from "@/components/common/ActionButtons";

export default function CustomerListPage() {
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
            const data = await getCustomers('B2C', search);
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
                title="Farmer List"
                description="Manage your Farmers"
                totalCount={items.length}
                addButtonLabel="Add Farmer"
                onAdd={() => handleOpenModal()}
            />

            {/* Standardized Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
                <StatsCard
                    title="Total Farmers"
                    value={items.length.toString()}
                    icon={<Users size={24} />}
                    color="#3b82f6"
                />
                <StatsCard
                    title="Active Farmers"
                    value={items.filter(i => i.status === 'Active').length.toString()}
                    icon={<UserCheck size={24} />}
                    color="#10b981"
                />
                <StatsCard
                    title="Inactive Farmers"
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
                    <h2 className="text-lg font-bold text-gray-800 shrink-0 whitespace-nowrap">Farmer List</h2>
                    <div className="flex flex-row items-center gap-4 w-full justify-end">
                        <div className="w-full max-w-[768px] flex-1 transition-all">
                            <SearchInput
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search farmers..."
                            />
                        </div>
                        <DateFilter onFilterChange={handleDateFilterChange} />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-gray-700 bg-gray-50">
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Name</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Contact Info</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Address</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider">Status</th>
                                <th className="py-4 px-6 font-medium uppercase text-xs tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                        No farmers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredItems.map(item => (
                                    <tr key={item._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="py-4 px-6 font-medium text-gray-800">
                                            <a
                                                href={`/business-partners/customer-list/${item._id}`}
                                                className="hover:text-orange-600 hover:underline transition-colors"
                                            >
                                                {item.name}
                                            </a>
                                            {item.father_name && <div className="text-xs text-gray-500">S/O {item.father_name}</div>}
                                        </td>
                                        <td className="py-4 px-6 text-gray-700">
                                            <div className="flex flex-col text-sm">
                                                <div className="flex items-center gap-1.5">
                                                    <span>{item.phone}</span>
                                                    {item.whatsapp_number && (
                                                        <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-100">
                                                            <MessageCircle size={10} className="fill-emerald-500" />
                                                            {item.whatsapp_number}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.email && <span className="text-gray-500">{item.email}</span>}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-gray-700 text-sm">
                                            {item.village || item.city || item.address || '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${item.status === 'Active'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <ActionButtons
                                                showView={true}
                                                onView={() => window.location.href = `/business-partners/customer-list/${item._id}`}
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

            <CustomerB2CFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                itemToEdit={currentItem}
                onSave={fetchData}
                service={{ create: createCustomer, update: updateCustomer }}
            />
        </div>
    );
}
