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
    AlertCircle,
    Bookmark,
    BookmarkCheck,
    CheckCircle2,
    Info
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
    const [markedQuestions, setMarkedQuestions] = useState<Set<number>>(new Set());
    const [showCheatWarning, setShowCheatWarning] = useState(false);
    const canvasRef = useRef<any>(null);

    // Question Type Constants
    const TYPE_MCQ = 1;
    const TYPE_ESSAY = 2;
    const TYPE_TRUE_FALSE = 3;
    const TYPE_SHORT_ANSWER = 4;
    const TYPE_DRAWING = 5;

    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                let response;
                try {
                    response = await api.get(`/examattempts/current/${id}`);
                } catch (e) {
                    response = await api.post(`/examattempts/start/${id}`);
                }

                setAttempt(response.data);
                setTimeLeft(response.data.remainingSeconds);

                const initialAnswers: Record<number, any> = {};
                response.data.questions.forEach((q: any) => {
                    if (q.currentAnswer) {
                        initialAnswers[q.questionId] = q.currentAnswer;
                    }
                });
                setAnswers(initialAnswers);
            } catch (error) {
                console.error("Failed to fetch exam attempt", error);
                alert("Không thể tải bài thi. Vui lòng thử lại.");
                navigate('/admin/dashboard');
            }
        };
        fetchAttempt();
    }, [id, navigate]);

    const saveAnswer = async (questionId: number, answerData: any) => {
        if (!attempt) return;
        setIsAutoSaving(true);
        try {
            await api.post(`/examattempts/${attempt.id}/save`, {
                questionId,
                ...answerData
            });
            setLastSaved(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } catch (error) {
            console.error("Failed to auto-save answer", error);
        } finally {
            setTimeout(() => setIsAutoSaving(false), 800);
        }
    };

    const handleOptionChange = (questionId: number, optionId: number) => {
        const newAnswers = { ...answers, [questionId]: { selectedOptionIds: [optionId] } };
        setAnswers(newAnswers);
        saveAnswer(questionId, { selectedOptionIds: [optionId] });
    };

    const handleTextChange = (questionId: number, text: string) => {
        const newAnswers = { ...answers, [questionId]: { ...answers[questionId], textAnswer: text } };
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
            const newAnswers = { ...answers, [questionId]: { ...answers[questionId], canvasDataJson } };
            setAnswers(newAnswers);
            saveAnswer(questionId, { canvasDataJson });
        }
    };

    const toggleMark = (index: number) => {
        const newMarked = new Set(markedQuestions);
        if (newMarked.has(index)) newMarked.delete(index);
        else newMarked.add(index);
        setMarkedQuestions(newMarked);
    };

    const handleSubmit = async () => {
        if (!attempt) return;
        const unansweredCount = attempt.questions.length - Object.keys(answers).length;
        const confirmMsg = unansweredCount > 0
            ? `Bạn còn ${unansweredCount} câu chưa làm. Bạn vẫn muốn nộp bài?`
            : "Bạn có chắc chắn muốn nộp bài?";

        if (window.confirm(confirmMsg)) {
            try {
                await api.post(`/examattempts/${attempt.id}/submit`);
                alert("Nộp bài thành công!");
                navigate(`/student/results/${attempt.id}`);
            } catch (error) {
                alert("Nộp bài thất bại. Vui lòng thử lại.");
            }
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && attempt) {
                setShowCheatWarning(true);
                api.post(`/activitylogs`, {
                    action: 'TAB_SWITCH',
                    details: JSON.stringify({
                        examId: attempt.examId,
                        examTitle: attempt.examTitle,
                        time: new Date().toISOString()
                    })
                }).catch(console.error);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [attempt]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
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
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full shadow-xl shadow-blue-100"
            />
            <span className="font-black text-slate-400 uppercase tracking-widest text-xs">Đang tải đề thi...</span>
        </div>
    );

    const currentQuestion = attempt.questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.questionId] || {};

    const formatTime = (seconds: number) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
            <AnimatePresence>
                {showCheatWarning && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border border-red-100 text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
                                <AlertCircle size={40} strokeWidth={2.5} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-slate-900">CẢNH BÁO VI PHẠM!</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">
                                    Hệ thống phát hiện bạn đã rời khỏi màn hình thi. Hành động này đã được ghi lại vào nhật ký hệ thống.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCheatWarning(false)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 active:scale-95 transition-all"
                            >
                                TÔI ĐÃ HIỂU
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-20 sticky top-0 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
                        {attempt.examTitle.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">{attempt.examTitle}</h1>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            Đang trong quá trình làm bài
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className={`flex items-center gap-4 px-6 py-2.5 rounded-[20px] border-2 transition-all ${timeLeft < 300 ? 'bg-red-50 border-red-200 text-red-600 shadow-lg shadow-red-50' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                        <Clock size={22} className={timeLeft < 300 ? 'animate-bounce' : ''} />
                        <span className="text-2xl font-mono font-black tabular-nums tracking-tighter">{formatTime(timeLeft)}</span>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-slate-200 active:scale-95 group"
                    >
                        <span>NỘP BÀI</span>
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 bg-white border-r border-slate-200 flex flex-col p-8 overflow-y-auto hidden xl:flex">
                    <section className="mb-10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bảng câu hỏi</h3>
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                                {Object.keys(answers).length}/{attempt.questions.length} XONG
                            </span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {attempt.questions.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    className={`relative w-full aspect-square rounded-2xl font-black text-sm flex items-center justify-center transition-all border-2 ${currentQuestionIndex === i
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-105 z-10'
                                            : markedQuestions.has(i)
                                                ? 'bg-amber-50 border-amber-400 text-amber-600'
                                                : answers[attempt.questions[i].questionId]
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-600'
                                                    : 'bg-slate-50 border-transparent text-slate-400 hover:border-slate-200'
                                        }`}
                                >
                                    {i + 1}
                                    {markedQuestions.has(i) && <div className="absolute -top-1 -right-1"><Bookmark size={12} className="fill-amber-500 text-amber-500" /></div>}
                                    {answers[attempt.questions[i].questionId] && !markedQuestions.has(i) && <div className="absolute -top-1 -right-1 bg-white rounded-full"><CheckCircle2 size={12} className="text-emerald-500" /></div>}
                                </button>
                            ))}
                        </div>
                    </section>

                    <div className="mt-auto space-y-4 pt-6 border-t border-slate-100">
                        <div className="bg-slate-50 p-6 rounded-[32px] border border-white shadow-inner space-y-3">
                            <div className="flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-wider mb-2">
                                <Info size={14} /> Chú dẫn
                            </div>
                            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-blue-600 rounded-md"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Đang xem</span></div>
                            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-emerald-500 rounded-md"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Đã trả lời</span></div>
                            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-amber-400 rounded-md"></div><span className="text-[10px] font-bold text-slate-500 uppercase">Đánh dấu sau</span></div>
                        </div>

                        <div className="flex flex-col items-center gap-2 py-2">
                            {isAutoSaving ? (
                                <div className="flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full">
                                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><RotateCcw size={12} /></motion.div>
                                    Đang đồng bộ...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest italic">
                                    <Save size={12} /> Đồng bộ lúc {lastSaved || '--:--:--'}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 relative bg-white">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="max-w-4xl mx-auto space-y-12 pb-40"
                        >
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="px-5 py-2 bg-blue-600 text-white rounded-2xl text-sm font-black tracking-wider shadow-lg shadow-blue-100">CÂU HỎI {currentQuestionIndex + 1}</span>
                                        <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest">{currentQuestion.questionTypeName || 'Đề thi'}</span>
                                    </div>
                                    <button
                                        onClick={() => toggleMark(currentQuestionIndex)}
                                        className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-xs transition-all ${markedQuestions.has(currentQuestionIndex) ? 'bg-amber-500 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-200 hover:border-amber-400 hover:text-amber-500'}`}
                                    >
                                        {markedQuestions.has(currentQuestionIndex) ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                                        {markedQuestions.has(currentQuestionIndex) ? 'ĐÃ ĐÁNH DẤU' : 'XEM LẠI SAU'}
                                    </button>
                                </div>
                                <h2 className="text-3xl font-extrabold text-slate-900 leading-[1.4]" dangerouslySetInnerHTML={{ __html: currentQuestion.content }} />
                            </div>

                            <div className="bg-slate-50 p-10 rounded-[48px] border-4 border-white shadow-xl">
                                {currentQuestion.questionTypeId === TYPE_MCQ && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {currentQuestion.options?.map((opt: any) => (
                                            <label key={opt.id} className={`flex items-center gap-5 p-6 rounded-3xl border-2 transition-all cursor-pointer group hover:scale-[1.02] ${currentAnswer.selectedOptionIds?.includes(opt.id) ? 'bg-white border-blue-600 shadow-xl' : 'border-slate-100 bg-white/50 hover:bg-white'}`}>
                                                <div className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-black text-lg transition-all ${currentAnswer.selectedOptionIds?.includes(opt.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>{opt.optionLabel}</div>
                                                <span className="text-slate-800 font-bold text-lg">{opt.content}</span>
                                                <input type="radio" name={`q-${currentQuestion.id}`} className="hidden" checked={currentAnswer.selectedOptionIds?.includes(opt.id)} onChange={() => handleOptionChange(currentQuestion.questionId, opt.id)} />
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.questionTypeId === TYPE_TRUE_FALSE && (
                                    <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
                                        {[{ label: 'Đúng', value: 1, color: 'emerald' }, { label: 'Sai', value: 0, color: 'red' }].map((choice) => (
                                            <button key={choice.label} onClick={() => handleOptionChange(currentQuestion.questionId, choice.value)} className={`flex-1 py-10 rounded-[32px] border-4 font-black text-2xl transition-all ${currentAnswer.selectedOptionIds?.includes(choice.value) ? `bg-white border-${choice.color}-500 text-${choice.color}-600 shadow-xl` : 'bg-white/50 border-transparent text-slate-300 hover:border-slate-200'}`}>{choice.label.toUpperCase()}</button>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.questionTypeId === TYPE_SHORT_ANSWER && (
                                    <div className="max-w-2xl mx-auto py-10">
                                        <input type="text" className="w-full p-8 bg-slate-900 text-white rounded-[32px] text-2xl font-black placeholder-slate-600 outline-none border-8 border-slate-800 focus:border-blue-600 transition-all text-center uppercase tracking-widest shadow-2xl" placeholder="NHẬP ĐÁP ÁN..." value={currentAnswer.textAnswer || ''} onChange={(e) => handleTextChange(currentQuestion.questionId, e.target.value)} onBlur={() => handleTextBlur(currentQuestion.questionId)} />
                                    </div>
                                )}

                                {currentQuestion.questionTypeId === TYPE_ESSAY && (
                                    <div className="space-y-4">
                                        <textarea className="w-full h-96 p-10 bg-white rounded-[40px] border-none focus:ring-[12px] focus:ring-blue-100 outline-none text-slate-700 placeholder-slate-300 font-bold text-lg resize-none leading-relaxed transition-all shadow-inner" placeholder="Trình bày chi tiết bài làm tại đây..." value={currentAnswer.textAnswer || ''} onChange={(e) => handleTextChange(currentQuestion.questionId, e.target.value)} onBlur={() => handleTextBlur(currentQuestion.questionId)}></textarea>
                                        <div className="flex justify-between text-[11px] text-slate-400 font-black uppercase tracking-widest px-6"><span>Tự động nộp lưu khi thay đổi</span><span>{(currentAnswer.textAnswer || '').length} KÝ TỰ</span></div>
                                    </div>
                                )}

                                {currentQuestion.questionTypeId === TYPE_DRAWING && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-3 bg-slate-900 text-white rounded-[32px] border-4 border-slate-800 shadow-2xl">
                                            <div className="flex gap-2 ml-2">
                                                <button onClick={() => canvasRef.current?.eraseMode(false)} className="p-3 hover:bg-white/10 rounded-2xl text-white hover:text-blue-400 transition-all"><Pencil size={24} /></button>
                                                <button onClick={() => canvasRef.current?.eraseMode(true)} className="p-3 hover:bg-white/10 rounded-2xl text-white hover:text-red-400 transition-all"><Eraser size={24} /></button>
                                                <div className="w-px h-10 bg-slate-700 mx-2 self-center"></div>
                                                <button onClick={() => canvasRef.current?.undo()} className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><Undo size={24} /></button>
                                                <button onClick={() => canvasRef.current?.redo()} className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><Redo size={24} /></button>
                                            </div>
                                            <button onClick={() => handleCanvasSave(currentQuestion.questionId)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-xs font-black shadow-lg flex items-center gap-2 active:scale-95 transition-all mr-2"><Save size={18} /> LƯU HÌNH VẼ</button>
                                        </div>
                                        <div className="h-[550px] border-8 border-white rounded-[48px] overflow-hidden bg-white shadow-inner relative group/canvas">
                                            <ReactSketchCanvas ref={canvasRef} strokeWidth={5} strokeColor="#1e293b" canvasColor="#ffffff" className="w-full h-full" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 px-10 py-5 bg-slate-900/90 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/10 z-40">
                        <button onClick={() => setCurrentQuestionIndex(prev => prev - 1)} disabled={currentQuestionIndex === 0} className="w-14 h-14 bg-white/5 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center disabled:opacity-10 transition-all active:scale-75"><ChevronLeft size={32} strokeWidth={3} /></button>
                        <div className="hidden sm:flex items-center gap-4 px-10 border-x border-white/10 h-10"><span className="text-white font-black text-2xl tabular-nums tracking-tighter">{currentQuestionIndex + 1} <span className="text-slate-500 text-lg mx-1">/</span> {attempt.questions.length}</span></div>
                        <button onClick={() => setCurrentQuestionIndex(prev => prev + 1)} disabled={currentQuestionIndex === attempt.questions.length - 1} className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center disabled:opacity-10 transition-all active:scale-75 shadow-lg shadow-blue-500/20"><ChevronRight size={32} strokeWidth={3} /></button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ExamPlayer;
