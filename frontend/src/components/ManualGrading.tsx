import React, { useState, useEffect } from 'react';
import {
    ChevronLeft, Save, CheckCircle2, AlertCircle,
    MessageSquare, Award
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ManualGrading: React.FC = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<any>(null);
    const [scores, setScores] = useState<Record<number, number>>({});
    const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await api.get(`/grading/result/${attemptId}`);
                setResult(response.data);

                // Initialize manual scores/feedback
                const initialScores: Record<number, number> = {};
                const initialFeedbacks: Record<number, string> = {};

                response.data.questions.forEach((q: any) => {
                    if (q.type === 'Essay' || q.type === 'Drawing') {
                        initialScores[q.questionId] = q.score || 0;
                        initialFeedbacks[q.questionId] = q.teacherFeedback || '';
                    }
                });

                setScores(initialScores);
                setFeedbacks(initialFeedbacks);
            } catch (error) {
                console.error("Failed to fetch result", error);
            } finally {
                setLoading(false);
            }
        };
        if (attemptId) fetchResult();
    }, [attemptId]);

    const handleSaveScore = async (questionId: number) => {
        setSubmitting(true);
        try {
            await api.post('/grading/manual-grade', {
                attemptId: parseInt(attemptId!),
                questionId,
                score: scores[questionId],
                feedback: feedbacks[questionId]
            });
            alert("Đã lưu điểm câu hỏi!");
        } catch (error) {
            console.error("Failed to save score", error);
            alert("Có lỗi xảy ra khi lưu điểm.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleFinishGrading = async () => {
        navigate(-1);
    };

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold">Đang tải dữ liệu bài làm...</div>;

    const manualQuestions = result.questions.filter((q: any) => q.type === 'Essay' || q.type === 'Drawing');

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900">
                            Chấm bài: {result.studentName}
                        </h2>
                        <p className="text-slate-500 font-medium">Kỳ thi: {result.examTitle}</p>
                    </div>
                </div>
                <button
                    onClick={handleFinishGrading}
                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center gap-2"
                >
                    <CheckCircle2 size={20} />
                    Hoàn tất chấm bài
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-3 space-y-8">
                    {manualQuestions.length === 0 ? (
                        <div className="bg-amber-50 border border-amber-200 p-8 rounded-[32px] text-center">
                            <AlertCircle className="mx-auto text-amber-500 mb-4" size={48} />
                            <h3 className="text-lg font-bold text-amber-900">Không có câu hỏi cần chấm thủ công</h3>
                            <p className="text-amber-700 mt-1">Bài thi này chỉ chứa các câu hỏi trắc nghiệm đã được tự động chấm điểm.</p>
                        </div>
                    ) : manualQuestions.map((q: any, idx: number) => (
                        <div key={q.questionId} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden border-l-8 border-l-blue-600">
                            <div className="p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest">
                                        CÂU HỎI {idx + 1} • {q.type === 'Essay' ? 'TỰ LUẬN' : 'VẼ ĐỒ HỌA'}
                                    </span>
                                    <span className="text-sm font-bold text-slate-400">Điểm tối đa: {q.maxScore}</span>
                                </div>

                                <div className="p-6 bg-slate-900 rounded-3xl space-y-4">
                                    <div className="flex items-center gap-2 text-blue-400">
                                        <MessageSquare size={18} />
                                        <span className="text-xs font-black uppercase tracking-widest">BÀI LÀM CỦA HỌC SINH</span>
                                    </div>
                                    <div className="text-slate-100 font-medium">
                                        {q.studentAnswer || <span className="italic opacity-50">Không có câu trả lời.</span>}
                                    </div>
                                    {q.type === 'Drawing' && q.attachmentUrl && (
                                        <div className="mt-4 p-4 bg-white rounded-2xl overflow-hidden">
                                            <img src={q.attachmentUrl} alt="Drawing Answer" className="w-full h-auto" />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Award size={16} className="text-indigo-500" />
                                            ĐIỂM SỐ CẬP NHẬT
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                max={q.maxScore}
                                                className="w-32 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-black text-xl text-center"
                                                value={scores[q.questionId] || 0}
                                                onChange={(e) => setScores({ ...scores, [q.questionId]: parseFloat(e.target.value) })}
                                            />
                                            <span className="text-slate-300 font-bold">/ {q.maxScore}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">NHẬN XÉT CỦA GIÁO VIÊN</label>
                                        <textarea
                                            className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-100 outline-none transition-all font-medium min-h-[100px]"
                                            placeholder="Nhập nhận xét chi tiết cho học sinh..."
                                            value={feedbacks[q.questionId] || ''}
                                            onChange={(e) => setFeedbacks({ ...feedbacks, [q.questionId]: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSaveScore(q.questionId)}
                                    disabled={submitting}
                                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} />
                                    LƯU ĐIỂM CÂU HỎI
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Thông tin bài làm</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Học sinh</span>
                                <span className="text-slate-900 font-bold">{result.studentName}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Trạng thái</span>
                                <span className={`font-bold ${result.isGraded ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {result.isGraded ? 'Đã chấm' : 'Chờ chấm'}
                                </span>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-slate-100">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">ĐIỂM TỔNG TẠM TÍNH</p>
                            <h4 className="text-4xl font-black text-slate-900">{result.finalScore.toFixed(1)}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManualGrading;
