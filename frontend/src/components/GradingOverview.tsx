import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ClipboardList, ChevronRight, Users, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const GradingOverview: React.FC = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchExams = async () => {
            try {
                // In a real app, we might want a specific endpoint for exams needing grading
                const response = await api.get('/exams');
                setExams(response.data);
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    const filteredExams = exams.filter(e =>
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.subjectName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Đang tải danh sách kỳ thi...</div>;

    return (
        <div className="space-y-8">
            <header>
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Học thuật & Khảo thí</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900">Trung tâm Chấm bài</h2>
                <p className="text-slate-500 font-medium mt-1">Chọn kỳ thi để xem danh sách bài nộp và thực hiện chấm điểm.</p>
            </header>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Tìm tên kỳ thi hoặc môn học..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                        <ClipboardList className="mx-auto text-slate-200 mb-4" size={48} />
                        <p className="text-slate-400 font-bold text-lg">Không tìm thấy kỳ thi nào</p>
                    </div>
                ) : filteredExams.map((exam) => (
                    <motion.div
                        key={exam.id}
                        whileHover={{ y: -5 }}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer group"
                        onClick={() => navigate(`/admin/grading-exam/${exam.id}`)}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                <ClipboardList size={24} />
                            </div>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg">
                                {exam.subjectName || 'Chung'}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-1">{exam.title}</h3>

                        <div className="flex flex-col gap-3 mt-4">
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                <Users size={16} className="text-slate-300" />
                                <span>{exam.studentCount || 0} học sinh tham gia</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                                <Clock size={16} className="text-slate-300" />
                                <span>Hết hạn: {new Date(exam.endTime).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between group">
                            <span className="text-sm font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                Vào chấm bài
                            </span>
                            <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default GradingOverview;
