import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    ChevronLeft,
    Save,
    MessageSquare,
    Clock,
    FileText,
    Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ManualGrading: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const [attempts, setAttempts] = useState<any[]>([]);
    const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
    const [gradingData, setGradingData] = useState<any>(null);
    const [loadingAttempts, setLoadingAttempts] = useState(true);
    const [loadingGrading, setLoadingGrading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchAttempts = async () => {
            try {
                // Get results for this exam (which contains student info and total scores)
                const response = await api.get(`/reports/exam/${examId}`);
                setAttempts(response.data);
            } catch (error) {
                console.error("Failed to fetch attempts", error);
            } finally {
                setLoadingAttempts(false);
            }
        };
        fetchAttempts();
    }, [examId]);

    useEffect(() => {
        if (!selectedAttemptId) return;

        const fetchGradingData = async () => {
            setLoadingGrading(true);
            try {
                // This would be a specialized endpoint to get questions needing manual grading for THIS attempt
                // For now use a general result endpoint or specialized one
                const response = await api.get(`/grading/result/${selectedAttemptId}`);
                setGradingData(response.data);
            } catch (error) {
                console.error("Failed to fetch grading data", error);
            } finally {
                setLoadingGrading(false);
            }
        };
        fetchGradingData();
    }, [selectedAttemptId]);

    const handleSaveGrade = async (questionId: number, score: number, comment: string) => {
        if (!selectedAttemptId) return;
        setIsSaving(true);
        try {
            await api.post(`/grading/manual-grade`, {
                attemptId: selectedAttemptId,
                questionId,
                score,
                comment
            });
            // Refresh grading data to get new total score
            const response = await api.get(`/grading/result/${selectedAttemptId}`);
            setGradingData(response.data);
        } catch (error) {
            console.error("Failed to save grade", error);
            alert("Lưu điểm thất bại");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-slate-50">
            <aside className="w-96 bg-white border-r border-slate-200 flex flex-col overflow-hidden shadow-2xl z-10">
                <div className="p-8 border-b border-slate-100 bg-white sticky top-0 z-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold mb-6 transition-all group">
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Quay lại
                    </button>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Bài nộp</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Chọn học sinh để chấm bài</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
                    {loadingAttempts ? (
                        <div className="p-8 text-center text-slate-400 font-medium italic">Đang tải danh sách...</div>
                    ) : attempts.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 font-medium italic">Chưa có bài nộp nào.</div>
                    ) : attempts.map((attempt) => (
                        <button
                            key={attempt.id}
                            onClick={() => setSelectedAttemptId(attempt.id)}
                            className={`w-full text-left p-5 rounded-[32px] border-2 transition-all ${selectedAttemptId === attempt.id
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100'
                                : 'bg-white border-white hover:border-blue-100 text-slate-700 shadow-sm'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`font-black text-lg ${selectedAttemptId === attempt.id ? 'text-white' : 'text-slate-900'}`}>
                                    {attempt.studentName}
                                </span>
                                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${selectedAttemptId === attempt.id
                                    ? 'bg-white/20 text-white'
                                    : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                    }`}>
                                    {attempt.score >= 0 ? `${attempt.score}đ` : 'Chờ chấm'}
                                </span>
                            </div>
                            <div className={`text-xs flex items-center gap-2 font-bold ${selectedAttemptId === attempt.id ? 'text-blue-100' : 'text-slate-400'}`}>
                                <Clock size={14} /> Nộp lúc: {new Date(attempt.completedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
                <AnimatePresence mode="wait">
                    {selectedAttemptId && gradingData ? (
                        <motion.div
                            key={selectedAttemptId}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="max-w-4xl mx-auto space-y-12 pb-24"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 leading-tight">
                                        {gradingData.studentName || 'Học sinh'}
                                    </h1>
                                    <p className="text-slate-500 mt-2 font-bold text-lg">Hệ thống gợi ý chấm các câu tự luận & vẽ.</p>
                                </div>
                                <div className="flex items-center gap-6 bg-white p-6 rounded-[40px] shadow-xl border border-white px-10">
                                    <div className="text-right">
                                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] block mb-1">Tổng điểm</span>
                                        <span className="text-4xl font-black text-blue-600">{gradingData.score}</span>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black">/10</div>
                                </div>
                            </div>

                            {gradingData.questionGrades?.filter((q: any) => q.requiresManualGrading).map((q: any) => (
                                <GradingItem key={q.questionId} question={q} onSave={handleSaveGrade} isSaving={isSaving} />
                            ))}

                            <div className="pt-12 flex justify-center">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-16 py-6 bg-slate-900 hover:bg-black text-white rounded-[40px] font-black text-xl transition-all shadow-2xl flex items-center gap-4 active:scale-95 group"
                                >
                                    <CheckCircle size={28} className="group-hover:scale-110 transition-transform" />
                                    Hoàn tất chấm bài
                                </button>
                            </div>
                        </motion.div>
                    ) : selectedAttemptId && loadingGrading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
                            <span className="font-bold">Đang tải nội dung bài làm...</span>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6">
                            <div className="w-32 h-32 bg-white rounded-[40px] shadow-xl flex items-center justify-center">
                                <FileText size={64} className="text-slate-100" />
                            </div>
                            <div className="text-center">
                                <p className="font-black text-2xl text-slate-400 mb-2">Chọn một bài nộp</p>
                                <p className="font-bold text-slate-400/50">Vui lòng chọn học sinh ở danh sách bên trái để chấm điểm.</p>
                            </div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

const GradingItem = ({ question, onSave, isSaving }: any) => {
    const [score, setScore] = useState(question.score);
    const [comment, setComment] = useState(question.comment || '');

    return (
        <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden mb-12">
            <div className="p-10 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
                <div className="space-y-4 max-w-2xl">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest">
                        {question.questionContent.includes('vẽ') ? <Palette size={16} /> : <FileText size={16} />}
                        {question.questionContent.includes('vẽ') ? 'Hình vẽ/Sơ đồ' : 'Tự luận'}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: question.questionContent }} />
                </div>
                <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-inner">
                    <input
                        type="number"
                        value={score}
                        onChange={(e) => setScore(parseFloat(e.target.value))}
                        step="0.1"
                        max={question.maxScore}
                        className="w-24 p-2 bg-transparent text-center font-black text-2xl text-blue-600 outline-none"
                    />
                    <span className="text-slate-300 font-black text-xl">/ {question.maxScore}</span>
                </div>
            </div>

            <div className="p-10 space-y-10">
                <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Nội dung bài làm của học sinh</h4>
                    {question.textAnswer ? (
                        <div className="p-8 bg-slate-50 rounded-[32px] text-slate-700 leading-relaxed font-medium text-lg border border-slate-100 shadow-inner italic">
                            "{question.textAnswer}"
                        </div>
                    ) : (
                        <div className="h-80 bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
                            <Palette size={48} className="text-slate-200" />
                            <p className="font-bold text-lg">[Hình vẽ sơ đồ mô phỏng]</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end pt-6 border-t border-slate-100">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <MessageSquare size={16} /> Nhận xét bài làm
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full h-32 p-6 bg-slate-50 rounded-[32px] border-none focus:ring-4 focus:ring-blue-100 transition-all outline-none text-slate-700 font-bold placeholder-slate-300"
                            placeholder="Ghi chú cho học sinh (ví dụ: trình bày tốt, sơ đồ thiếu chi tiết...)"
                        ></textarea>
                    </div>
                    <div className="flex justify-end">
                        <button
                            onClick={() => onSave(question.questionId, score, comment)}
                            disabled={isSaving}
                            className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-[32px] font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-100 active:scale-95 disabled:opacity-50"
                        >
                            <Save size={20} />
                            {isSaving ? 'Đang lưu...' : 'Lưu điểm & Nhận xét'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualGrading;
