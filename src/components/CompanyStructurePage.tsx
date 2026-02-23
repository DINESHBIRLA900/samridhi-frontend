import React, { useState, useEffect } from "react";
import {
    Plus, Pencil, Trash2, X, ArrowUp, ArrowDown,
    Users, ShoppingCart, IndianRupee, Cpu, Megaphone,
    Factory, Box, ShieldCheck, Truck, CheckCircle,
    HelpCircle, Briefcase, Building2, UserCheck, Phone,
    Hammer, Wrench, Microscope, GraduationCap,
    HeartPulse, Scale, Globe, Terminal, Camera
} from "lucide-react";
import { toast, Toaster } from 'sonner';
import {
    getCompanyStructure,
    createCompanyStructure,
    updateCompanyStructure,
    deleteCompanyStructure,
    reorderCompanyStructure
} from "@/services/companyStructureService";
import PageHeader from "@/components/common/PageHeader";
import ActionButtons from "@/components/common/ActionButtons";

interface StructurePageProps {
    title: string;
    type: string; // 'department', 'roletype', 'jobtype', 'employee-category', 'team'
    fields: { name: string; label: string; type: string; required?: boolean; hideInTable?: boolean }[];
    viewMode?: 'table' | 'grid';
    onItemClick?: (item: any) => void;
}

export default function CompanyStructurePage({ title, type, fields, viewMode = 'table', onItemClick }: StructurePageProps) {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any | null>(null);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchItems();
    }, [type]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const data = await getCompanyStructure(type);
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch items", error);
            toast.error(`Failed to load ${title}`);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item: any = null) => {
        setCurrentItem(item);
        if (item) {
            setFormData(item);
        } else {
            setFormData({});
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
        setFormData({});
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (currentItem) {
                await updateCompanyStructure(type, currentItem._id, formData);
                toast.success(`${title} updated successfully`);
            } else {
                await createCompanyStructure(type, formData);
                toast.success(`${title} created successfully`);
            }
            fetchItems();
            handleCloseModal();
        } catch (error: any) {
            console.error("Failed to save item", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to save item";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteCompanyStructure(type, id);
            toast.success("Item deleted successfully");
            fetchItems();
        } catch (error) {
            console.error("Failed to delete item", error);
            toast.error("Failed to delete item");
        }
    };

    const handleReorder = async (id: string, direction: 'up' | 'down') => {
        try {
            await reorderCompanyStructure(type, id, direction);
            toast.success("Order updated");
            fetchItems();
        } catch (error) {
            console.error("Failed to reorder item", error);
            toast.error("Failed to reorder item");
        }
    };

    // Filter fields to show in table
    const tableFields = fields.filter(field => !field.hideInTable);

    // Helper for Title Case
    const toTitleCase = (str: any) => {
        if (str === null || str === undefined) return '';
        const s = String(str);
        return s.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    };

    // Helper for Department Icons
    const getDepartmentIcon = (name: string) => {
        const lowerName = name.toLowerCase();

        if (lowerName.includes('sale')) return <ShoppingCart size={24} />;
        if (lowerName.includes('hr') || lowerName.includes('human')) return <Users size={24} />;
        if (lowerName.includes('account') || lowerName.includes('financ')) return <IndianRupee size={24} />;
        if (lowerName.includes('it') || lowerName.includes('tech') || lowerName.includes('softwar')) return <Cpu size={24} />;
        if (lowerName.includes('market')) return <Megaphone size={24} />;
        if (lowerName.includes('product') || lowerName.includes('factor')) return <Factory size={24} />;
        if (lowerName.includes('stock') || lowerName.includes('inventor')) return <Box size={24} />;
        if (lowerName.includes('admin')) return <ShieldCheck size={24} />;
        if (lowerName.includes('logic') || lowerName.includes('truck') || lowerName.includes('deliver') || lowerName.includes('dispatch')) return <Truck size={24} />;
        if (lowerName.includes('quality') || lowerName.includes('qc') || lowerName.includes('testing')) return <CheckCircle size={24} />;
        if (lowerName.includes('service') || lowerName.includes('support')) return <HelpCircle size={24} />;
        if (lowerName.includes('manager') || lowerName.includes('management')) return <Briefcase size={24} />;
        if (lowerName.includes('onboarding') || lowerName.includes('recruit')) return <UserCheck size={24} />;
        if (lowerName.includes('call') || lowerName.includes('customer') || lowerName.includes('support')) return <Phone size={24} />;
        if (lowerName.includes('maintenanc') || lowerName.includes('repair')) return <Wrench size={24} />;
        if (lowerName.includes('research') || lowerName.includes('r&d') || lowerName.includes('lab')) return <Microscope size={24} />;
        if (lowerName.includes('train') || lowerName.includes('educat')) return <GraduationCap size={24} />;
        if (lowerName.includes('health') || lowerName.includes('medic')) return <HeartPulse size={24} />;
        if (lowerName.includes('legal') || lowerName.includes('complianc')) return <Scale size={24} />;
        if (lowerName.includes('design') || lowerName.includes('creative')) return <Camera size={24} />;
        if (lowerName.includes('dev') || lowerName.includes('eng')) return <Terminal size={24} />;

        return <Building2 size={24} />; // Default
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            <PageHeader
                title={title}
                description={`Manage ${title.toLowerCase()} list`}
                totalCount={items.length}
                addButtonLabel={`Add ${title}`}
                onAdd={() => handleOpenModal()}
            />

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 animate-pulse h-40"></div>
                        ))
                    ) : items.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-200">
                            No records found
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item._id}
                                onClick={() => onItemClick && onItemClick(item)}
                                className={`bg-gray-50 border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-all hover:shadow-lg group relative flex flex-col justify-between min-h-[180px] ${onItemClick ? 'cursor-pointer' : ''}`}
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-xl bg-linear-to-br from-orange-100 to-orange-200 border border-orange-300 text-orange-700">
                                            <div className="h-6 w-6 flex items-center justify-center">
                                                {type === 'department'
                                                    ? getDepartmentIcon(item[fields[0].name])
                                                    : <span className="font-bold">{item[fields[0].name]?.charAt(0).toUpperCase()}</span>
                                                }
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                                                className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold text-black mb-2 line-clamp-2">
                                        {fields[0].name === 'department' ? toTitleCase(item.department?.department_name) : toTitleCase(item[fields[0].name])}
                                    </h3>

                                    {/* Show secondary field if exists (e.g. head of dept) */}
                                    {fields.length > 1 && (
                                        <p className="text-sm text-gray-600 line-clamp-1">
                                            {fields[1].label}: <span className="text-gray-800">{item[fields[1].name]}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                                    <span>Added on {new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white backdrop-blur-md overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50 text-gray-700">
                                    <th className="p-5 font-semibold text-sm uppercase tracking-wider w-[80px] text-center whitespace-nowrap">Sr. No.</th>
                                    {tableFields.map((field) => (
                                        <th key={field.name} className="p-5 font-semibold text-sm uppercase tracking-wider text-center">{field.label}</th>
                                    ))}
                                    <th className="p-5 font-semibold text-sm uppercase tracking-wider w-[120px] text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={tableFields.length + 2} className="p-8 text-center text-gray-400">Loading data...</td></tr>
                                ) : items.length === 0 ? (
                                    <tr><td colSpan={tableFields.length + 2} className="p-8 text-center text-gray-500">No records found</td></tr>
                                ) : (
                                    items.map((item, index) => (
                                        <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                                            <td className="p-5 text-gray-600 font-mono text-sm text-center">{index + 1}</td>
                                            {tableFields.map((field) => (
                                                <td key={field.name} className="p-5 text-gray-700 group-hover:text-black transition-colors text-center">
                                                    {field.name === 'department'
                                                        ? toTitleCase(item.department?.department_name)
                                                        : field.name === 'order'
                                                            ? <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold text-xs border border-blue-100">{item[field.name]}</span>
                                                            : toTitleCase(item[field.name])
                                                    }
                                                </td>
                                            ))}
                                            <td className="p-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div className="flex flex-col gap-0.5 mr-2">
                                                        <button
                                                            onClick={() => handleReorder(item._id, 'up')}
                                                            className="p-1 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                                                            title="Move Up"
                                                        >
                                                            <ArrowUp size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReorder(item._id, 'down')}
                                                            className="p-1 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                                                            title="Move Down"
                                                        >
                                                            <ArrowDown size={14} />
                                                        </button>
                                                    </div>
                                                    <ActionButtons
                                                        onEdit={() => handleOpenModal(item)}
                                                        onDelete={() => handleDelete(item._id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-orange-500">
                            <h2 className="text-xl font-bold text-white">
                                {currentItem ? `Edit ${title}` : `Add New ${title}`}
                            </h2>
                            <button onClick={handleCloseModal} className="text-white hover:text-gray-200 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {fields.map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        {field.label}
                                    </label>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name] !== undefined && formData[field.name] !== null ? formData[field.name] : ''}
                                        onChange={handleChange}
                                        required={field.required}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all font-medium"
                                        placeholder={`Enter ${field.label}`}
                                        min={field.type === 'number' ? "1" : undefined}
                                        step={field.type === 'number' ? "1" : undefined}
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-5 py-2.5 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-medium border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all font-medium"
                                >
                                    {currentItem ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
