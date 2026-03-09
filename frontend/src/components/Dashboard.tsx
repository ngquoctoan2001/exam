import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, ClipboardList, CheckCircle2, TrendingUp, ArrowUpRight, BarChart3 } from 'lucide-react';
import api from '../services/api';

const StatCard = ({ label, value, icon: Icon, trend, color }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${color} bg-opacity-10 ${color.replace('bg-', 'text-')}`}>
                <Icon size={24} />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-emerald-600 font-medium text-sm">
                    <TrendingUp size={16} />
                    {trend}%
                </div>
            )}
        </div>
        <p className="text-slate-500 text-sm font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </motion.div>
);

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Assuming an endpoint exists or we fetch from multiple
                const response = await api.get('/reports/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Đang tải số liệu...</div>;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-900">Chào buổi sáng, {stats?.userName || 'Admin'}!</h2>
                <p className="text-slate-500 mt-1">Chào mừng bạn trở lại với hệ thống thi Antigravity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Tổng giáo viên" value={stats?.totalTeachers || 0} icon={Users} color="bg-blue-600" />
                <StatCard label="Tổng học sinh" value={stats?.totalStudents || 0} icon={GraduationCap} color="bg-indigo-600" />
                <StatCard label="Kỳ thi đang diễn ra" value={stats?.ongoingExams || 0} icon={ClipboardList} color="bg-amber-500" />
                <StatCard label="Tỷ lệ hoàn thành" value={`${stats?.completionRate || 0}%`} icon={CheckCircle2} color="bg-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Kỳ thi sắp tới</h3>
                        <button className="text-sm text-blue-600 font-medium flex items-center gap-1">
                            Xem tất cả <ArrowUpRight size={14} />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {stats?.upcomingExams?.length > 0 ? (
                            stats.upcomingExams.map((exam: any) => (
                                <div key={exam.id} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                        {exam.title.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-slate-900 truncate">{exam.title}</p>
                                        <p className="text-xs text-slate-500">{exam.subjectName} • {new Date(exam.startTime).toLocaleDateString('vi-VN')}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center py-8">Không có kỳ thi nào sắp tới.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                            <BarChart3 size={32} />
                        </div>
                        <h3 className="font-bold text-slate-800">Báo cáo hiệu năng</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-[200px] mx-auto">Số liệu thống kê đang được xử lý.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
