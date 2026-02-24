"use client";

import { useState, useEffect, use } from "react";
import { getTeamById } from "@/services/teamService";
import { getUsers } from "@/services/userService";
import { ChevronLeft, User as UserIcon, Building2, MapPin, Mail, Phone, ChevronDown, ChevronRight, Layers, ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TeamHierarchyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [team, setTeam] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [managerGroups, setManagerGroups] = useState<any[]>([]);
    const [managerIds, setManagerIds] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");

    const scrollToManager = (userId: string) => {
        const el = document.getElementById(`manager-${userId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            el.classList.add('ring-4', 'ring-orange-400', 'ring-offset-4');
            setTimeout(() => el.classList.remove('ring-4', 'ring-orange-400', 'ring-offset-4'), 2000);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [teamData, usersData] = await Promise.all([
                getTeamById(id),
                getUsers({ team: id, limit: 1000 })
            ]);
            setTeam(teamData);
            const employeeList = usersData.users || [];
            setUsers(employeeList);
            processHierarchyGroups(employeeList);
        } catch (error) {
            console.error("Failed to fetch hierarchy data", error);
            toast.error("Failed to load hierarchy");
        } finally {
            setLoading(false);
        }
    };

    const processHierarchyGroups = (allUsers: any[]) => {
        const userMap = new Map<string, any>();
        allUsers.forEach(u => userMap.set(u._id, u));

        // Grouping: Manager ID -> Array of Direct Reports
        const groups = new Map<string, any[]>();
        allUsers.forEach(u => {
            const managerId = u.reporting_manager?._id || u.reporting_manager;
            if (managerId && userMap.has(managerId)) {
                if (!groups.has(managerId)) groups.set(managerId, []);
                groups.get(managerId)!.push(u);
            }
        });

        // Find root managers (those who manage people but aren't managed by anyone in this team) or just top level
        const managersWithReports = Array.from(groups.keys()).map(mid => userMap.get(mid));

        // Sort managers by level
        managersWithReports.sort((a, b) => (b.designation?.level || 0) - (a.designation?.level || 0));

        const resultGroups = managersWithReports.map(manager => ({
            manager,
            reports: groups.get(manager._id)!.sort((a, b) => (b.designation?.level || 0) - (a.designation?.level || 0))
        }));

        setManagerGroups(resultGroups);
        setManagerIds(new Set(Array.from(groups.keys())));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (!team) return null;

    return (
        <div className="p-8 max-w-[1700px] mx-auto min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="mb-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-orange-600 transition-all mb-8 font-black text-[10px] tracking-[0.2em] group"
                >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    BACK TO TEAMS
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="h-1 w-20 bg-orange-600 rounded-full"></div>
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em]">Reporting Structure</span>
                        </div>
                        <h1 className="text-6xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-6">
                            {team.team_name} <span className="font-outline-2 text-transparent">VIEW</span>
                        </h1>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <Building2 size={14} className="text-orange-500" />
                                {team.department?.department_name || 'SALES DEPARTMENT'}
                            </span>
                            <span className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <MapPin size={14} className="text-orange-500" />
                                {team.zone_name || 'ZONE 1'}
                            </span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-4xl border border-gray-100 shadow-xl shadow-gray-200/50 flex items-center gap-8">
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Strength</p>
                            <p className="text-3xl font-black text-gray-900">{users.length}</p>
                        </div>
                        <div className="w-px h-10 bg-gray-100"></div>
                        <div className="text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Direct Managers</p>
                            <p className="text-3xl font-black text-orange-600">{managerGroups.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
                <div className="relative max-w-md">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or designation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Reporting Boxes */}
            <div className="space-y-16 pb-32">
                {(() => {
                    const query = searchQuery.toLowerCase().trim();
                    const filteredGroups = query
                        ? managerGroups
                            .map(group => {
                                const managerMatch = group.manager.name.toLowerCase().includes(query) || group.manager.designation?.designation_name?.toLowerCase().includes(query);
                                const matchedReports = group.reports.filter((m: any) => m.name.toLowerCase().includes(query) || m.designation?.designation_name?.toLowerCase().includes(query));
                                if (managerMatch) return group;
                                if (matchedReports.length > 0) return { ...group, reports: matchedReports };
                                return null;
                            })
                            .filter(Boolean)
                        : managerGroups;

                    return filteredGroups.length > 0 ? (
                        filteredGroups.map((group: any, index: number) => (
                            <div id={`manager-${group.manager._id}`} key={group.manager._id} className="relative animate-in fade-in slide-in-from-bottom-8 duration-700 transition-all" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Visual Label for Hierarchy Level */}
                                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-linear-to-b from-orange-400 to-transparent rounded-full opacity-50"></div>

                                <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-300/30 overflow-hidden group flex flex-col lg:flex-row">
                                    {/* LEFT: Manager Panel */}
                                    <div className="relative w-full lg:w-72 shrink-0 flex flex-col items-center justify-center p-8 overflow-hidden bg-white border-r border-gray-100">
                                        {/* Subtle Background Glow */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-[80px] -mr-32 -mt-32"></div>
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50/50 rounded-full blur-[60px] -ml-24 -mb-24"></div>

                                        <div className="relative z-10 flex flex-col items-center text-center w-full">
                                            <div className="w-20 h-20 rounded-2xl bg-white border-2 border-orange-400 shadow-xl shadow-orange-500/20 flex items-center justify-center text-2xl font-black text-gray-900 overflow-hidden mb-4">
                                                {group.manager.profile_photo ? (
                                                    <img src={group.manager.profile_photo} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    group.manager.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <span className="bg-orange-600 text-[8px] font-black text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/30 mb-2">
                                                {group.manager.designation?.designation_name || 'MANAGER'}
                                            </span>
                                            <span className="text-orange-500 font-bold text-[9px] uppercase tracking-[0.2em] mb-3">Level {group.manager.designation?.level || 12}</span>
                                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-3 leading-tight">
                                                {group.manager.name}
                                            </h2>
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">
                                                {group.reports.length} DIRECT REPORTS
                                            </p>
                                            <div className="flex gap-2">
                                                <a href={`tel:${group.manager.phone}`} className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                                                    <Phone size={14} />
                                                </a>
                                                <a href={`mailto:${group.manager.email}`} className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all">
                                                    <Mail size={14} />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT: Direct Reporting Grid */}
                                    <div className="flex-1 p-6 bg-gray-50/30">
                                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4">
                                            {group.reports.map((member: any) => {
                                                const isManager = managerIds.has(member._id);
                                                return (
                                                    <div
                                                        key={member._id}
                                                        onClick={isManager ? () => scrollToManager(member._id) : undefined}
                                                        className={`bg-white border border-orange-200 rounded-2xl p-5 hover:border-orange-400 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 relative group/member ${isManager ? 'cursor-pointer' : ''}`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            {/* Left: Avatar */}
                                                            <div className="w-14 h-14 rounded-xl bg-white border-2 border-orange-400 shadow-md flex items-center justify-center text-lg font-black text-gray-900 overflow-hidden shrink-0 group-hover/member:scale-110 transition-all duration-500">
                                                                {member.profile_photo ? (
                                                                    <img src={member.profile_photo} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    member.name.charAt(0).toUpperCase()
                                                                )}
                                                            </div>

                                                            {/* Right: Info + Buttons */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-tight line-clamp-1 mb-1 group-hover/member:text-orange-600 transition-colors">
                                                                    {member.name}
                                                                </h3>
                                                                <p className="text-[7px] font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded-full inline-block mb-2">
                                                                    {member.designation?.designation_name || 'STAFF'}
                                                                </p>
                                                                <div className="flex gap-1.5">
                                                                    <a href={`tel:${member.phone}`} className="py-1.5 px-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                                        <Phone size={10} />
                                                                        <span className="text-[7px] font-black uppercase">Call</span>
                                                                    </a>
                                                                    <a href={`https://wa.me/91${member.phone}`} target="_blank" className="py-1.5 px-3 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.065-1.098L7.5 18.68l-2.18.578.578-2.18-.222-.435A8 8 0 1112 20z" /></svg>
                                                                        <span className="text-[7px] font-black uppercase">WhatsApp</span>
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Clickable badge for managers */}
                                                        {isManager && (
                                                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[6px] font-black px-2 py-0.5 rounded-full uppercase shadow-lg flex items-center gap-0.5 whitespace-nowrap">
                                                                <ArrowRight size={6} />
                                                                VIEW TEAM
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[4rem] border-4 border-dashed border-gray-100">
                            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-8">
                                <Layers size={48} className="text-gray-200" />
                            </div>
                            <h2 className="text-2xl font-black text-gray-300 uppercase tracking-[0.5em]">{searchQuery ? 'No Results Found' : 'No Hierarchy Mapped'}</h2>
                        </div>
                    );
                })()}
            </div>

            <style jsx global>{`
                .font-outline-2 {
                    -webkit-text-stroke: 1.5px #111827;
                }
            `}</style>
        </div>
    );
}
