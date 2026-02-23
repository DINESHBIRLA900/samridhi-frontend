"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import AddAdvertisementCard from "@/components/advertisements/AddAdvertisementCard";
import AddCardPoint from "@/components/advertisements/AddCardPoint";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast, Toaster } from 'sonner';

export default function AdvertisementCardPage() {
    const router = useRouter();
    const [cardPoints, setCardPoints] = useState<any[]>([]);
    const [showAddPointModal, setShowAddPointModal] = useState(false);
    const [selectedCardPoint, setSelectedCardPoint] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => { fetchCardPoints(); }, []);

    const fetchCardPoints = async () => {
        setLoading(true);
        try {
            const { getCardPoints } = await import('@/services/advertisementService');
            const response = await getCardPoints();
            setCardPoints(response.data || []);
        } catch { toast.error('Failed to load card points'); }
        finally { setLoading(false); }
    };

    const handleEditPoint = (point: any, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedCardPoint(point);
        setShowAddPointModal(true);
    };

    const handleViewPoint = (point: any) => {
        const params = new URLSearchParams({ id: point._id, pointNumber: point.pointNumber.toString(), pointName: point.pointName });
        router.push(`/advertisement/card-point?${params.toString()}`);
    };

    const handleDeletePoint = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this card point?")) return;
        try {
            const { deleteCardPoint } = await import('@/services/advertisementService');
            await deleteCardPoint(id);
            toast.success("Card point deleted");
            fetchCardPoints();
        } catch { toast.error("Failed to delete card point"); }
    };

    const handlePointSuccess = async () => {
        setShowAddPointModal(false);
        setSelectedCardPoint(null);
        toast.success(selectedCardPoint ? "Card point updated" : "Card point created");
        fetchCardPoints();
    };

    const filtered = cardPoints.filter(p =>
        p.pointName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            <PageHeader title="Advertisement Cards" description="Manage advertisement card points" totalCount={cardPoints.length}>
                <button onClick={() => { setSelectedCardPoint(null); setShowAddPointModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow transition-colors">
                    <Plus size={18} /> Add Card Point
                </button>
            </PageHeader>

            <div className="mt-6">
                <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search card points..." />
            </div>

            <div className="mt-4">
                {loading ? (
                    <div className="py-16 text-center text-gray-400">Loading card points...</div>
                ) : filtered.length === 0 ? (
                    <div className="py-16 text-center border border-gray-200 rounded-2xl bg-gray-50">
                        <p className="text-gray-400">{searchTerm ? "No card points match your search." : "No card points yet. Click \"Add Card Point\" to create one."}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map(point => (
                            <div key={point._id} onClick={() => handleViewPoint(point)}
                                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-bold bg-orange-100 text-orange-700 border border-orange-200">
                                        #{point.pointNumber}
                                    </span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={(e) => handleEditPoint(point, e)}
                                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={(e) => handleDeletePoint(point._id, e)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed font-medium line-clamp-3">{point.pointName}</p>
                                <p className="text-xs text-orange-500 mt-3 font-medium">Click to view cards →</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showAddPointModal && (
                <AddCardPoint
                    onClose={() => { setShowAddPointModal(false); setSelectedCardPoint(null); }}
                    onSuccess={handlePointSuccess}
                    editData={selectedCardPoint}
                    nextPointNumber={cardPoints.length + 1}
                />
            )}
        </div>
    );
}
