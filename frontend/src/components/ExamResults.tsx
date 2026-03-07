import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Trophy,
    CheckCircle,
    XCircle,
    ChevronLeft,
    Clock,
    BarChart3,
    Calendar,
    MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const ExamResults: React.FC = () => {
    const { attemptId: _attemptId } = useParams<{ attemptId: string }>();
    const navigate = useNavigate();

    // Mock data for result
    const result = {
        examTitle: 'Kiểm tra Học kỳ I - Môn Toán',
        totalScore: 8.5,
        maxScore: 10,
        completedAt: '2026-03-07 11:30',
        durationMinutes: 45,
        questions: [
            { id: 1, content: 'Câu hỏi 1: MCQ...', earnedScore: 1.0, maxScore: 1.0, isCorrect: true, comment: 'Đúng!' },
            { id: 2, content: 'Câu hỏi 2: Essay...', earnedScore: 1.5, maxScore: 2.0, isCorrect: null, comment: 'Phân tích tốt, cần thêm ý về nghệ thuật.' },
            { id: 3, content: 'Câu hỏi 3: MCQ...', earnedScore: 0, maxScore: 1.0, isCorrect: false, comment: 'Sai kiến thức cơ bản.' }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <header className="bg-white border-b border-slate-200 py-6 px-12 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/student/exams')} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-colors">
                        <ChevronLeft size={20} />
                        Quay lại
                    </button>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-wider">Kết quả bài thi</h1>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-12 space-y-12">
                {/* Hero Summary Card */}
                <div className="bg-white rounded-[56px] p-12 shadow-2xl shadow-blue-100 border border-white relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-20 -mt-20"></div>

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center justify-center p-6 bg-amber-50 rounded-full mb-8"
                    >
                        <Trophy size={64} className="text-amber-500" />
                    </motion.div>

                    <h2 className="text-4xl font-black text-slate-900 mb-4">{result.examTitle}</h2>

                    <div className="flex items-center justify-center gap-8 mb-12">
                        <div className="flex flex-col items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Điểm số</span>
                            <span className="text-6xl font-black text-blue-600 italic leading-none">{result.totalScore}<span className="text-2xl text-slate-300 not-italic">/{result.maxScore}</span></span>
                        </div>
                        <div className="w-px h-16 bg-slate-100"></div>
                        <div className="flex flex-col items-start gap-3">
                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                                <Clock size={18} className="text-slate-400" />
                                {result.durationMinutes} phút
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 font-bold">
                                <Calendar size={18} className="text-slate-400" />
                                {result.completedAt}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <div className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-200">
                            <BarChart3 size={20} />
                            Thống kê chi tiết
                        </div>
                    </div>
                </div>

                {/* Questions Breakdown */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 ml-4 flex items-center gap-3">
                        Chi tiết câu hỏi
                        <span className="px-3 py-1 bg-white text-slate-400 rounded-xl text-sm border font-bold">{result.questions.length} CÂU</span>
                    </h3>

                    {result.questions.map((q, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col md:flex-row gap-8 items-start">
                            <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${q.isCorrect === true ? 'bg-green-50 text-green-600' :
                                q.isCorrect === false ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'
                                }`}>
                                {i + 1}
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-slate-800 leading-relaxed">{q.content}</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 font-black text-sm">
                                            {q.isCorrect === true && <><CheckCircle size={16} className="text-green-500" /> <span className="text-green-600 uppercase">CHÍNH XÁC</span></>}
                                            {q.isCorrect === false && <><XCircle size={16} className="text-red-500" /> <span className="text-red-600 uppercase">CHƯA ĐÚNG</span></>}
                                            {q.isCorrect === null && <span className="text-slate-400 uppercase">CẦN GIÁO VIÊN CHẤM</span>}
                                        </div>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-blue-600 font-black tracking-widest">{q.earnedScore}/{q.maxScore} ĐIỂM</span>
                                    </div>
                                </div>

                                {q.comment && (
                                    <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-4">
                                        <MessageCircle size={20} className="text-slate-400 flex-shrink-0 mt-1" />
                                        <p className="text-slate-600 font-medium italic">"{q.comment}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default ExamResults;
