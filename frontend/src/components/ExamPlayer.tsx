import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
    Redo
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ExamPlayer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [attempt, setAttempt] = useState<any>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isAutoSaving, setIsAutoSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>('');
    const canvasRef = useRef<any>(null);

    // Load Attempt on Mount
    useEffect(() => {
        const fetchAttempt = async () => {
            try {
                // Mocking API call for now, but structure follows backend
                // const response = await axios.post(`/api/examattempts/start/${id}`);
                // setAttempt(response.data);
                // setTimeLeft(response.data.remainingSeconds);

                // Mock data for demo
                const mockAttempt = {
                    id: 123,
                    examTitle: "Kiểm tra Học kỳ I - Môn Toán",
                    remainingSeconds: 3600,
                    questions: [
                        { id: 101, questionId: 1, questionTypeId: 1, content: 'Thủ đô của Việt Nam là gì?', options: [{ id: 1, optionLabel: 'A', content: 'TP.HCM' }, { id: 2, optionLabel: 'B', content: 'Hà Nội' }, { id: 3, optionLabel: 'C', content: 'Đà Nẵng' }, { id: 4, optionLabel: 'D', content: 'Hải Phòng' }] },
                        { id: 102, questionId: 2, questionTypeId: 2, content: 'Hãy nêu cảm nghĩ của em về bài thơ "Sóng" của Xuân Quỳnh.' },
                        { id: 103, questionId: 3, questionTypeId: 5, content: 'Hãy vẽ sơ đồ cấu tạo của nguyên tử Hydro.' },
                    ]
                };
                setAttempt(mockAttempt);
                setTimeLeft(mockAttempt.remainingSeconds);
            } catch (error) {
                console.error("Failed to fetch exam attempt", error);
            }
        };
        fetchAttempt();
    }, [id]);

    // Auto-save logic (runs every 30 seconds or on change)
    useEffect(() => {
        const autoSave = async () => {
            if (!attempt) return;
            setIsAutoSaving(true);
            try {
                // await axios.post(`/api/examattempts/${attempt.id}/save`, { ...currentAnswer });
                setLastSaved(new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }));
            } finally {
                setTimeout(() => setIsAutoSaving(false), 1000);
            }
        };

        const interval = setInterval(autoSave, 30000);
        return () => clearInterval(interval);
    }, [attempt, currentQuestionIndex]);

    if (!attempt) return <div className="h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-400">Đang tải bài thi...</div>;

    const questions = attempt.questions;
    const currentQuestion = questions[currentQuestionIndex];

    // Tab switching detection
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                console.warn('Student switched tab!');
                // TODO: Call API to log this event in activity_logs
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Header */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 z-20 sticky top-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
                        {attempt.examTitle.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">{attempt.examTitle}</h1>
                        <p className="text-xs text-slate-500 font-medium">Học sinh: Nguyễn Văn A • Lớp 10A1</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl border ${timeLeft < 300 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-blue-50 border-blue-100 text-blue-600'} transition-colors`}>
                        <Clock size={20} className={timeLeft < 300 ? 'animate-pulse' : ''} />
                        <span className="text-xl font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95">
                        <Send size={18} />
                        Nộp bài
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-12 relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQuestionIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="max-w-4xl mx-auto space-y-8"
                        >
                            <div className="space-y-4">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold tracking-wider uppercase">
                                    Câu hỏi {currentQuestionIndex + 1}
                                </span>
                                <h2 className="text-2xl font-bold text-slate-800 leading-relaxed">
                                    {currentQuestion.content}
                                </h2>
                            </div>

                            {/* Answer Area */}
                            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-slate-200/50 border border-white">
                                {currentQuestion.questionTypeId === 1 && (
                                    <div className="space-y-4">
                                        {currentQuestion.options?.map((opt: any, i: number) => (
                                            <label key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group">
                                                <input type="radio" name="mcq" className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-slate-300" />
                                                <span className="text-slate-700 font-medium group-hover:text-blue-700 transition-colors">
                                                    {opt.optionLabel}. {opt.content}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.questionTypeId === 2 && (
                                    <textarea
                                        className="w-full h-64 p-6 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-100 outline-none text-slate-700 placeholder-slate-400 font-medium resize-none"
                                        placeholder="Nhập câu trả lời của bạn tại đây..."
                                    ></textarea>
                                )}

                                {currentQuestion.questionTypeId === 5 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-2xl">
                                            <button onClick={() => canvasRef.current?.eraseMode(false)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Bút vẽ"><Pencil size={20} /></button>
                                            <button onClick={() => canvasRef.current?.eraseMode(true)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Tẩy"><Eraser size={20} /></button>
                                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                            <button onClick={() => canvasRef.current?.clearCanvas()} className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-red-600 transition-all" title="Xóa tất cả"><RotateCcw size={20} /></button>
                                            <button onClick={() => canvasRef.current?.undo()} className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Hoàn tác"><Undo size={20} /></button>
                                            <button onClick={() => canvasRef.current?.redo()} className="p-2 hover:bg-white hover:shadow-sm rounded-xl text-slate-600 hover:text-blue-600 transition-all" title="Làm lại"><Redo size={20} /></button>
                                        </div>
                                        <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-3xl overflow-hidden bg-white">
                                            <ReactSketchCanvas
                                                ref={canvasRef}
                                                strokeWidth={4}
                                                strokeColor="#2563eb"
                                                className="w-full h-full"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Floating Navigation */}
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-4 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white z-20">
                        <button
                            onClick={handlePrev}
                            disabled={currentQuestionIndex === 0}
                            className="p-3 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div className="flex items-center gap-2 px-4">
                            <span className="text-xl font-bold text-blue-600">{currentQuestionIndex + 1}</span>
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-500 font-medium">{questions.length}</span>
                        </div>
                        <button
                            onClick={handleNext}
                            disabled={currentQuestionIndex === questions.length - 1}
                            className="p-3 text-slate-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </main>

                {/* Sidebar: Navigation Grid */}
                <aside className="w-80 bg-white border-l border-slate-200 flex flex-col p-8 sticky top-0 h-screen hidden xl:flex">
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Danh sách câu hỏi</h3>
                        <div className="grid grid-cols-4 gap-3">
                            {questions.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentQuestionIndex(i)}
                                    className={`w-12 h-12 rounded-2xl font-bold text-sm transition-all border ${currentQuestionIndex === i
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200'
                                        : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto space-y-6">
                        <div className="p-6 bg-slate-50 rounded-[32px] space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 font-medium">Đã hoàn thành</span>
                                <span className="text-blue-600 font-bold">1 / {questions.length}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-blue-600 h-full w-1/3 transition-all duration-500"></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                            {isAutoSaving ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    >
                                        <RotateCcw size={14} />
                                    </motion.div>
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save size={14} />
                                    Đã tự động lưu {lastSaved || '--:--'}
                                </>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ExamPlayer;
