import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    ChevronLeft,
    Save,
    MessageSquare,
    User,
    FileText,
    Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManualGrading: React.FC = () => {
    const { examId: _examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
    const [_isSaving, setIsSaving] = useState(false);

    // Mock data for attempts
    const attempts = [
        { id: 1, studentName: 'Nguyễn Văn A', startTime: '10:30', status: 'Đang chờ chấm', totalScore: 7.5 },
        { id: 2, studentName: 'Trần Thị B', startTime: '10:45', status: 'Đang chờ chấm', totalScore: 6.0 },
        { id: 3, studentName: 'Lê Văn C', startTime: '11:00', status: 'Đã hoàn thành', totalScore: 9.0 },
    ];

    // Mock data for questions for manual grading
    const manualQuestions = [
        {
            id: 102,
            type: 'essay',
            content: 'Hãy nêu cảm nghĩ của em về bài thơ "Sóng" của Xuân Quỳnh.',
            answer: 'Bài thơ Sóng của Xuân Quỳnh là một tác phẩm tiêu biểu về tình yêu...',
            maxScore: 2.0,
            currentScore: 0,
            comment: ''
        },
        {
            id: 103,
            type: 'canvas',
            content: 'Hãy vẽ sơ đồ cấu tạo của nguyên tử Hydro.',
            answerData: '{"version":"5.3.0","objects":[...]}',
            maxScore: 2.0,
            currentScore: 0,
            comment: ''
        }
    ];

    const handleSaveGrade = (_questionId: number) => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
            {/* Sidebar: Attempts List */}
            <aside className="w-96 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium mb-4 transition-colors">
                        <ChevronLeft size={20} />
                        Quay lại
                    </button>
                    <h2 className="text-xl font-bold text-slate-900">Danh sách bài nộp</h2>
                    <p className="text-sm text-slate-500 mt-1">Kỳ thi: Kiểm tra Học kỳ I - Môn Toán</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {attempts.map((attempt) => (
                        <button
                            key={attempt.id}
                            onClick={() => setSelectedAttemptId(attempt.id)}
                            className={`w-full text-left p-4 rounded-[24px] border transition-all ${selectedAttemptId === attempt.id
                                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100'
                                : 'bg-white border-slate-100 hover:border-blue-200 text-slate-700'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold">{attempt.studentName}</span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${selectedAttemptId === attempt.id ? 'bg-white/20' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {attempt.status}
                                </span>
                            </div>
                            <div className={`text-xs flex items-center gap-2 ${selectedAttemptId === attempt.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                <User size={12} /> Bắt đầu lúc: {attempt.startTime}
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            {/* Main Content: Grading Panel */}
            <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                <AnimatePresence mode="wait">
                    {selectedAttemptId ? (
                        <motion.div
                            key={selectedAttemptId}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-4xl mx-auto space-y-8"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h1 className="text-3xl font-black text-slate-900 leading-tight">Chấm bài: Nguyễn Văn A</h1>
                                    <p className="text-slate-500 mt-2 font-medium">Vui lòng kiểm tra các câu hỏi tự luận và hình vẽ.</p>
                                </div>
                                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100 px-8">
                                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Điểm tạm tính</span>
                                    <span className="text-3xl font-black text-blue-600">7.5</span>
                                </div>
                            </div>

                            {manualQuestions.map((q) => (
                                <div key={q.id} className="bg-white rounded-[40px] shadow-xl shadow-slate-200/50 border border-white overflow-hidden mb-8">
                                    <div className="p-8 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                                        <div className="space-y-3 max-w-2xl">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold uppercase">
                                                {q.type === 'essay' ? <FileText size={14} /> : <Palette size={14} />}
                                                {q.type === 'essay' ? 'Tự luận' : 'Hình vẽ'}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-800 leading-relaxed">{q.content}</h3>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                defaultValue={q.currentScore}
                                                step="0.1"
                                                max={q.maxScore}
                                                className="w-20 p-3 bg-white border border-slate-200 rounded-2xl text-center font-bold text-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                                            />
                                            <span className="text-slate-400 font-bold">/ {q.maxScore}</span>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="space-y-4">
                                            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nội dung bài làm</h4>
                                            {q.type === 'essay' ? (
                                                <div className="p-6 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed font-medium">
                                                    {q.answer}
                                                </div>
                                            ) : (
                                                <div className="h-64 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 font-medium">
                                                    [Hình vẽ sơ đồ mô phỏng]
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                                            <div className="space-y-3">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <MessageSquare size={14} /> Nhận xét của giáo viên
                                                </label>
                                                <textarea
                                                    className="w-full h-24 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 font-medium text-sm"
                                                    placeholder="Nhập nhận xét..."
                                                ></textarea>
                                            </div>
                                            <div className="flex items-end justify-end">
                                                <button
                                                    onClick={() => handleSaveGrade(q.id)}
                                                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95 whitespace-nowrap"
                                                >
                                                    <Save size={18} />
                                                    Lưu điểm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="pt-8 flex justify-center pb-20">
                                <button className="px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-[32px] font-black text-lg transition-all shadow-2xl flex items-center gap-3 active:scale-95">
                                    <CheckCircle size={24} />
                                    Hoàn tất chấm bài
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                                <FileText size={40} />
                            </div>
                            <p className="font-bold text-xl">Chọn một bài nộp để bắt đầu chấm điểm</p>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default ManualGrading;
