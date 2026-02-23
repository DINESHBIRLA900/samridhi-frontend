"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import { PlayCircle, Pencil, Trash2, Plus, X, Upload } from "lucide-react";
import { toast, Toaster } from 'sonner';

function VideoFormModal({ onClose, onSuccess, editData }: { onClose: () => void; onSuccess: () => void; editData?: any }) {
    const [title, setTitle] = useState(editData?.title || "");
    const [status, setStatus] = useState(editData?.status || "Active");
    const [video, setVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState(editData?.videoUrl || "");
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<any>({});

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("video/")) { toast.error("Please select a video file"); return; }
        if (file.size > 50 * 1024 * 1024) { toast.error("Video must be less than 50MB"); return; }
        setVideo(file);
        setVideoPreview(URL.createObjectURL(file));
        setErrors((p: any) => ({ ...p, video: "" }));
    };

    const validate = () => {
        const e: any = {};
        if (!title.trim()) e.title = "Title is required";
        if (!editData && !video) e.video = "Video file is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        try {
            const { createVideo, updateVideo } = await import('@/services/advertisementService');
            const fd = new FormData();
            fd.append("title", title.trim());
            fd.append("status", status);
            if (video) fd.append("video", video);
            if (editData) { await updateVideo(editData._id, fd); }
            else { await createVideo(fd); }
            onSuccess();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to save video");
        } finally { setSubmitting(false); }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
                <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-2xl">
                    <h2 className="text-xl font-bold text-gray-800">{editData ? "Edit Video" : "Upload Video"}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
                        <input type="text" value={title} onChange={e => { setTitle(e.target.value); setErrors((p: any) => ({ ...p, title: "" })); }}
                            className={`w-full px-4 py-2.5 border ${errors.title ? "border-red-400" : "border-gray-300"} rounded-lg focus:outline-none focus:border-orange-400 text-gray-800`}
                            placeholder="Enter video title" />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Video File {!editData && <span className="text-red-500">*</span>}</label>
                        {videoPreview ? (
                            <div className="rounded-xl overflow-hidden border border-gray-200 bg-black">
                                <video src={videoPreview} controls className="w-full max-h-48" />
                                <button type="button" onClick={() => { setVideo(null); if (!editData) setVideoPreview(""); }}
                                    className="w-full px-4 py-1.5 text-xs text-gray-500 hover:bg-gray-100 transition-colors bg-white">
                                    Change Video
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="video-file" className={`flex flex-col items-center justify-center h-40 border-2 border-dashed ${errors.video ? "border-red-400" : "border-gray-300"} rounded-xl cursor-pointer hover:border-orange-400 transition-colors bg-gray-50`}>
                                <div className="text-center text-gray-400"><Upload size={32} className="mx-auto mb-2" /><p className="text-sm">Click to upload video</p><p className="text-xs mt-1">MP4, MOV, AVI up to 50MB</p></div>
                            </label>
                        )}
                        <input id="video-file" type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
                        {errors.video && <p className="text-red-500 text-xs mt-1">{errors.video}</p>}
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
                            {submitting ? "Saving..." : editData ? "Update" : "Upload Video"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdvertisementVideoPage() {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [previewVideo, setPreviewVideo] = useState<string | null>(null);

    useEffect(() => { fetchVideos(); }, []);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const { getVideos } = await import('@/services/advertisementService');
            const res = await getVideos();
            setVideos(res.data || []);
        } catch { toast.error("Failed to load videos"); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this video?")) return;
        try {
            const { deleteVideo } = await import('@/services/advertisementService');
            await deleteVideo(id);
            toast.success("Video deleted");
            fetchVideos();
        } catch { toast.error("Failed to delete"); }
    };

    const handleSuccess = () => {
        setShowModal(false);
        setEditData(null);
        toast.success(editData ? "Video updated" : "Video uploaded");
        fetchVideos();
    };

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const filtered = videos.filter(v => v.title?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            <PageHeader title="Advertisement Videos" description="Manage promotional videos and multimedia content" totalCount={videos.length}>
                <button onClick={() => { setEditData(null); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow transition-colors">
                    <Plus size={18} /> Upload Video
                </button>
            </PageHeader>

            <div className="mt-6">
                <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search videos..." />
            </div>

            {loading ? (
                <div className="mt-4 py-16 text-center text-gray-400">Loading videos...</div>
            ) : filtered.length === 0 ? (
                <div className="mt-4 py-16 text-center border border-gray-200 rounded-2xl bg-gray-50">
                    <PlayCircle size={48} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-gray-400">{searchTerm ? "No videos match your search" : "No videos yet. Click \"Upload Video\" to add one."}</p>
                </div>
            ) : (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(vid => (
                        <div key={vid._id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                            <div className="relative h-44 bg-gray-900 cursor-pointer" onClick={() => setPreviewVideo(vid.videoUrl)}>
                                {vid.thumbnailUrl ? (
                                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover opacity-80" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><PlayCircle size={48} className="text-gray-500" /></div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                    <PlayCircle size={40} className="text-white" />
                                </div>
                                <div className="absolute top-2 right-2">
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${vid.status === 'Active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>{vid.status}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-1">{vid.title}</h3>
                                <p className="text-xs text-gray-400">{formatDate(vid.createdAt)}</p>
                                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                                    <button onClick={() => setPreviewVideo(vid.videoUrl)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><PlayCircle size={14} /> Play</button>
                                    <button onClick={() => { setEditData(vid); setShowModal(true); }} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"><Pencil size={14} /> Edit</button>
                                    <button onClick={() => handleDelete(vid._id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /> Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && <VideoFormModal onClose={() => { setShowModal(false); setEditData(null); }} onSuccess={handleSuccess} editData={editData} />}

            {previewVideo && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setPreviewVideo(null)}>
                    <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setPreviewVideo(null)} className="absolute -top-10 right-0 text-white"><X size={28} /></button>
                        <video src={previewVideo} controls autoPlay className="w-full rounded-xl shadow-2xl" />
                    </div>
                </div>
            )}
        </div>
    );
}
