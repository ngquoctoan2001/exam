import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const StudentExams: React.FC = () => {
    const navigate = useNavigate();

    const exams = [
        { id: 1, title: 'Kiểm tra Học kỳ I - Môn Toán', subject: 'Toán học', duration: 60, startTime: '2026-03-15T08:30:00', status: 'Sắp diễn ra' },
        { id: 2, title: 'Kiểm tra 15 phút - Bài số 2 - Ngữ văn 11', subject: 'Ngữ văn', duration: 15, startTime: '2026-03-07T14:00:00', status: 'Sắp diễn ra' },
    ];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Kỳ thi của tôi</h2>
                    <p className="text-slate-500 mt-2 text-lg">Chào bạn, hôm nay bạn có 2 bài thi cần hoàn thành.</p>
                </div>
            </div>

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
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">{exam.status}</span>
                        </div>

                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-2">{exam.title}</h3>
                        <p className="text-slate-500 font-medium mb-8">{exam.subject}</p>

                        <div className="space-y-4 mb-10">
                            <div className="flex items-center gap-4 text-slate-600 font-medium">
                                <Clock size={20} className="text-slate-400" />
                                {exam.duration} phút
                            </div>
                            <div className="flex items-center gap-4 text-slate-600 font-medium">
                                <Calendar size={20} className="text-slate-400" />
                                {new Date(exam.startTime).toLocaleDateString('vi-VN')} • {new Date(exam.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>

                        <button
                            onClick={() => navigate(`/exam/${exam.id}`)}
                            className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-3xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
                        >
                            <PlayCircle size={22} />
                            Bắt đầu làm bài
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default StudentExams;
