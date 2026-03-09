import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Clock, Users, ChevronRight, MoreVertical, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const StatusBadge = ({ status }: { status: string }) => {
    const styles: any = {
        'Upcoming': 'bg-blue-50 text-blue-600 border-blue-100',
        'Ongoing': 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse',
        'Finished': 'bg-slate-50 text-slate-500 border-slate-100',
        'Draft': 'bg-slate-50 text-slate-500 border-slate-100',
    };

    const labels: any = {
        'Upcoming': 'Sắp diễn ra',
        'Ongoing': 'Đang diễn ra',
        'Finished': 'Đã kết thúc',
        'Draft': 'Bản nháp',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['Draft']}`}>
            {status === 'Ongoing' && <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-1.5"></span>}
            {labels[status] || status}
        </span>
    );
};

const ExamCard = ({ exam, onNavigate }: any) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col group"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Clock size={24} />
            </div>
            <button
                onClick={() => alert(`Tính năng quản lý cho đề thi #${exam.id} đang được phát triển.`)}
                className="text-slate-400 hover:text-slate-600"
            >
                <MoreVertical size={20} />
            </button>
        </div>

        <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={exam.status} />
                <span className="text-xs text-slate-400 font-medium">#{exam.id}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{exam.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{exam.subjectName} • {exam.durationMinutes} phút</p>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-50 space-y-3">
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <Calendar size={16} className="text-slate-400" />
                {new Date(exam.startTime).toLocaleDateString('vi-VN')}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
                <Users size={16} className="text-slate-400" />
                Lớp: {exam.classNames?.join(', ') || 'N/A'}
            </div>
        </div>

        <div className="mt-6">
            <button
                onClick={() => onNavigate(exam.id)}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
            >
                Xem chi tiết
                <ChevronRight size={16} />
            </button>
        </div>
    </motion.div>
);

const ExamManagement: React.FC = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const response = await api.get('/exams');
            setExams(response.data);
        } catch (error) {
            console.error("Failed to fetch exams", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleDelete = async (id: number) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa kỳ thi này?")) {
            try {
                await api.delete(`/exams/${id}`);
                fetchExams();
            } catch (error) {
                alert("Có lỗi xảy ra khi xóa kỳ thi.");
            }
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            await api.patch(`/exams/${id}/status`, { status: newStatus });
            fetchExams();
        } catch (error) {
            alert("Có lỗi xảy ra khi cập nhật trạng thái.");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Quản lý kỳ thi</h2>
                    <p className="text-slate-500 mt-1">Tạo, lên lịch và quản lý các bài kiểm tra.</p>
                </div>
                <button
                    onClick={() => navigate('create')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={20} />
                    Tạo kỳ thi mới
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-400">Đang tải danh sách kỳ thi...</div>
            ) : exams.length === 0 ? (
                <div className="py-20 text-center text-slate-400">Chưa có kỳ thi nào được tạo.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {exams.map((exam) => (
                        <div key={exam.id} className="relative group/card">
                            <ExamCard
                                exam={exam}
                                onNavigate={(id: number) => navigate(`${id}`)}
                            />
                            <div className="absolute top-4 right-12 flex gap-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleUpdateStatus(exam.id, exam.status === 'Upcoming' ? 'Ongoing' : 'Finished')}
                                    className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all border border-blue-50"
                                    title="Chuyển trạng thái"
                                >
                                    <ChevronRight size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(exam.id)}
                                    className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-lg shadow-sm hover:bg-red-600 hover:text-white transition-all border border-red-50"
                                    title="Xóa kỳ thi"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExamManagement;
