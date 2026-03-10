import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Save,
    Plus,
    Users,
    Search,
    Clock,
    Calendar,
    Settings,
    BookOpen
} from 'lucide-react';
import api from '../services/api';
import authService from '../services/auth.service';

const ExamCreate: React.FC = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);
    const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        subjectId: '',
        durationMinutes: 60,
        startTime: '',
        endTime: '',
        selectedClassIds: [] as number[],
        passingScore: 5.0,
        settings: {
            shuffleQuestions: true,
            shuffleAnswers: true,
            showResultImmediately: true,
            allowReview: true,
            antiCheat: true
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sRes, cRes, qRes] = await Promise.all([
                    api.get('/subjects'),
                    api.get('/classes'),
                    api.get('/questions')
                ]);
                setSubjects(sRes.data);
                setClasses(cRes.data);
                setQuestions(qRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };
        fetchData();
    }, []);

    const toggleClass = (classId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedClassIds: prev.selectedClassIds.includes(classId)
                ? prev.selectedClassIds.filter(id => id !== classId)
                : [...prev.selectedClassIds, classId]
        }));
    };

    const toggleQuestion = (question: any) => {
        if (selectedQuestions.some(q => q.id === question.id)) {
            setSelectedQuestions(prev => prev.filter(q => q.id !== question.id));
        } else {
            setSelectedQuestions(prev => [...prev, question]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.selectedClassIds.length === 0) {
            alert("Vui lòng chọn ít nhất một lớp học cho kỳ thi.");
            return;
        }
        if (selectedQuestions.length === 0) {
            alert("Vui lòng chọn ít nhất một câu hỏi cho đề thi.");
            return;
        }

        const user = authService.getCurrentUser();

        try {
            // 1. Create the exam
            const createPayload = {
                title: formData.title,
                subjectId: parseInt(formData.subjectId),
                teacherId: user?.id || 1,
                durationMinutes: formData.durationMinutes,
                startTime: new Date(formData.startTime).toISOString(),
                endTime: new Date(formData.endTime).toISOString(),
                classIds: formData.selectedClassIds,
                settings: formData.settings
            };

            const examResponse = await api.post('/exams', createPayload);
            const newExamId = examResponse.data.id;

            // 2. Assign questions if selected
            if (selectedQuestions.length > 0) {
                await api.post(`/exams/${newExamId}/questions`, selectedQuestions.map(q => q.id));
            }

            alert("Tạo kỳ thi thành công!");
            navigate('/admin/exams');
        } catch (error) {
            console.error("Failed to create exam", error);
            alert("Tạo kỳ thi thất bại. Vui lòng kiểm tra lại thông tin.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 leading-tight">Tạo kỳ thi mới</h1>
                        <p className="text-slate-500 font-medium">Thiết lập cấu hình và đề thi cho kỳ thi sắp tới.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[32px] font-black flex items-center gap-3 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                    <Save size={20} />
                    Lưu kỳ thi
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-white p-8 rounded-[40px] shadow-xl border border-white space-y-6">
                        <div className="flex items-center gap-3 text-blue-600 mb-2">
                            <Settings size={20} className="font-bold" />
                            <h2 className="font-black uppercase tracking-widest text-xs">Cấu hình chung</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">Tên kỳ thi</label>
                                <input
                                    type="text"
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold placeholder-slate-300"
                                    placeholder="Ví dụ: Kiểm tra học kỳ I"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">Môn học</label>
                                <select
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                                    value={formData.subjectId}
                                    onChange={e => setFormData({ ...formData, subjectId: e.target.value })}
                                >
                                    <option value="">Chọn môn học</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">Thời gian làm bài (Phút)</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input
                                        type="number"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                                        value={formData.durationMinutes}
                                        onChange={e => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">Ngày bắt đầu</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input
                                        type="datetime-local"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                                        value={formData.startTime}
                                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-400 mb-2 ml-1">Ngày kết thúc</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    <input
                                        type="datetime-local"
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-blue-100 outline-none transition-all font-bold"
                                        value={formData.endTime}
                                        onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-[40px] shadow-xl border border-white space-y-6">
                        <div className="flex items-center gap-3 text-amber-600 mb-2">
                            <Settings size={20} className="font-bold" />
                            <h2 className="font-black uppercase tracking-widest text-xs">Cài đặt nâng cao</h2>
                        </div>
                        <div className="space-y-4">
                            {[
                                { key: 'shuffleQuestions', label: 'Tráo thứ tự câu hỏi' },
                                { key: 'shuffleAnswers', label: 'Tráo thứ tự đáp án' },
                                { key: 'showResultImmediately', label: 'Xem điểm ngay sau nộp' },
                                { key: 'allowReview', label: 'Cho phép xem lại bài' },
                                { key: 'antiCheat', label: 'Bật chống gian lận (Tab)' }
                            ].map((item: any) => (
                                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                                    <button
                                        onClick={() => setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                [item.key]: !(formData.settings as any)[item.key]
                                            }
                                        })}
                                        className={`w-12 h-6 rounded-full transition-all relative ${(formData.settings as any)[item.key] ? 'bg-blue-600' : 'bg-slate-200'}`}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${(formData.settings as any)[item.key] ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white p-8 rounded-[40px] shadow-xl border border-white space-y-6">
                        <div className="flex items-center gap-3 text-indigo-600 mb-2">
                            <Users size={20} className="font-bold" />
                            <h2 className="font-black uppercase tracking-widest text-xs">Phân quyền lớp học</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {classes.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => toggleClass(c.id)}
                                    className={`p-3 rounded-2xl text-xs font-bold border-2 transition-all ${formData.selectedClassIds.includes(c.id)
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-100'
                                        }`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-white p-8 rounded-[40px] shadow-xl border border-white space-y-8 min-h-[600px] flex flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-emerald-600 mb-2">
                                <BookOpen size={20} className="font-bold" />
                                <h2 className="font-black uppercase tracking-widest text-xs">Chọn câu hỏi cho đề thi</h2>
                            </div>
                            <span className="text-xs font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-tighter">
                                Đã chọn {selectedQuestions.length} câu hỏi
                            </span>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-100 outline-none transition-all font-bold placeholder-slate-300 text-sm"
                                placeholder="Tìm kiếm câu hỏi trong ngân hàng..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {questions
                                .filter(q => formData.subjectId === '' || q.subjectId.toString() === formData.subjectId)
                                .filter(q => q.content.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(q => (
                                    <div
                                        key={q.id}
                                        onClick={() => toggleQuestion(q)}
                                        className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all flex items-start gap-4 ${selectedQuestions.some(sq => sq.id === q.id)
                                            ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-50'
                                            : 'bg-white border-slate-50 hover:border-emerald-100'
                                            }`}
                                    >
                                        <div className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedQuestions.some(sq => sq.id === q.id)
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : 'border-slate-200'
                                            }`}>
                                            {selectedQuestions.some(sq => sq.id === q.id) && <Plus size={14} strokeWidth={4} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex gap-2 mb-2">
                                                <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-lg tracking-widest">{q.questionTypeName}</span>
                                                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-lg tracking-widest ${q.difficultyLevel === 1 ? 'bg-emerald-50 text-emerald-600' :
                                                    q.difficultyLevel === 5 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
                                                    }`}>Độ khó: {q.difficultyLevel}</span>
                                            </div>
                                            <p className="text-slate-700 font-bold leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: q.content }} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ExamCreate;
