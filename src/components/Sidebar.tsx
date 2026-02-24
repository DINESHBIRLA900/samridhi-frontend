"use client";

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
    Home, Settings, LogOut, Package, ShoppingCart, Users, ChevronDown, ChevronRight,
    List, Briefcase, UserCheck, Shield, Layers, RotateCcw, XCircle, CheckCircle,
    SlidersHorizontal, ArrowRightLeft, AlertTriangle, CalendarX, Wrench, UserPlus,
    ShoppingBag, LayoutGrid, Tags, Building2, Scale, FileText, Warehouse, Grid,
    MapPin, History, CreditCard, UserCog, Truck, Receipt, Store, Activity,
    ClipboardList, FolderKanban, PlayCircle, Landmark, BookOpen, HandCoins, Percent,
    Wallet, Award, Banknote, Factory, Box, Link as LinkIcon, CalendarRange, ScanEye,
    Trash2, Handshake, FileSignature, ShieldAlert, PackagePlus, FilePlus, BarChart,
    TrendingUp, Scroll, Cuboid, Cog, PackageCheck, Barcode, AlertOctagon, Clock,
    Headset, Lightbulb, Phone, Ticket, MessageSquareWarning, CalendarClock, Megaphone,
    Target, PieChart, MessageSquare, ClipboardCheck, ShieldCheck, Star, ReceiptText,
    Lock, AlertCircle, LineChart, Bell, GitBranch, Map, GitMerge, Settings2,
    DatabaseBackup, Key, HeartPulse, Blocks, Mail, MessageCircle, Globe, Menu, X,
    LayoutDashboard, FileDigit, Grip
} from 'lucide-react';

// Define MenuItem Interface
interface MenuItem {
    title: string;
    icon: any; // LucideIcon type is tricky to import directly sometimes, using any for simplicity or React.FC<any>
    href?: string;
    submenu?: MenuItem[];
    isOpen?: boolean; // For initial state if needed, though we track it in component
}

// Menu Configuration
const menuItems: MenuItem[] = [
    {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard"
    },
    {
        title: "User Manage",
        icon: Users,
        submenu: [
            { title: "Employee List", icon: List, href: "/user-manage/employee-list" }
        ]
    },
    {
        title: "Company Structure",
        icon: Building2,
        submenu: [
            { title: "Department", icon: Layers, href: "/company-structure/department" },
            { title: "Job Type", icon: Briefcase, href: "/company-structure/job-type" },
            { title: "Employee Category", icon: Users, href: "/company-structure/employee-category" },
            { title: "Access Permission", icon: Shield, href: "/company-structure/access-permission" },
            { title: "Team Structure", icon: Users, href: "/company-structure/team-structure" }
        ]
    },
    {
        title: "Business Partners",
        icon: Handshake,
        submenu: [
            { title: "Vendor List", icon: Store, href: "/business-partners/vendor-list" },
            { title: "Dealer List", icon: Building2, href: "/business-partners/customer-b2b-list" },
            { title: "Farmer List", icon: Users, href: "/business-partners/customer-list" },
            { title: "Supplier List", icon: Truck, href: "/business-partners/supplier-list" }
        ]
    },
    {
        title: "Product Manage",
        icon: ShoppingBag,
        submenu: [
            { title: "Product List", icon: List, href: "/products/list" },
            { title: "Category", icon: LayoutGrid, href: "/products/category" },
            { title: "Technical List", icon: ClipboardList, href: "/products/technical" },
            { title: "Packing", icon: Box, href: "/products/packing" },
            { title: "Unit Master", icon: Scale, href: "/products/unit" },
            { title: "HSN Code", icon: FileText, href: "/products/hsn" }
        ]
    },
    {
        title: "Purchase Manage",
        icon: CreditCard,
        submenu: [
            { title: "Purchase Request", icon: FilePlus, href: "/purchase/request" },
            { title: "Purchase Order", icon: FileText, href: "/purchase/order" },
            { title: "Goods Receipt Note", icon: Truck, href: "/purchase/grn" },


            { title: "Purchase Reports", icon: BarChart, href: "/purchase/reports" }
        ]
    },
    {
        title: "Sales Manage",
        icon: ShoppingCart,
        submenu: [
            { title: "Sales Order", icon: List, href: "/orders/list" },

            { title: "Sales Cancel", icon: XCircle, href: "/orders/cancel" },
            { title: "Material Delivered", icon: CheckCircle, href: "/orders/delivered" }
        ]
    },
    {
        title: "Service Manage",
        icon: Wrench,
        submenu: [
            { title: "Service Requests", icon: MessageSquare, href: "/service/requests" },
            { title: "Engineer Assign", icon: UserCog, href: "/service/assign-engineer" },
            { title: "Visit Schedule", icon: CalendarClock, href: "/service/schedule" },
            { title: "Completion Report", icon: ClipboardCheck, href: "/service/completion-report" },
            { title: "Warranty", icon: ShieldCheck, href: "/service/warranty" },
            { title: "AMC", icon: FileSignature, href: "/service/amc" },
            { title: "Customer Feedback", icon: Star, href: "/service/feedback" },
            { title: "Service Bill", icon: ReceiptText, href: "/service/bill" }
        ]
    },
    {
        title: "Project Manage",
        icon: FolderKanban,
        submenu: [
            { title: "Project Order", icon: FileText, href: "/project/order" },
            { title: "Project Processing", icon: PlayCircle, href: "/project/processing" },
            { title: "Project Complete", icon: CheckCircle, href: "/project/complete" },
            { title: "Project Cancel", icon: XCircle, href: "/project/cancel" }
        ]
    },
    {
        title: "Accounts & Finance",
        icon: Landmark,
        submenu: [
            { title: "Chart of Accounts", icon: BookOpen, href: "/accounts-finance/chart-of-accounts" },
            { title: "Billing / Invoicing", icon: Receipt, href: "/accounts-finance/billing-invoicing" },
            { title: "GST / Tax Management", icon: Percent, href: "/accounts-finance/gst-tax-management" },
            { title: "Expense Management", icon: Wallet, href: "/accounts-finance/expense-management" },
            { title: "Payroll Processing", icon: Banknote, href: "/accounts-finance/payroll-processing" },
            { title: "Incentive Processing", icon: Award, href: "/accounts-finance/incentive-processing" },
            { title: "Commission Settlement", icon: Percent, href: "/accounts-finance/commission-settlement" },
            { title: "Bank Accounts", icon: CreditCard, href: "/accounts-finance/bank-accounts" }
        ]
    },
    {
        title: "Production Manage",
        icon: Factory,
        submenu: [
            { title: "Product Master", icon: Box, href: "/production/product-master" },
            { title: "Raw Material Mapping", icon: LinkIcon, href: "/production/raw-material-mapping" },
            { title: "Production Planning", icon: CalendarRange, href: "/production/planning" },
            { title: "Work Orders", icon: ClipboardList, href: "/production/work-orders" },
            { title: "Quality Control", icon: ScanEye, href: "/production/quality-control" },
            { title: "Finished Goods", icon: Box, href: "/production/finished-goods" },
            { title: "Wastage", icon: Trash2, href: "/production/wastage" },
            { title: "Rejection", icon: XCircle, href: "/production/rejection" }
        ]
    },
    {
        title: "Stock & Warehouse",
        icon: Package,
        submenu: [
            { title: "Stock Overview", icon: Layers, href: "/inventory/stock-overview" },
            { title: "Warehouse List", icon: List, href: "/inventory/warehouse-list" },
            { title: "Stock Adjustment", icon: SlidersHorizontal, href: "/inventory/adjustment" },
            { title: "Assign Stock", icon: UserPlus, href: "/inventory/assign" },
            { title: "Damaged & Scrap", icon: AlertTriangle, href: "/inventory/damaged-scrap" },
            { title: "Expired Stock", icon: CalendarX, href: "/inventory/expired" },
            { title: "Repairing Stock", icon: Wrench, href: "/inventory/repairing" }
        ]
    },

    {
        title: "HR Management",
        icon: UserCog,
        submenu: [
            { title: "Recruitment", icon: UserPlus, href: "/hr/recruitment" },
            { title: "Onboarding", icon: UserCheck, href: "/hr/onboarding" },
            { title: "Attendance", icon: Clock, href: "/hr/attendance" },
            { title: "Work Approval", icon: ClipboardCheck, href: "/hr/work-reports" },
            { title: "Leave Management", icon: CalendarX, href: "/hr/leave" },
            { title: "Shift Roster", icon: CalendarClock, href: "/hr/shift-roster" },
            { title: "Holidays", icon: CalendarRange, href: "/hr/holidays" },
            { title: "Employee Documents", icon: FileText, href: "/hr/documents" },
            { title: "Appraisal", icon: Award, href: "/hr/appraisal" },
            { title: "Performance", icon: TrendingUp, href: "/hr/performance" },
            { title: "Policies & Rules", icon: Scroll, href: "/hr/policies" }
        ]
    },
    {
        title: "Factory Inventory",
        icon: Warehouse,
        submenu: [
            { title: "Raw Material Stock", icon: Layers, href: "/factory-inventory/raw-material" },
            { title: "Semi Finished Goods", icon: Cog, href: "/factory-inventory/semi-finished" },
            { title: "Finished Goods", icon: PackageCheck, href: "/factory-inventory/finished" },
            { title: "Transfer Stock", icon: ArrowRightLeft, href: "/factory-inventory/transfer" },
            { title: "Batch / Lot Tracking", icon: Barcode, href: "/factory-inventory/batch-tracking" },
            { title: "Minimum Stock Alerts", icon: AlertTriangle, href: "/factory-inventory/min-stock-alerts" },
            { title: "Damage", icon: AlertOctagon, href: "/factory-inventory/damage" },
            { title: "Expiry", icon: Clock, href: "/factory-inventory/expiry" }
        ]
    },
    {
        title: "CRM & Call Center",
        icon: Headset,
        submenu: [
            { title: "Leads", icon: UserPlus, href: "/crm/leads" },
            { title: "Customers", icon: Users, href: "/crm/customers" },
            { title: "Opportunities", icon: Lightbulb, href: "/crm/opportunities" },
            { title: "Deals", icon: Handshake, href: "/crm/deals" },
            { title: "Calls", icon: Phone, href: "/crm/calls" },
            { title: "Tickets", icon: Ticket, href: "/crm/tickets" },
            { title: "Complaints", icon: MessageSquareWarning, href: "/crm/complaints" },
            { title: "Follow-ups", icon: CalendarClock, href: "/crm/follow-ups" },
            { title: "Campaigns", icon: Megaphone, href: "/crm/campaigns" },
            { title: "Marketing", icon: Target, href: "/crm/marketing" },
            { title: "Shift Management", icon: Clock, href: "/crm/shift-management" },
            { title: "Reports", icon: PieChart, href: "/crm/reports" }
        ]
    },
    {
        title: "Legal & Compliance",
        icon: Scale,
        submenu: [
            { title: "Company Licenses", icon: Award, href: "/legal/licenses" },
            { title: "Contracts & Agreements", icon: FileSignature, href: "/legal/agreements" },
            { title: "NDA", icon: Lock, href: "/legal/nda" },
            { title: "IP Protection", icon: ShieldCheck, href: "/legal/ip-protection" },
            { title: "Compliance Documents", icon: ClipboardCheck, href: "/legal/compliance" },
            { title: "Legal Notices", icon: AlertCircle, href: "/legal/notices" }
        ]
    },
    {
        title: "Asset Management",
        icon: Landmark,
        submenu: [
            { title: "Fixed Assets", icon: Building2, href: "/assets/fixed-assets" },
            { title: "Maintenance", icon: Wrench, href: "/assets/maintenance" },
            { title: "Depreciation", icon: TrendingUp, href: "/assets/depreciation" }
        ]
    },
    {
        title: "Transport & Fleet",
        icon: Truck,
        submenu: [
            { title: "Vehicle Master", icon: Truck, href: "/fleet/vehicles" },
            { title: "Fuel & Maintenance", icon: Wrench, href: "/fleet/maintenance" },
            { title: "Trip Logs", icon: MapPin, href: "/fleet/trips" }
        ]
    },
    {
        title: "Knowledge Base",
        icon: BookOpen,
        submenu: [
            { title: "Work Instructions", icon: FileText, href: "/knowledge/work-instructions" },
            { title: "Training Material", icon: PlayCircle, href: "/knowledge/training" },
            { title: "Policy Docs", icon: Shield, href: "/knowledge/policies" }
        ]
    },
    {
        title: "Reports & Analytics",
        icon: LineChart,
        submenu: [
            { title: "Sales Reports", icon: BarChart, href: "/reports/sales" },
            { title: "Purchase Reports", icon: ShoppingBag, href: "/reports/purchase" },
            { title: "Inventory Reports", icon: Warehouse, href: "/reports/inventory" },
            { title: "Production Reports", icon: Factory, href: "/reports/production" },
            { title: "CRM Reports", icon: Users, href: "/reports/crm" },
            { title: "Call Center Reports", icon: Headset, href: "/reports/call-center" },
            { title: "Service Reports", icon: Wrench, href: "/reports/service" },
            { title: "Payroll", icon: Banknote, href: "/reports/payroll" },
            { title: "Commission Reports", icon: Percent, href: "/reports/commission" },
            { title: "Profit & Loss", icon: TrendingUp, href: "/reports/profit-loss" },
            { title: "Login Activity", icon: Activity, href: "/reports/login-activity" },
            { title: "Audit Log", icon: ClipboardList, href: "/reports/audit-log" }
        ]
    },

    {
        title: "Security & Backup",
        icon: ShieldAlert,
        submenu: [
            { title: "Role Permission Control", icon: UserCheck, href: "/security/role-permission" },
            { title: "Data Backup", icon: DatabaseBackup, href: "/security/backup" },
            { title: "Activity Logs", icon: Activity, href: "/security/logs" },
            { title: "API Keys", icon: Key, href: "/security/api-keys" },
            { title: "System Health", icon: HeartPulse, href: "/security/health" }
        ]
    },
    {
        title: "Integrations",
        icon: Blocks,
        submenu: [
            { title: "Payment Gateway", icon: CreditCard, href: "/integrations/payment" },
            { title: "SMS / Email", icon: Mail, href: "/integrations/sms-email" },
            { title: "WhatsApp API", icon: MessageCircle, href: "/integrations/whatsapp" },
            { title: "Accounting Software", icon: BookOpen, href: "/integrations/accounting" },
            { title: "External ERP / Tools", icon: Globe, href: "/integrations/external-erp" }
        ]
    },

    {
        title: "System Settings",
        icon: Settings,
        submenu: [
            { title: "Company Profile", icon: Building2, href: "/settings/company-profile" },
            { title: "Branch", icon: GitBranch, href: "/settings/branch" },
            { title: "Location Setup", icon: Map, href: "/settings/location" },
            { title: "Financial Year", icon: CalendarRange, href: "/settings/financial-year" },
            { title: "Tax Settings", icon: Receipt, href: "/settings/tax" },
            { title: "Workflow Configuration", icon: GitMerge, href: "/settings/workflow" },
            { title: "Notification Settings", icon: Bell, href: "/settings/notifications" }
        ]
    },
    {
        title: "Advertisement",
        icon: Megaphone,
        submenu: [
            { title: "Card", icon: CreditCard, href: "/advertisement/card" },
            { title: "Poster", icon: FileText, href: "/advertisement/poster" },
            { title: "Video", icon: PlayCircle, href: "/advertisement/video" },
            { title: "Slider Card", icon: Layers, href: "/advertisement/slider-card" }
        ]
    },
    {
        title: "Work Head",
        icon: ClipboardCheck,
        submenu: [
            { title: "Visit", icon: MapPin, href: "/work-head/visit" },
            { title: "Demo", icon: PlayCircle, href: "/work-head/demo" },
            { title: "Recruitment", icon: UserPlus, href: "/work-head/recruitment" },
            { title: "Meeting", icon: Users, href: "/work-head/meeting" }
        ]
    },


];

// Recursive Sidebar Item Component
const SidebarItem = ({ item }: { item: MenuItem }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Check if any child is active
    const isActive = item.href ? pathname === item.href :
        item.submenu?.some(sub => sub.href === pathname || sub.submenu?.some(subsub => subsub.href === pathname));

    useEffect(() => {
        if (isActive) {
            setIsOpen(true);
        }
    }, [isActive]);

    const toggleOpen = () => setIsOpen(!isOpen);

    // If item has a link and no submenu, render simple link
    if (!item.submenu) {
        return (
            <li>
                <div
                    className="flex flex-col"
                >
                    {item.href ? (
                        <Link
                            href={item.href}
                            scroll={false}
                            onClick={(e) => {
                                // Prevent auto-scroll on focus
                                e.currentTarget.blur();
                            }}
                            className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all hover:bg-orange-50 hover:text-orange-600 hover:shadow-md ${isActive ? 'bg-orange-100 text-orange-600 font-semibold shadow-md' : 'text-gray-700'}`}
                        >
                            {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    ) : (
                        <button
                            className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all hover:bg-orange-50 hover:text-orange-600 hover:shadow-md text-gray-700 cursor-default`}
                        >
                            {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                            <span className="font-medium">{item.title}</span>
                        </button>
                    )}
                </div>
            </li>
        );
    }

    // If item has submenu, render button and recursive list
    return (
        <li>
            <button
                onClick={toggleOpen}
                className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 transition-all hover:bg-orange-50 hover:text-orange-600 hover:shadow-md ${isActive ? 'bg-orange-50 text-orange-600' : 'text-gray-700'}`}
            >
                <div className="flex items-center gap-4">
                    {item.icon && <item.icon className="h-5 w-5 shrink-0" />}
                    <span className="font-medium">{item.title}</span>
                </div>
                {isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
            </button>

            {isOpen && item.submenu && (
                <ul className="mt-2 space-y-1 pl-4 border-l border-gray-200 ml-2">
                    {item.submenu.map((subItem, index) => (
                        <SidebarItem key={index} item={subItem} />
                    ))}
                </ul>
            )}
        </li>
    );
};

const Sidebar = () => {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const navRef = useRef<HTMLElement>(null);
    const scrollPosRef = useRef(0);

    // Preserve scroll position before route change
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const handleScroll = () => {
            scrollPosRef.current = nav.scrollTop;
        };

        nav.addEventListener('scroll', handleScroll);
        return () => nav.removeEventListener('scroll', handleScroll);
    }, []);

    // Restore scroll position after route change - AGGRESSIVE approach
    useEffect(() => {
        const nav = navRef.current;
        if (!nav) return;

        const savedPosition = scrollPosRef.current;

        // Immediately restore
        nav.scrollTop = savedPosition;

        // Restore multiple times - Next.js resets scroll between 100-500ms
        const timers: number[] = [];
        [0, 10, 50, 100, 150, 200, 300, 400, 500, 600, 800].forEach(delay => {
            const timer = window.setTimeout(() => {
                if (nav) nav.scrollTop = savedPosition;
            }, delay);
            timers.push(timer);
        });

        return () => {
            timers.forEach(timer => clearTimeout(timer));
        };
    }, [pathname]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="fixed left-4 top-4 z-50 rounded-lg bg-orange-500 p-2 text-white shadow-lg md:hidden"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <aside className={`fixed left-0 top-0 z-50 h-screen w-72 border-r border-gray-200 bg-white text-black flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo Section */}
                <div className="flex h-20 items-center justify-center border-b border-gray-200 bg-orange-500 shrink-0">
                    <h1 className="text-3xl font-extrabold tracking-widest text-white drop-shadow-lg">
                        Samridhdhi
                    </h1>
                </div>

                {/* Navigation (Scrollable) */}
                <nav ref={navRef} className="flex-1 px-4 py-6 overflow-y-auto [&::-webkit-scrollbar]:w-0.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400 transition-all [overflow-anchor:none]" style={{ scrollBehavior: 'auto' }}>
                    <ul className="space-y-4">
                        {menuItems.map((item, index) => (
                            <SidebarItem key={index} item={item} />
                        ))}
                    </ul>
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0">
                    <button className="flex w-full items-center gap-4 rounded-xl bg-red-500/10 px-4 py-3 text-red-600 transition-all hover:bg-red-500/20 hover:text-red-700">
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
