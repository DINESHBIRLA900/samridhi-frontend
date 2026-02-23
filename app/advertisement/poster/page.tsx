"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { Eye, Pencil, Trash2, Plus, X, Upload, Image as ImageIcon } from "lucide-react";
import { toast, Toaster } from 'sonner';

function PosterFormModal({ onClose, onSuccess, editData }: { onClose: () => void; onSuccess: () => void; editData?: any }) {
    const [title, setTitle] = useState(editData?.title || "");
    const [dimensions, setDimensions] = useState(editData?.dimensions || "");
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
        if (!dimensions.trim()) e.dimensions = "Dimensions are required";
        if (!editData && !image) e.image = "Image is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const { createPoster, updatePoster } = await import('@/services/advertisementService');
            const fd = new FormData();
            fd.append("title", title.trim());
            fd.append("dimensions", dimensions.trim());
            fd.append("status", status);
            if (image) fd.append("image", image);
            if (editData) { await updatePoster(editData._id, fd); }
            else { await createPoster(fd); }
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save poster");
        } finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800">{editData ? "Edit Poster" : "Add New Poster"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                        <input type="text" value={title} onChange={e => { setTitle(e.target.value); setErrors((p: any) => ({ ...p, title: "" })); }}
                            className={`w-full px-4 py-2.5 border ${errors.title ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:border-orange-400 text-gray-800`}
                            placeholder="Enter poster title" />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions <span className="text-red-500">*</span></label>
                        <input type="text" value={dimensions} onChange={e => { setDimensions(e.target.value); setErrors((p: any) => ({ ...p, dimensions: "" })); }}
                            className={`w-full px-4 py-2.5 border ${errors.dimensions ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:border-orange-400 text-gray-800`}
                            placeholder="e.g. 1200x600, A4" />
                        {errors.dimensions && <p className="text-red-500 text-xs mt-1">{errors.dimensions}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image {!editData && <span className="text-red-500">*</span>}</label>
                        <label htmlFor="poster-img" className={`flex flex-col items-center justify-center h-40 border-2 border-dashed ${errors.image ? "border-red-400" : "border-gray-300"} rounded-xl cursor-pointer hover:border-orange-400 transition-colors bg-gray-50 overflow-hidden`}>
                            {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" /> : (
                                <div className="text-center text-gray-400"><Upload size={32} className="mx-auto mb-2" /><p className="text-sm">Click to upload</p><p className="text-xs mt-1">PNG, JPG up to 5MB</p></div>
                            )}
                        </label>
                        <input id="poster-img" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
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
                            {submitting ? "Saving..." : editData ? "Update" : "Add Poster"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdvertisementPosterPage() {
    const [posters, setPosters] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);

    useEffect(() => { fetchPosters(); }, []);

    const fetchPosters = async () => {
        setLoading(true);
        try {
            const { getPosters } = await import('@/services/advertisementService');
            const res = await getPosters();
            setPosters(res.data || []);
        } catch { toast.error("Failed to load posters"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this poster?")) return;
        try {
            const { deletePoster } = await import('@/services/advertisementService');
            await deletePoster(id);
            toast.success("Poster deleted");
            fetchPosters();
        } catch { toast.error("Failed to delete"); }
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditData(null);
        toast.success(editData ? "Poster updated" : "Poster added");
        fetchPosters();
    };

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const filtered = posters.filter(p => p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || p.dimensions?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            <PageHeader title="Advertisement Posters" description="Manage marketing posters and promotional materials" totalCount={posters.length}>
                <button onClick={() => { setEditData(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow transition-colors">
                    <Plus size={18} /> Add Poster
                </button>
            </PageHeader>

            <div className="mt-6">
                <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search posters..." />
            </div>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-3.5 px-5">Image</th>
                                <th className="py-3.5 px-5">Title</th>
                                <th className="py-3.5 px-5">Dimensions</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5">Created</th>
                                <th className="py-3.5 px-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={6} className="py-12 text-center text-gray-400">Loading posters...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center">
                                        <ImageIcon size={40} className="mx-auto text-gray-200 mb-2" />
                                        <p className="text-gray-400">{searchTerm ? "No posters match your search" : "No posters yet. Click \"Add Poster\" to create one."}</p>
                                    </td>
                                </tr>
                            ) : filtered.map(poster => (
                                <tr key={poster._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3.5 px-5">
                                        <div onClick={() => setPreviewImg(poster.image)} className="w-16 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity">
                                            {poster.image ? <img src={poster.image} alt={poster.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-5 font-medium text-gray-800">{poster.title}</td>
                                    <td className="py-3.5 px-5 text-gray-500 text-sm">{poster.dimensions}</td>
                                    <td className="py-3.5 px-5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${poster.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{poster.status}</span>
                                    </td>
                                    <td className="py-3.5 px-5 text-gray-500 text-sm">{formatDate(poster.createdAt)}</td>
                                    <td className="py-3.5 px-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setPreviewImg(poster.image)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye size={16} /></button>
                                            <button onClick={() => { setEditData(poster); setShowModal(true); }} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                                            <button onClick={() => handleDelete(poster._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && <PosterFormModal onClose={() => { setShowModal(false); setEditData(null); }} onSuccess={handleSuccess} editData={editData} />}

            {previewImg && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewImg(null)}>
                    <div className="relative max-w-3xl w-full">
                        <button onClick={() => setPreviewImg(null)} className="absolute -top-10 right-0 text-white"><X size={28} /></button>
                        <img src={previewImg} alt="Preview" className="w-full h-auto rounded-xl shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
}
