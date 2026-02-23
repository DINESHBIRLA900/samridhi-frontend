"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";
import AddAdvertisementCard from "@/components/advertisements/AddAdvertisementCard";
import { Eye, Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function CardPointDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const pointNumber = searchParams.get("pointNumber") || "1";
    const pointName = searchParams.get("pointName") || "Card Point";

    const [cards, setCards] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [cardPointId, setCardPointId] = useState<string | null>(null);

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) { setCardPointId(id); fetchCards(id); }
    }, [searchParams]);

    const fetchCards = async (pointId: string) => {
        setLoading(true);
        try {
            const { getAdvertisementCards } = await import('@/services/advertisementService');
            const response = await getAdvertisementCards(pointId);
            setCards(response.data || []);
        } catch { toast.error('Failed to load cards'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this card?")) return;
        try {
            const { deleteAdvertisementCard } = await import('@/services/advertisementService');
            await deleteAdvertisementCard(id);
            toast.success("Card deleted");
            if (cardPointId) fetchCards(cardPointId);
        } catch { toast.error("Failed to delete card"); }
    };

    const handleSuccess = async () => {
        setShowAddModal(false);
        setSelectedCard(null);
        toast.success(selectedCard ? "Card updated" : "Card created");
        if (cardPointId) fetchCards(cardPointId);
    };

    const formatDate = (d: string) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-";

    const filteredCards = cards.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full max-w-[1600px] mx-auto">
            <Toaster position="top-right" theme="light" />

            {/* Back Button */}
            <button onClick={() => router.push("/advertisement/card")}
                className="flex items-center gap-2 mb-4 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium">
                <ArrowLeft size={18} /> Back to Advertisement Cards
            </button>

            {/* Card Point Info Banner */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex items-center gap-4">
                <span className="inline-flex px-4 py-2 rounded-full text-lg font-bold bg-orange-500 text-white shadow">
                    #{pointNumber}
                </span>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{pointName}</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage advertisement cards for this point</p>
                </div>
            </div>

            <PageHeader title="Advertisement Cards" description="Manage cards associated with this card point" totalCount={cards.length}>
                <button onClick={() => { setSelectedCard(null); setShowAddModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow transition-colors">
                    <Plus size={18} /> Add Card
                </button>
            </PageHeader>

            <div className="mt-6">
                <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search cards..." />
            </div>

            <div className="mt-4 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="py-3.5 px-5">Image</th>
                                <th className="py-3.5 px-5">Title</th>
                                <th className="py-3.5 px-5">Status</th>
                                <th className="py-3.5 px-5">From Date</th>
                                <th className="py-3.5 px-5">To Date</th>
                                <th className="py-3.5 px-5">Created</th>
                                <th className="py-3.5 px-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={7} className="py-12 text-center text-gray-400">Loading cards...</td></tr>
                            ) : filteredCards.length === 0 ? (
                                <tr><td colSpan={7} className="py-12 text-center text-gray-400">{searchTerm ? "No cards match your search." : "No cards yet. Click \"Add Card\" to create one."}</td></tr>
                            ) : filteredCards.map(card => (
                                <tr key={card._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3.5 px-5">
                                        <div className="w-14 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                            {card.image ? <img src={card.image} alt={card.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">IMG</div>}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-5 font-medium text-gray-800">{card.title}</td>
                                    <td className="py-3.5 px-5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${card.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{card.status}</span>
                                    </td>
                                    <td className="py-3.5 px-5 text-gray-500 text-sm">{formatDate(card.fromDate)}</td>
                                    <td className="py-3.5 px-5 text-gray-500 text-sm">{formatDate(card.toDate)}</td>
                                    <td className="py-3.5 px-5 text-gray-500 text-sm">{formatDate(card.createdAt)}</td>
                                    <td className="py-3.5 px-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => toast.info("Coming soon")} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View"><Eye size={16} /></button>
                                            <button onClick={() => { setSelectedCard(card); setShowAddModal(true); }} className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Edit"><Pencil size={16} /></button>
                                            <button onClick={() => handleDelete(card._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddModal && (
                <AddAdvertisementCard
                    onClose={() => { setShowAddModal(false); setSelectedCard(null); }}
                    onSuccess={handleSuccess}
                    editData={selectedCard}
                    cardPointId={cardPointId || undefined}
                />
            )}
        </div>
    );
}
