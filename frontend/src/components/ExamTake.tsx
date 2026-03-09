import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Clock,
    Send,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ExamTake: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const timerRef = useRef<any>(null);

    useEffect(() => {
        const startExam = async () => {
            try {
                const response = await api.post(`/examattempts/start/${examId}`);
                setAttempt(response.data);
                setTimeLeft(response.data.remainingSeconds);

                // Initialize answers if any
                const initialAnswers: Record<number, any> = {};
                // Note: Normally we'd fetch existing answers from the attempt
                setAnswers(initialAnswers);
            } catch (error) {
                console.error("Failed to start exam", error);
                alert("Không thể bắt đầu kỳ thi. Vui lòng thử lại.");
                navigate('/student/exams');
            } finally {
                setLoading(false);
            }
        };
        startExam();
    }, [examId]);

    useEffect(() => {
        if (timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswerChange = async (questionId: number, data: any) => {
        setAnswers(prev => ({ ...prev, [questionId]: data }));

        // Auto-save to backend
        try {
            await api.post(`/examattempts/save-answer/${attempt.id}`, {
                questionId,
                ...data
            });
        } catch (error) {
            console.error("Auto-save failed", error);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!window.confirm("Bạn có chắc chắn muốn nộp bài?")) return;

        setIsSubmitting(true);
        try {
            await api.post(`/examattempts/submit/${attempt.id}`);
            navigate(`/student/results/${attempt.id}`);
        } catch (error) {
            console.error("Submission failed", error);
            alert("Nộp bài thất bại. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-400 font-bold">Đang chuẩn bị đề thi...</div>;
    if (!attempt) return null;

    const currentQuestion = attempt.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Exam Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg shadow-blue-100">
                            <Clock size={24} className={timeLeft < 300 ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 leading-none">{attempt.examTitle}</h1>
                            <p className={`text-sm font-bold mt-1 ${timeLeft < 300 ? 'text-red-500' : 'text-slate-400'}`}>
                                Thời gian còn lại: {formatTime(timeLeft)}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-1 mr-4">
                            {attempt.questions.map((_: any, i: number) => (
                                <div
                                    key={i}
                                    className={`w-3 h-3 rounded-full transition-all ${i === currentQuestionIndex ? 'bg-blue-600 scale-125' :
                                            answers[attempt.questions[i].questionId] ? 'bg-emerald-400' : 'bg-slate-200'
                                        }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={handleSubmit}
                            className="bg-slate-900 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95"
                        >
                            <Send size={18} />
                            Nộp bài
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Question Area */}
                <div className="lg:col-span-3 space-y-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="bg-white rounded-[48px] p-12 shadow-xl border border-white min-h-[500px] flex flex-col"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <span className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl">
                                    {currentQuestionIndex + 1}
                                </span>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full">
                                    Câu hỏi {currentQuestionIndex + 1} / {attempt.questions.length}
                                </span>
                            </div>

                            <div className="prose prose-slate max-w-none flex-1">
                                <h2 className="text-2xl font-bold text-slate-800 leading-relaxed mb-10" dangerouslySetInnerHTML={{ __html: currentQuestion.content }} />

                                {/* Answer Input based on Type */}
                                <div className="space-y-4">
                                    {currentQuestion.questionTypeId === 1 && ( // MCQ Single
                                        <div className="grid grid-cols-1 gap-4">
                                            {currentQuestion.options.map((opt: any) => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => handleAnswerChange(currentQuestion.questionId, { selectedOptionIds: [opt.id] })}
                                                    className={`p-6 rounded-3xl border-2 text-left transition-all flex items-center gap-4 group ${answers[currentQuestion.questionId]?.selectedOptionIds?.includes(opt.id)
                                                            ? 'bg-blue-50 border-blue-500 shadow-lg shadow-blue-50'
                                                            : 'bg-white border-slate-50 hover:border-blue-100'
                                                        }`}
                                                >
                                                    <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center font-black transition-all ${answers[currentQuestion.questionId]?.selectedOptionIds?.includes(opt.id)
                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                            : 'border-slate-200 text-slate-400 group-hover:border-blue-200'
                                                        }`}>
                                                        {opt.optionLabel}
                                                    </div>
                                                    <span className="font-bold text-slate-700">{opt.content}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {currentQuestion.questionTypeId === 3 && ( // Essay
                                        <textarea
                                            className="w-full p-8 bg-slate-50 rounded-[32px] border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium text-slate-700 min-h-[300px]"
                                            placeholder="Viết câu trả lời của bạn tại đây..."
                                            value={answers[currentQuestion.questionId]?.textAnswer || ''}
                                            onChange={e => handleAnswerChange(currentQuestion.questionId, { textAnswer: e.target.value })}
                                        />
                                    )}

                                    {currentQuestion.questionTypeId === 4 && ( // Drawing
                                        <div className="bg-slate-100 rounded-[32px] aspect-video flex items-center justify-center border-4 border-dashed border-slate-200">
                                            <div className="text-center space-y-4">
                                                <AlertCircle size={48} className="text-slate-300 mx-auto" />
                                                <p className="text-slate-400 font-bold italic">Bảng vẽ đang được tải...</p>
                                                <button className="px-6 py-2 bg-white text-blue-600 rounded-xl font-bold shadow-sm">Mở bảng vẽ</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between px-4">
                        <button
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            className="p-4 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all disabled:opacity-30 disabled:shadow-none flex items-center gap-2 font-bold text-slate-600"
                        >
                            <ChevronLeft size={20} />
                            Câu trước
                        </button>
                        <div className="text-slate-400 font-black tracking-widest text-sm">
                            {currentQuestionIndex + 1} / {attempt.questions.length}
                        </div>
                        <button
                            disabled={currentQuestionIndex === attempt.questions.length - 1}
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            className="p-4 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-all disabled:opacity-30 disabled:shadow-none flex items-center gap-2 font-bold text-blue-600"
                        >
                            Câu tiếp theo
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Sidebar Question Grid */}
                <div className="hidden lg:block space-y-6">
                    <section className="bg-white p-8 rounded-[40px] shadow-xl border border-white">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 ml-1">Danh sách câu hỏi</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {attempt.questions.map((q: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    className={`w-full aspect-square rounded-2xl font-black text-sm flex items-center justify-center transition-all relative ${i === currentQuestionIndex
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100'
                                            : answers[q.questionId]
                                                ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500'
                                                : 'bg-slate-50 text-slate-400 border-2 border-transparent hover:border-blue-100'
                                        }`}
                                >
                                    {i + 1}
                                    {answers[q.questionId] && (
                                        <div className="absolute -top-1 -right-1 p-0.5 bg-white rounded-full">
                                            <CheckCircle2 size={12} className="text-emerald-500" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="bg-blue-600 p-8 rounded-[40px] shadow-xl shadow-blue-100 text-white space-y-4">
                        <h3 className="font-black italic text-xl">Lưu ý quan trọng</h3>
                        <ul className="space-y-3 opacity-90 text-sm font-medium list-disc pl-4">
                            <li>Bài làm sẽ được lưu tự động sau mỗi câu trả lời.</li>
                            <li>Khi hết thời gian, hệ thống sẽ tự nộp bài.</li>
                            <li>Không được làm mới trang web khi đang làm bài.</li>
                        </ul>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default ExamTake;
