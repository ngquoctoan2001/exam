import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const StudentExams: React.FC = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get('/exams/available');
                setExams(response.data);
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Kỳ thi của tôi</h2>
                    <p className="text-slate-500 mt-2 text-lg">
                        {exams.length > 0
                            ? `Chào bạn, hôm nay bạn có ${exams.length} bài thi cần hoàn thành.`
                            : "Hiện tại bạn không có kỳ thi nào diễn ra."}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="py-20 text-center text-slate-400">Đang tải danh sách kỳ thi...</div>
            ) : exams.length === 0 ? (
                <div className="py-20 text-center text-slate-400">Chưa có kỳ thi nào dành cho bạn.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {exams.map((exam) => (
                        <motion.div
                            key={exam.id}
                            whileHover={{ y: -8 }}
                            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 group transition-all"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <BookOpen size={32} />
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${exam.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                    }`}>
                                    {exam.status === 'Ongoing' ? 'Đang diễn ra' : 'Sắp diễn ra'}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">{exam.title}</h3>
                            <p className="text-slate-500 font-medium mb-8">{exam.subjectName}</p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-4 text-slate-600 font-medium">
                                    <Clock size={20} className="text-slate-400" />
                                    {exam.durationMinutes} phút
                                </div>
                                <div className="flex items-center gap-4 text-slate-600 font-medium">
                                    <Calendar size={20} className="text-slate-400" />
                                    {new Date(exam.startTime).toLocaleDateString('vi-VN')} • {new Date(exam.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <button
                                onClick={() => navigate(`/exam/${exam.id}`)}
                                disabled={exam.status !== 'Ongoing'}
                                className={`w-full py-4 rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${exam.status === 'Ongoing'
                                        ? 'bg-slate-900 hover:bg-blue-600 text-white'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <PlayCircle size={22} />
                                {exam.status === 'Ongoing' ? 'Bắt đầu làm bài' : 'Chưa đến giờ'}
                            </button>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StudentExams;
