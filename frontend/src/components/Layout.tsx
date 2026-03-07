import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    School,
    BookOpen,
    Users,
    GraduationCap,
    FileText,
    ClipboardList,
    BarChart3,
    LogOut,
    Bell,
    Settings,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
            }`
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

const Layout: React.FC = () => {
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <GraduationCap size={24} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">Antigravity</span>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Tổng quan" />
                    <div className="py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ml-4">Quản lý</div>
                    <SidebarItem to="/admin/schools" icon={School} label="Trường học" />
                    <SidebarItem to="/admin/subjects" icon={BookOpen} label="Môn học" />
                    <SidebarItem to="/admin/classes" icon={Users} label="Lớp học" />
                    <SidebarItem to="/admin/teachers" icon={ClipboardList} label="Giáo viên" />
                    <SidebarItem to="/admin/students" icon={GraduationCap} label="Học sinh" />

                    <div className="py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider ml-4">Học thuật</div>
                    <SidebarItem to="/admin/question-bank" icon={FileText} label="Ngân hàng đề" />
                    <SidebarItem to="/admin/exams" icon={ClipboardList} label="Kỳ thi" />
                    <SidebarItem to="/admin/reports" icon={BarChart3} label="Báo cáo" />
                </nav>

                <div className="border-t border-slate-100 pt-6 space-y-1">
                    <SidebarItem to="/admin/settings" icon={Settings} label="Cài đặt" />
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                        <LogOut size={20} />
                        <span className="font-medium">Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-lg font-semibold text-slate-800">Quản trị hệ thống</h1>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all relative"
                            >
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                            </button>

                            <AnimatePresence>
                                {showNotifications && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-4 z-50 origin-top-right"
                                    >
                                        <NotificationCenter />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="flex items-center gap-4 pl-4 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900">Admin User</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hệ thống</p>
                            </div>
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
