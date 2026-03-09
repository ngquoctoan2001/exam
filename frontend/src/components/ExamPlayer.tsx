import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import {
    ChevronLeft,
    ChevronRight,
    Send,
    Clock,
    Save,
    RotateCcw,
    Pencil,
    Eraser,
    Undo,
    Redo,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ExamPlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [attempt, setAttempt] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>('');
    const [answers, setAnswers] = useState<Record<number, any>>({});
    const canvasRef = useRef<any>(null);

    // Load Attempt on Mount
    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                // Try to get current attempt first, if not exists, start new
                let response;
                try {
                    response = await api.get(`/examattempts/current/${id}`);
                } catch (e) {
                    response = await api.post(`/examattempts/start/${id}`);
                }

                setAttempt(response.data);
                setTimeLeft(response.data.remainingSeconds);

                // Initialize answers from attempt data if available
                const initialAnswers: Record<number, any> = {};
                response.data.questions.forEach((q: any) => {
                    if (q.currentAnswer) {
                        initialAnswers[q.questionId] = q.currentAnswer;
                    }
                });
                setAnswers(initialAnswers);
            } catch (error) {
                console.error("Failed to fetch exam attempt", error);
            }
        };
        fetchAttempt();
    }, [id]);

    const saveAnswer = async (questionId: number, answerData: any) => {
        if (!attempt) return;
        setIsAutoSaving(true);
        try {
            await api.post(`/examattempts/${attempt.id}/save`, {
                questionId,
                textAnswer: answerData.textAnswer,
                selectedOptionIds: answerData.selectedOptionIds,
                canvasDataJson: answerData.canvasDataJson
            });
            setLastSaved(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
        } catch (error) {
            console.error("Failed to save answer", error);
        } finally {
            setTimeout(() => setIsAutoSaving(false), 500);
        }
    };

    const handleOptionChange = (questionId: number, optionId: number) => {
        const newAnswers = { ...answers, [questionId]: { selectedOptionIds: [optionId] } };
        setAnswers(newAnswers);
        saveAnswer(questionId, { selectedOptionIds: [optionId] });
    };

    const handleTextChange = (questionId: number, text: string) => {
        const newAnswers = { ...answers, [questionId]: { textAnswer: text } };
        setAnswers(newAnswers);
    };

    const handleTextBlur = (questionId: number) => {
        const answer = answers[questionId];
        if (answer) {
            saveAnswer(questionId, { textAnswer: answer.textAnswer });
        }
    };

    const handleCanvasSave = async (questionId: number) => {
        if (canvasRef.current) {
            const paths = await canvasRef.current.exportPaths();
            const canvasDataJson = JSON.stringify(paths);
            const newAnswers = { ...answers, [questionId]: { canvasDataJson } };
            setAnswers(newAnswers);
            saveAnswer(questionId, { canvasDataJson });
        }
    };

    const handleSubmit = async () => {
        if (!attempt) return;
        if (window.confirm("Bạn có chắc chắn muốn nộp bài?")) {
            try {
                await api.post(`/examattempts/${attempt.id}/submit`);
                alert("Nộp bài thành công!");
                navigate('/admin/dashboard'); // Or results page
            } catch (error) {
                alert("Nộp bài thất bại. Vui lòng thử lại.");
            }
        }
    };

    // Tab switching detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && attempt) {
                // Log violation
                api.post(`/activitylogs`, {
                    action: 'TAB_SWITCH',
                    details: `Học sinh chuyển tab khi đang làm bài thi ${attempt.examTitle}`
                }).catch(console.error);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [attempt]);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Handle auto-submit here if needed
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (!attempt) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
            />
            <span className="font-bold text-slate-400">Khởi tạo bài thi...</span>
        </div>
    );

    const questions = attempt.questions;
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.questionId] || {};

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                        {attempt.examTitle.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">{attempt.examTitle}</h1>
                        <p className="text-xs text-slate-500 font-medium">Đang trong quá trình làm bài</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${timeLeft < 300 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'} transition-colors`}>
                        <Clock size={20} className={timeLeft < 300 ? 'animate-pulse' : ''} />
                        <span className="text-xl font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
                    >
                        <Send size={18} />
                        Nộp bài
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-4xl mx-auto space-y-8 pb-32"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold tracking-wider uppercase">
                                        Câu {currentQuestionIndex + 1}
                                    </span>
                                    {answers[currentQuestion.questionId] && (
                                        <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1 uppercase tracking-tighter">
                                            <Save size={12} /> Đã trả lời
                                        </span>
                                    )}
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: currentQuestion.content }}
                                />
                            </div>

                            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-white">
                                {/* Trắc nghiệm (Multiple Choice) - ID: 1 */}
                                {currentQuestion.questionTypeId === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {currentQuestion.options?.map((opt: any) => (
                                            <label
                                                key={opt.id}
                                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${currentAnswer.selectedOptionIds?.includes(opt.id)
                                                        ? 'bg-blue-50 border-blue-500 shadow-md shadow-blue-100'
                                                        : 'border-slate-100 hover:bg-slate-50'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`q-${currentQuestion.id}`}
                                                    className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                                                    checked={currentAnswer.selectedOptionIds?.includes(opt.id)}
                                                    onChange={() => handleOptionChange(currentQuestion.questionId, opt.id)}
                                                />
                                                <div className="flex-1">
                                                    <span className={`block text-xs font-bold ${currentAnswer.selectedOptionIds?.includes(opt.id) ? 'text-blue-600' : 'text-slate-400'} mb-1`}>
                                                        Lựa chọn {opt.optionLabel}
                                                    </span>
                                                    <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">
                                                        {opt.content}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {/* Tự luận (Essay) - ID: 2 */}
                                {currentQuestion.questionTypeId === 2 && (
                                    <div className="space-y-4">
                                        <textarea
                                            className="w-full h-80 p-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 placeholder-slate-400 font-medium resize-none leading-relaxed"
                                            placeholder="Gõ nội dung bài làm tại đây..."
                                            value={currentAnswer.textAnswer || ''}
                                            onChange={(e) => handleTextChange(currentQuestion.questionId, e.target.value)}
                                            onBlur={() => handleTextBlur(currentQuestion.questionId)}
                                        ></textarea>
                                        <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
                                            <span>Nhấn ra ngoài để lưu tự động</span>
                                            <span>Số ký tự: {(currentAnswer.textAnswer || '').length}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Vẽ/Sơ đồ (Sketch/Canvas) - ID: 5 */}
                                {currentQuestion.questionTypeId === 5 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex gap-1">
                                                <button onClick={() => canvasRef.current?.eraseMode(false)} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Bút vẽ"><Pencil size={20} /></button>
                                                <button onClick={() => canvasRef.current?.eraseMode(true)} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Tẩy"><Eraser size={20} /></button>
                                                <div className="w-px h-8 bg-slate-200 mx-2 self-center"></div>
                                                <button onClick={() => canvasRef.current?.undo()} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Hoàn tác"><Undo size={20} /></button>
                                                <button onClick={() => canvasRef.current?.redo()} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Làm lại"><Redo size={20} /></button>
                                            </div>
                                            <div className="flex gap-2 mr-2">
                                                <button
                                                    onClick={() => canvasRef.current?.clearCanvas()}
                                                    className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    Xóa hết
                                                </button>
                                                <button
                                                    onClick={() => handleCanvasSave(currentQuestion.questionId)}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 flex items-center gap-2"
                                                >
                                                    <Save size={16} /> Lưu hình vẽ
                                                </button>
                                            </div>
                                        </div>
                                        <div className="h-[500px] border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden bg-white shadow-inner">
                                            <ReactSketchCanvas
                                                ref={canvasRef}
                                                strokeWidth={4}
                                                strokeColor="#2563eb"
                                                canvasColor="#ffffff"
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Bar */}
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/50 z-30">
                        <button
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            disabled={currentQuestionIndex === 0}
                            className="p-3 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all active:scale-90"
                        >
                            <ChevronLeft size={28} strokeWidth={3} />
                        </button>

                        <div className="flex items-center gap-4 px-6 border-x border-slate-100">
                            {questions.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentQuestionIndex === i
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110'
                                        : answers[questions[i].questionId]
                                            ? 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border border-transparent'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className="p-3 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-all active:scale-90"
                        >
                            <ChevronRight size={28} strokeWidth={3} />
                        </button>
                    </div>
                </main>

                {/* Sidebar Info */}
                <aside className="w-80 bg-white border-l border-slate-200 flex flex-col p-8 sticky top-0 h-screen hidden 2xl:flex">
                    <div className="bg-slate-50 rounded-[32px] p-6 mb-8 border border-white shadow-inner">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Trạng thái bài làm</h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 font-medium">Hoàn thành</span>
                                <span className="text-lg font-bold text-blue-600">
                                    {Object.keys(answers).length} / {questions.length}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                                    className="bg-blue-600 h-full shadow-lg shadow-blue-100"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-600 rounded-[32px] text-white shadow-xl shadow-blue-100 mb-8 overflow-hidden relative">
                        <div className="relative z-10">
                            <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-2">Lưu ý quan trọng</h4>
                            <p className="text-sm font-medium leading-relaxed">
                                Hệ thống sẽ tự động nộp bài khi hết thời gian. Đừng quên nhấn "Lưu hình vẽ" cho câu hỏi sơ đồ!
                            </p>
                        </div>
                        <AlertCircle className="absolute -bottom-4 -right-4 w-24 h-24 text-blue-500/30 rotate-12" />
                    </div>

                    <div className="mt-auto flex flex-col items-center gap-3 py-4 border-t border-slate-100">
                        {isAutoSaving ? (
                            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                                    <RotateCcw size={12} />
                                </motion.div>
                                Đang đồng bộ...
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                <Save size={12} /> Đồng bộ lúc {lastSaved || '--:--'}
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ExamPlayer;
