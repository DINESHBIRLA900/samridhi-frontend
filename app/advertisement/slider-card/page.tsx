"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { Eye, Pencil, Trash2, Plus, X, Upload, Layers } from "lucide-react";
import { toast, Toaster } from 'sonner';

function SliderCardFormModal({ onClose, onSuccess, editData }: { onClose: () => void; onSuccess: () => void; editData?: any }) {
    const [title, setTitle] = useState(editData?.title || "");
    const [link, setLink] = useState(editData?.link || "");
    const [order, setOrder] = useState(editData?.order?.toString() || "0");
    const [status, setStatus] = useState(editData?.status || "Active");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState(editData?.image || "");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
        if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((p: any) => ({ ...p, image: "" }));
    };

    const validate = () => {
        const e: any = {};
        if (!title.trim()) e.title = "Title is required";
        if (!editData && !image) e.image = "Image is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const { createSliderCard, updateSliderCard } = await import('@/services/advertisementService');
            const fd = new FormData();
            fd.append("title", title.trim());
            fd.append("link", link.trim());
            fd.append("order", order || "0");
            fd.append("status", status);
            if (image) fd.append("image", image);
            if (editData) { await updateSliderCard(editData._id, fd); }
            else { await createSliderCard(fd); }
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save slider card");
        } finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800">{editData ? "Edit Slider Card" : "Add Slider Card"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                        <input type="text" value={title} onChange={e => { setTitle(e.target.value); setErrors((p: any) => ({ ...p, title: "" })); }}
                            className={`w-full px-4 py-2.5 border ${errors.title ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:border-orange-400 text-gray-800`}
                            placeholder="Enter slider card title" />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link (optional)</label>
                        <input type="url" value={link} onChange={e => setLink(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-gray-800"
                            placeholder="https://example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                        <input type="number" min="0" value={order} onChange={e => setOrder(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-gray-800" />
                        <p className="text-xs text-gray-400 mt-1">Lower number = shown first</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slide Image {!editData && <span className="text-red-500">*</span>}</label>
                        <label htmlFor="slider-img" className={`flex flex-col items-center justify-center h-40 border-2 border-dashed ${errors.image ? "border-red-400" : "border-gray-300"} rounded-xl cursor-pointer hover:border-orange-400 transition-colors bg-gray-50 overflow-hidden`}>
                            {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /> : (
                                <div className="text-center text-gray-400"><Upload size={32} className="mx-auto mb-2" /><p className="text-sm">Click to upload</p><p className="text-xs mt-1">PNG, JPG up to 5MB — Recommended: 1920x600</p></div>
                            )}
                        </label>
                        <input id="slider-img" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-400 text-gray-800 bg-white">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">Cancel</button>
                        <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                            {submitting ? "Saving..." : editData ? "Update" : "Add Slider Card"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdvertisementSliderCardPage() {
    const [sliderCards, setSliderCards] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);

    useEffect(() => { fetchSliderCards(); }, []);

    const fetchSliderCards = async () => {
        setLoading(true);
        try {
            const { getSliderCards } = await import('@/services/advertisementService');
            const res = await getSliderCards();
            setSliderCards(res.data || []);
        } catch { toast.error("Failed to load slider cards"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this slider card?")) return;
        try {
            const { deleteSliderCard } = await import('@/services/advertisementService');
            await deleteSliderCard(id);
            toast.success("Slider card deleted");
            fetchSliderCards();
        } catch { toast.error("Failed to delete"); }
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditData(null);
        toast.success(editData ? "Slider card updated" : "Slider card added");
        fetchSliderCards();
    };

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const filtered = sliderCards.filter(c => c.title?.toLowerCase().includes(searchTerm.toLowerCase()) || c.link?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            <PageHeader title="Advertisement Slider Cards" description="Manage homepage carousel and slider content" totalCount={sliderCards.length}>
                <button onClick={() => { setEditData(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow transition-colors">
                    <Plus size={18} /> Add Slider Card
                </button>
            </PageHeader>

            <div className="mt-6">
                <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search slider cards..." />
            </div>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-3.5 px-5">Slide</th>
                                <th className="py-3.5 px-5">Title</th>
                                <th className="py-3.5 px-5">Order</th>
                                <th className="py-3.5 px-5">Link</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5">Created</th>
                                <th className="py-3.5 px-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={7} className="py-12 text-center text-gray-400">Loading slider cards...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center">
                                        <Layers size={40} className="mx-auto text-gray-200 mb-2" />
                                        <p className="text-gray-400">{searchTerm ? "No slider cards match your search" : "No slider cards yet. Click \"Add Slider Card\" to create one."}</p>
                                    </td>
                                </tr>
                            ) : filtered.map(card => (
                                <tr key={card._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3.5 px-5">
                                        <div onClick={() => setPreviewImg(card.image)} className="w-20 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                                            {card.image ? <img src={card.image} alt={card.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-5 font-medium text-gray-800">{card.title}</td>
                                    <td className="py-3.5 px-5">
                                        <span className="px-2 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold border border-orange-200">#{card.order}</span>
                                    </td>
                                    <td className="py-3.5 px-5 text-sm">
                                        {card.link ? <a href={card.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px] block">{card.link}</a> : <span className="text-gray-300">—</span>}
                                    </td>
                                    <td className="py-3.5 px-5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${card.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{card.status}</span>
                                    </td>
                                    <td className="py-3.5 px-5 text-gray-500 text-sm">{formatDate(card.createdAt)}</td>
                                    <td className="py-3.5 px-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setPreviewImg(card.image)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye size={16} /></button>
                                            <button onClick={() => { setEditData(card); setShowModal(true); }} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                                            <button onClick={() => handleDelete(card._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <SliderCardFormModal onClose={() => { setShowModal(false); setEditData(null); }} onSuccess={handleSuccess} editData={editData} />}

            {previewImg && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImg(null)}>
                    <div className="relative max-w-4xl w-full">
                        <button onClick={() => setPreviewImg(null)} className="absolute -top-10 right-0 text-white"><X size={28} /></button>
                        <img src={previewImg} alt="Slide Preview" className="w-full h-auto rounded-xl shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
}
