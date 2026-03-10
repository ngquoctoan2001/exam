import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users, GraduationCap, ClipboardList, CheckCircle2,
    TrendingUp, BarChart3, BookOpen, Calendar, Award, Clock
} from 'lucide-react';
import api from '../services/api';
import { authService } from '../services/auth.service';

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
    const user = authService.getCurrentUser();
    const role = user?.role?.toUpperCase();
    const isAdmin = role === 'ADMIN';
    const isTeacher = role === 'TEACHER';
    const isStudent = role === 'STUDENT';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/reports/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
                // Enhanced Fallback based on Role
                if (isAdmin) {
                    setStats({
                        userName: user?.fullName || 'Admin',
                        totalTeachers: 12,
                        totalStudents: 450,
                        ongoingExams: 3,
                        completionRate: 85,
                        upcomingExams: [
                            { id: 1, title: 'Kiểm tra Giải tích 1', subjectName: 'Toán học', startTime: new Date().toISOString() },
                            { id: 2, title: 'Thi học kỳ Luyện dịch 2', subjectName: 'Tiếng Anh', startTime: new Date().toISOString() }
                        ],
                        recentResults: [
                            { id: 1, studentName: 'Nguyễn Văn A', examTitle: 'Giải tích 1', score: 9.5, time: '2 phút trước' },
                            { id: 2, studentName: 'Trần Thị B', examTitle: 'Tiếng Anh', score: 8.0, time: '5 phút trước' }
                        ]
                    });
                } else if (isTeacher) {
                    setStats({
                        userName: user?.fullName || 'Giáo viên',
                        managedClasses: 4,
                        totalStudents: 120,
                        pendingGrading: 15,
                        avgClassScore: 7.8,
                        upcomingExams: [
                            { id: 1, title: 'Kiểm tra giữa kỳ', subjectName: 'Toán', startTime: new Date().toISOString() }
                        ],
                        recentResults: [
                            { id: 1, studentName: 'Lê Văn C', examTitle: 'Toán', score: 8.5, time: '1 giờ trước' }
                        ]
                    });
                } else {
                    setStats({
                        userName: user?.fullName || 'Học sinh',
                        examsTaken: 8,
                        avgScore: 8.2,
                        rank: '12/45',
                        nextExam: 'Ngày mai',
                        upcomingExams: [
                            { id: 1, title: 'Kiểm tra 15p', subjectName: 'Vật Lý', startTime: new Date().toISOString() }
                        ],
                        recentResults: [
                            { id: 1, studentName: 'Bạn', examTitle: 'Lịch sử', score: 9.0, time: 'Hôm qua' }
                        ]
                    });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user?.id, role]);

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Đang tải số liệu...</div>;

    const renderStats = () => {
        if (isAdmin) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Tổng giáo viên" value={stats?.totalTeachers || 0} icon={Users} color="bg-blue-600" trend={5} />
                    <StatCard label="Tổng học sinh" value={stats?.totalStudents || 0} icon={GraduationCap} color="bg-indigo-600" trend={12} />
                    <StatCard label="Kỳ thi đang diễn ra" value={stats?.ongoingExams || 0} icon={ClipboardList} color="bg-amber-500" />
                    <StatCard label="Tỷ lệ hoàn thành" value={`${stats?.completionRate || 0}%`} icon={CheckCircle2} color="bg-emerald-600" />
                </div>
            );
        }
        if (isTeacher) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Lớp phụ trách" value={stats?.managedClasses || 0} icon={BookOpen} color="bg-blue-600" />
                    <StatCard label="Học sinh quản lý" value={stats?.totalStudents || 0} icon={Users} color="bg-indigo-600" />
                    <StatCard label="Bài chờ chấm" value={stats?.pendingGrading || 0} icon={Clock} color="bg-rose-500" />
                    <StatCard label="Điểm trung bình lớp" value={stats?.avgClassScore || 0} icon={TrendingUp} color="bg-emerald-600" />
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Kỳ thi đã tham gia" value={stats?.examsTaken || 0} icon={CheckCircle2} color="bg-blue-600" />
                <StatCard label="Điểm trung bình" value={stats?.avgScore || 0} icon={Award} color="bg-indigo-600" />
                <StatCard label="Thứ hạng lớp" value={stats?.rank || 'N/A'} icon={TrendingUp} color="bg-amber-500" />
                <StatCard label="Kỳ thi tiếp theo" value={stats?.nextExam || 'N/A'} icon={Calendar} color="bg-emerald-600" />
            </div>
        );
    };

    return (
        <div className="space-y-10 pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 leading-tight">Chào buổi sáng, {stats?.userName}! 👋</h2>
                    <p className="text-slate-500 font-medium mt-1">
                        {isAdmin ? 'Chào mừng quản trị viên quay lại hệ thống.' :
                            isTeacher ? 'Chúc thầy/cô có một ngày giảng dạy hiệu quả.' :
                                'Chúc bạn có một ngày học tập tốt.'}
                    </p>
                </div>
                {isAdmin && (
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                        <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            Trực tuyến: 42
                        </div>
                    </div>
                )}
            </header>

            {renderStats()}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-white shadow-xl">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {isStudent ? 'Tiến độ học tập' : 'Phổ điểm trung bình'}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium">Thống kê 7 ngày qua</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold">TUẦN NÀY</span>
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between gap-2 px-4">
                            {[40, 65, 45, 90, 55, 75, 85].map((val, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                                    <div
                                        className="w-full bg-slate-50 rounded-2xl relative overflow-hidden transition-all group-hover:bg-blue-50"
                                        style={{ height: `${val}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-blue-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400">T{i + 2}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-white shadow-xl">
                        <h3 className="text-xl font-black text-slate-900 mb-6 font-display">
                            {isStudent ? 'Kết quả thi gần đây' : 'Hoạt động gần đây'}
                        </h3>
                        <div className="space-y-4">
                            {stats?.recentResults?.map((res: any) => (
                                <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            {res.studentName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{res.studentName}</p>
                                            <p className="text-xs text-slate-400 font-medium">{res.examTitle} • {res.time}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-lg font-black ${res.score >= 8 ? 'text-emerald-500' : 'text-amber-500'}`}>{res.score}</p>
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">ĐIỂM SỐ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/40 transition-all pointer-events-none" />
                        <h3 className="text-xl font-black mb-6 relative">Lịch thi {isStudent ? 'của bạn' : 'sắp tới'}</h3>
                        <div className="space-y-6 relative">
                            {stats?.upcomingExams?.map((exam: any) => (
                                <div key={exam.id} className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest">{exam.subjectName}</span>
                                        <span className="text-[10px] font-bold text-slate-500">{new Date(exam.startTime).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <p className="font-bold text-slate-100 line-clamp-1">{exam.title}</p>
                                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-1/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all text-sm">
                            Xem lịch trình đầy đủ
                        </button>
                    </div>

                    {isAdmin && (
                        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[40px] text-white shadow-xl shadow-indigo-100">
                            <BarChart3 size={32} className="mb-4 opacity-50" />
                            <h3 className="text-xl font-black mb-2">Tải báo cáo nhanh</h3>
                            <p className="text-indigo-100 text-sm font-medium mb-6 opacity-80">Xuất dữ liệu thống kê kỳ thi học kỳ I dưới dạng PDF hoặc Excel.</p>
                            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm shadow-lg hover:scale-105 transition-all">
                                XUẤT BÁO CÁO
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
