"use client";

import { useState, useEffect } from "react";
import { getTeams, deleteTeam } from "@/services/teamService";
import { Plus, Pencil, Trash2, Search, User as UserIcon, Building2, MapPin, ChevronRight } from "lucide-react";
import { toast, Toaster } from 'sonner';
import TeamFormModal from "@/components/teams/TeamFormModal";
import { useRouter } from "next/navigation";

export default function TeamStructurePage() {
    const router = useRouter();
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<any>(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const data = await getTeams();
            setTeams(data);
        } catch (error) {
            console.error("Failed to fetch teams", error);
            toast.error("Failed to load teams");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (item: any = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this team?")) return;
        try {
            await deleteTeam(id);
            toast.success("Team deleted");
            fetchTeams();
        } catch (error) {
            console.error("Failed to delete team", error);
            toast.error("Failed to delete team");
        }
    };

    const filteredTeams = teams.filter(team =>
        team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.zone_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.department?.department_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper for Title Case
    const toTitleCase = (str: string) => {
        if (!str) return '';
        return str.replace(
            /\w\S*/g,
            (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
    };

    return (
        <div className="p-8 max-w-[1600px] mx-auto min-h-screen bg-gray-50">
            <Toaster position="top-right" theme="light" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase">
                        Team Structure
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2 uppercase text-xs">
                        MANAGE YOUR ORGANIZATION'S WORKFORCE
                        <span className="px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[10px] border border-orange-100 font-bold">
                            {teams.length} TEAMS
                        </span>
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/25 font-bold uppercase"
                >
                    <Plus size={20} />
                    Create Team
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="SEARCH TEAMS BY NAME, ZONE, OR DEPARTMENT..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 shadow-sm uppercase text-sm"
                />
            </div>

            {/* Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTeams.map(team => (
                    <div
                        key={team._id}
                        onClick={() => router.push(`/company-structure/team-structure/${team._id}`)}
                        className="group bg-white border border-gray-200 rounded-2xl p-5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-500/5 transition-all relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenModal(team);
                                }}
                                className="p-2 bg-gray-100 hover:bg-orange-50 text-gray-600 hover:text-orange-600 rounded-lg transition-colors"
                            >
                                <Pencil size={16} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(team._id);
                                }}
                                className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-50 to-orange-100 border border-orange-100 flex items-center justify-center text-xl font-bold text-orange-600 shadow-sm">
                                {team.team_name.charAt(0).toUpperCase()}
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${team.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                : 'bg-red-50 text-red-600 border-red-200'
                                }`}>
                                {team.status}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-1">{toTitleCase(team.team_name)}</h3>
                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                            <MapPin size={14} className="text-orange-400" />
                            {toTitleCase(team.zone_name) || 'No Zone'}
                        </p>

                        <div className="space-y-3 border-t border-gray-100 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2 font-medium">
                                    <Building2 size={16} className="text-gray-400" />
                                    Dept
                                </span>
                                <span className="text-gray-900 font-semibold">{toTitleCase(team.department?.department_name || '-')}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-2 font-medium">
                                    <UserIcon size={16} className="text-gray-400" />
                                    Handler
                                </span>
                                <span className="text-gray-900 font-semibold">{toTitleCase(team.handler?.name || '-')}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reusable Modal */}
            <TeamFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                teamToEdit={currentItem}
                onSave={fetchTeams}
            />
        </div>
    );
}
